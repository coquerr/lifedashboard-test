"use client";

import { useMemo, useState } from "react";

import { Card } from "@/components/ui/Card";
import { addDaysISO, todayISO, toISODate } from "@/lib/date";
import { formatDuration, formatLiters, formatMoney } from "@/lib/format";
import * as statisticsService from "@/services/statisticsService";
import type { Expense } from "@/types/expenses";
import type { FocusLog } from "@/types/focus";
import type { Habit } from "@/types/habits";
import type { Task } from "@/types/tasks";
import type { WaterLog } from "@/types/water";

const WEEKS = 12;
const DAYS_PER_WEEK = 7;

interface ActivityHeatmapProps {
  tasks: Task[];
  habits: Habit[];
  waterLog: WaterLog;
  focusLog: FocusLog;
  expenses: Expense[];
}

const INTENSITY_OPACITY = [0.06, 0.25, 0.45, 0.7, 1] as const;

function intensityFromScore(score: number): number {
  if (score === 0) return 0;
  if (score < 25) return 1;
  if (score < 50) return 2;
  if (score < 75) return 3;
  return 4;
}

export function ActivityHeatmap({
  tasks,
  habits,
  waterLog,
  focusLog,
  expenses,
}: ActivityHeatmapProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const today = todayISO();

  const totalDays = WEEKS * DAYS_PER_WEEK;
  const startDate = addDaysISO(today, -(totalDays - 1));

  const days = useMemo(() => {
    return Array.from({ length: totalDays }, (_, index) => {
      const date = addDaysISO(startDate, index);
      const summary = statisticsService.getTodaySummary(
        tasks,
        habits,
        waterLog,
        focusLog,
        expenses,
        date,
      );
      const score = statisticsService.computeDailyScore(summary, habits, date);

      return { date, summary, score: score.total, intensity: intensityFromScore(score.total) };
    });
  }, [startDate, totalDays, tasks, habits, waterLog, focusLog, expenses]);

  const weeks = useMemo(() => {
    const result: (typeof days)[number][][] = [];
    for (let i = 0; i < days.length; i += DAYS_PER_WEEK) {
      result.push(days.slice(i, i + DAYS_PER_WEEK));
    }
    return result;
  }, [days]);

  const selectedDay = selectedDate ? days.find((day) => day.date === selectedDate) : null;

  return (
    <Card className="flex flex-col gap-4 p-5">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
        Активность · 12 недель
      </p>

      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-full justify-between gap-1.5 sm:gap-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1.5 sm:gap-2">
              {week.map((day) => {
                const isSelected = day.date === selectedDate;
                const isFuture = day.date > today;

                return (
                  <button
                    key={day.date}
                    type="button"
                    disabled={isFuture}
                    onClick={() => setSelectedDate((current) => (current === day.date ? null : day.date))}
                    aria-label={`${day.date}: ${day.score} баллов`}
                    className={`h-5 w-5 shrink-0 rounded-[4px] transition-transform disabled:opacity-0 sm:h-6 sm:w-6 ${
                      isSelected ? "ring-1 ring-vanta-accent ring-offset-1 ring-offset-vanta-surface" : ""
                    }`}
                    style={{
                      backgroundColor:
                        day.intensity === 0
                          ? "var(--color-vanta-surface-hover)"
                          : `rgba(201, 162, 75, ${INTENSITY_OPACITY[day.intensity]})`,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selectedDay ? (
        <div className="flex flex-col gap-3 border-t border-vanta-border pt-4">
          <p className="text-sm font-medium text-vanta-text">
            {new Date(`${selectedDay.date}T00:00:00`).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              weekday: "long",
            })}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-vanta-border px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-vanta-text-dim">Задачи</p>
              <p className="mt-0.5 text-sm text-vanta-text">
                {selectedDay.summary.tasksDone}/{selectedDay.summary.tasksTotal}
              </p>
            </div>
            <div className="rounded-xl border border-vanta-border px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-vanta-text-dim">Привычки</p>
              <p className="mt-0.5 text-sm text-vanta-text">
                {selectedDay.summary.habitsDone}/{selectedDay.summary.habitsTotal}
              </p>
            </div>
            <div className="rounded-xl border border-vanta-border px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-vanta-text-dim">Фокус</p>
              <p className="mt-0.5 text-sm text-vanta-text">
                {formatDuration(selectedDay.summary.focusMinutes)}
              </p>
            </div>
            <div className="rounded-xl border border-vanta-border px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-vanta-text-dim">Вода</p>
              <p className="mt-0.5 text-sm text-vanta-text">
                {formatLiters(selectedDay.summary.waterMl)} л
              </p>
            </div>
            <div className="rounded-xl border border-vanta-border px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-vanta-text-dim">Расходы</p>
              <p className="mt-0.5 text-sm text-vanta-text">
                {formatMoney(selectedDay.summary.expensesTotal)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-vanta-text-dim">Нажми на день, чтобы увидеть детали</p>
      )}
    </Card>
  );
}