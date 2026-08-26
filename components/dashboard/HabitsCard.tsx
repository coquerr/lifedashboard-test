"use client";

import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useHabits } from "@/hooks/useHabits";
import { todayISO } from "@/lib/date";
import { getWeeklyProgress, isHabitDoneOnDate } from "@/services/habitsService";

export function HabitsCard() {
  const { habits, toggleHabit } = useHabits();
  const today = todayISO();

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
          Привычки
        </p>
        <Link href="/habits" className="text-xs text-vanta-text-muted hover:text-vanta-accent">
          Все →
        </Link>
      </div>

      {habits.length === 0 ? (
        <p className="text-sm text-vanta-text-muted">Пока нет ни одной привычки</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {habits.map((habit) => {
            const doneToday = isHabitDoneOnDate(habit, today);
            const { completed, target } = getWeeklyProgress(habit, new Date());

            return (
              <li key={habit.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={doneToday}
                    onChange={() => toggleHabit(habit.id, today)}
                    label={habit.title}
                  />
                  <span className="text-base">{habit.icon}</span>
                  <span
                    className={`flex-1 text-sm ${
                      doneToday ? "text-vanta-text" : "text-vanta-text-muted"
                    }`}
                  >
                    {habit.title}
                  </span>
                  <span className="text-xs text-vanta-text-dim">
                    {completed}/{target}
                  </span>
                </div>
                <ProgressBar value={(completed / target) * 100} />
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}