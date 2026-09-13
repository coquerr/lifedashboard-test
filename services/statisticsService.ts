import { getLastNDaysISO, startOfWeek, toISODate } from "@/lib/date";
import * as expensesService from "@/services/expensesService";
import * as focusService from "@/services/focusService";
import * as habitsService from "@/services/habitsService";
import * as waterService from "@/services/waterService";
import type { Expense } from "@/types/expenses";
import type { FocusLog, FocusTag } from "@/types/focus";
import type { Habit } from "@/types/habits";
import type { Task } from "@/types/tasks";
import type { WaterLog } from "@/types/water";

const FOCUS_TARGET_MINUTES = 60;
const WORKOUT_HABIT_ICON = "🏋️";
const MIN_COMPARISON_SAMPLE = 3;

export interface TodaySummary {
  tasksDone: number;
  tasksTotal: number;
  habitsDone: number;
  habitsTotal: number;
  focusMinutes: number;
  waterMl: number;
  waterGoalMl: number;
  expensesTotal: number;
}

export interface DayPoint {
  label: string;
  value: number;
}

export interface WeeklySeries {
  tasksCompleted: DayPoint[];
  focusMinutes: DayPoint[];
  water: DayPoint[];
  expenses: DayPoint[];
}

export interface DailyScoreBreakdown {
  tasks: number;
  habits: number;
  focus: number;
  water: number;
  other: number;
}

export interface DailyScore {
  total: number;
  label: string;
  breakdown: DailyScoreBreakdown;
}

export interface StackedDayPoint {
  label: string;
  segments: { tag: FocusTag; value: number }[];
}

/**
 * Направление "хорошей" динамики для метрики: rise — рост это хорошо
 * (задачи, вода), fall — падение это хорошо (расходы).
 */
export type ComparisonDirection = "rise" | "fall";

export interface WeekOverWeekComparison {
  currentTotal: number;
  previousTotal: number;
  percentChange: number | null;
  isPositive: boolean | null;
}

function capitalize(value: string): string {
  return value.length === 0 ? value : value[0].toUpperCase() + value.slice(1);
}

function weekdayLabel(isoDate: string): string {
  return capitalize(
    new Date(`${isoDate}T00:00:00`).toLocaleDateString("ru-RU", { weekday: "short" }),
  );
}

export function getTodaySummary(
  tasks: Task[],
  habits: Habit[],
  waterLog: WaterLog,
  focusLog: FocusLog,
  expenses: Expense[],
  today: string,
): TodaySummary {
  const todaysTasks = tasks.filter((task) => task.date === today);
  const todaysExpenses = expensesService.getExpensesInRange(expenses, today, today);

  return {
    tasksDone: todaysTasks.filter((task) => task.done).length,
    tasksTotal: todaysTasks.length,
    habitsDone: habits.filter((habit) => habitsService.isHabitDoneOnDate(habit, today)).length,
    habitsTotal: habits.length,
    focusMinutes: focusService.getMinutesForDate(focusLog, today),
    waterMl: waterService.getAmountForDate(waterLog, today),
    waterGoalMl: waterLog.goalMl,
    expensesTotal: expensesService.sumExpenses(todaysExpenses),
  };
}

export function getWeeklySeries(
  tasks: Task[],
  waterLog: WaterLog,
  focusLog: FocusLog,
  expenses: Expense[],
  referenceDate: Date,
): WeeklySeries {
  const days = getLastNDaysISO(7, referenceDate);

  const toPoint = (date: string, value: number): DayPoint => ({
    label: weekdayLabel(date),
    value,
  });

  return {
    tasksCompleted: days.map((date) =>
      toPoint(date, tasks.filter((task) => task.date === date && task.done).length),
    ),
    focusMinutes: days.map((date) =>
      toPoint(date, focusService.getMinutesForDate(focusLog, date)),
    ),
    water: days.map((date) => toPoint(date, waterService.getAmountForDate(waterLog, date))),
    expenses: days.map((date) =>
      toPoint(
        date,
        expensesService.sumExpenses(expensesService.getExpensesInRange(expenses, date, date)),
      ),
    ),
  };
}

/**
 * Недельная разбивка минут фокуса по тегам — данные для Stacked Bar
 * Chart. Агрегирует focusLog.entries (массив сессий) на лету, без
 * мутации исходного лога.
 */
export function getWeeklyFocusByTag(focusLog: FocusLog, referenceDate: Date): StackedDayPoint[] {
  const days = getLastNDaysISO(7, referenceDate);

  return days.map((date) => {
    const sessionsForDay = focusLog.entries.filter((session) => session.date === date);

    const byTag = new Map<FocusTag, number>();
    for (const session of sessionsForDay) {
      byTag.set(session.tag, (byTag.get(session.tag) ?? 0) + session.duration);
    }

    return {
      label: weekdayLabel(date),
      segments: Array.from(byTag.entries()).map(([tag, value]) => ({ tag, value })),
    };
  });
}

function scoreLabel(total: number): string {
  if (total >= 85) return "Great day";
  if (total >= 65) return "Good day";
  if (total >= 40) return "Steady day";
  return "Quiet day";
}

/**
 * Игровой показатель дня 0–100. НЕ медицинская и не объективная оценка
 * продуктивности — просто сводка активности по уже собранным данным.
 * Максимумы по категориям (30/25/20/15/10) — авторский выбор, в задаче
 * не заданы жёстко, только пример итогового вида.
 */
