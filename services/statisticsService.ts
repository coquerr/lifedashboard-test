import { getLastNDaysISO, startOfWeek, toISODate } from "@/lib/date";
import * as expensesService from "@/services/expensesService";
import * as focusService from "@/services/focusService";
import * as habitsService from "@/services/habitsService";
import * as waterService from "@/services/waterService";
import type { Expense } from "@/types/expenses";
import type { FocusLog } from "@/types/focus";
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

export interface WeekComparison {
  message: string | null;
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
 * Сравнивает выполненные задачи "с начала этой недели по сегодня" с тем
 * же количеством дней прошлой недели (честное сравнение "день к дню",
 * а не полная прошлая неделя против неполной текущей).
 */
export function compareWeeklyTasks(tasks: Task[], referenceDate: Date): WeekComparison {
  const currentWeekStart = startOfWeek(referenceDate);
  const daysElapsed =
    Math.floor((referenceDate.getTime() - currentWeekStart.getTime()) / 86_400_000) + 1;

  const currentWeekStartISO = toISODate(currentWeekStart);
  const todayISOStr = toISODate(referenceDate);

  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);
  const previousWeekComparableEnd = new Date(previousWeekStart);
  previousWeekComparableEnd.setDate(previousWeekComparableEnd.getDate() + daysElapsed - 1);

  const previousWeekStartISO = toISODate(previousWeekStart);
  const previousWeekComparableEndISO = toISODate(previousWeekComparableEnd);

  const currentCount = tasks.filter(
    (task) => task.done && task.date >= currentWeekStartISO && task.date <= todayISOStr,
  ).length;

  const previousCount = tasks.filter(
    (task) =>
      task.done &&
      task.date >= previousWeekStartISO &&
      task.date <= previousWeekComparableEndISO,
  ).length;

  if (previousCount < MIN_COMPARISON_SAMPLE) {
    return { message: null };
  }

  const percentChange = Math.round(((currentCount - previousCount) / previousCount) * 100);

  if (percentChange === 0) {
    return { message: "На этой неделе ты выполняешь задачи так же активно, как на прошлой." };
  }

  const direction = percentChange > 0 ? "больше" : "меньше";
  return {
    message: `На этой неделе ты выполнил на ${Math.abs(percentChange)}% ${direction} задач, чем на прошлой за это же время.`,
  };
}