export function computeDailyScore(
  summary: TodaySummary,
  habits: Habit[],
  today: string,
): DailyScore {
  const tasksScore =
    summary.tasksTotal === 0 ? 0 : Math.round((summary.tasksDone / summary.tasksTotal) * 30);

  const habitsScore =
    summary.habitsTotal === 0 ? 0 : Math.round((summary.habitsDone / summary.habitsTotal) * 25);

  const focusScore = Math.round(Math.min(1, summary.focusMinutes / FOCUS_TARGET_MINUTES) * 20);

  const waterScore =
    summary.waterGoalMl === 0
      ? 0
      : Math.round(Math.min(1, summary.waterMl / summary.waterGoalMl) * 15);

  const hasWorkoutHabitDoneToday = habits.some(
    (habit) => habit.icon === WORKOUT_HABIT_ICON && habitsService.isHabitDoneOnDate(habit, today),
  );
  const otherScore = hasWorkoutHabitDoneToday ? 10 : 0;

  const total = Math.min(100, tasksScore + habitsScore + focusScore + waterScore + otherScore);

  return {
    total,
    label: scoreLabel(total),
    breakdown: {
      tasks: tasksScore,
      habits: habitsScore,
      focus: focusScore,
      water: waterScore,
      other: otherScore,
    },
  };
}

/**
 * Возвращает диапазон [start, end] "текущей недели по сегодня" и
 * симметричный диапазон той же длины на прошлой неделе — так сравнение
 * идёт "день к дню" (например, 3 дня этой недели против первых 3 дней
 * прошлой), а не полная неделя против неполной текущей.
 */
function getComparableWeekRanges(referenceDate: Date): {
  currentStartISO: string;
  currentEndISO: string;
  previousStartISO: string;
  previousEndISO: string;
} {
  const currentWeekStart = startOfWeek(referenceDate);
  const daysElapsed =
    Math.floor((referenceDate.getTime() - currentWeekStart.getTime()) / 86_400_000) + 1;

  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);
  const previousWeekComparableEnd = new Date(previousWeekStart);
  previousWeekComparableEnd.setDate(previousWeekComparableEnd.getDate() + daysElapsed - 1);

  return {
    currentStartISO: toISODate(currentWeekStart),
    currentEndISO: toISODate(referenceDate),
    previousStartISO: toISODate(previousWeekStart),
    previousEndISO: toISODate(previousWeekComparableEnd),
  };
}

/**
 * Обобщённая "неделя к неделе" агрегация: принимает произвольную
 * функцию суммирования значения за диапазон дат и направление хорошей
 * динамики (rise/fall), возвращает суммы + процент изменения.
 *
 * Используется для задач, воды и расходов — единая логика вместо трёх
 * почти одинаковых функций.
 */
export function compareWeekOverWeek(
  referenceDate: Date,
  direction: ComparisonDirection,
  sumForRange: (startISO: string, endISO: string) => number,
): WeekOverWeekComparison {
  const { currentStartISO, currentEndISO, previousStartISO, previousEndISO } =
    getComparableWeekRanges(referenceDate);

  const currentTotal = sumForRange(currentStartISO, currentEndISO);
  const previousTotal = sumForRange(previousStartISO, previousEndISO);

  if (previousTotal < MIN_COMPARISON_SAMPLE) {
    return { currentTotal, previousTotal, percentChange: null, isPositive: null };
  }

  const percentChange = Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
  const isPositive =
    percentChange === 0 ? null : direction === "rise" ? percentChange > 0 : percentChange < 0;

  return { currentTotal, previousTotal, percentChange, isPositive };
}

export function compareWeeklyTasksCount(tasks: Task[], referenceDate: Date): WeekOverWeekComparison {
  return compareWeekOverWeek(referenceDate, "rise", (startISO, endISO) =>
    tasks.filter((task) => task.done && task.date >= startISO && task.date <= endISO).length,
  );
}

/**
 * Суммирует воду за диапазон дат [startISO, endISO] включительно,
 * перебирая дни через уже существующую getAmountForDate — в
 * waterService нет отдельной функции для диапазона.
 */
function sumWaterInRange(waterLog: WaterLog, startISO: string, endISO: string): number {
  let total = 0;
  let cursor = new Date(`${startISO}T00:00:00`);
  const end = new Date(`${endISO}T00:00:00`);

  while (cursor <= end) {
    total += waterService.getAmountForDate(waterLog, toISODate(cursor));
    cursor = new Date(cursor);
    cursor.setDate(cursor.getDate() + 1);
  }

  return total;
}

export function compareWeeklyWater(waterLog: WaterLog, referenceDate: Date): WeekOverWeekComparison {
  return compareWeekOverWeek(referenceDate, "rise", (startISO, endISO) =>
    sumWaterInRange(waterLog, startISO, endISO),
  );
}

export function compareWeeklyExpenses(
  expenses: Expense[],
  referenceDate: Date,
): WeekOverWeekComparison {
  return compareWeekOverWeek(referenceDate, "fall", (startISO, endISO) =>
    expensesService.sumExpenses(expensesService.getExpensesInRange(expenses, startISO, endISO)),
  );
}