"use client";

import Link from "next/link";

import { Checkbox } from "@/components/ui/Checkbox";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useHabits } from "@/hooks/useHabits";
import { todayISO } from "@/lib/date";
import { HABIT_ICON_MAP } from "@/lib/habitIconMap";
import { getWeeklyProgress, isHabitDoneOnDate } from "@/services/habitsService";

export function HabitsCard() {
  const { habits, toggleHabit } = useHabits();
  const today = todayISO();

  return (
    <div className="flex flex-col gap-4">
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
            const IconComponent = HABIT_ICON_MAP[habit.icon];

            return (
              <li key={habit.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={doneToday}
                    onChange={() => toggleHabit(habit.id, today)}
                    label={habit.title}
                  />
                  {IconComponent ? (
                    <IconComponent
                      className="h-4 w-4 text-vanta-text-dim"
                      strokeWidth={1.75}
                    />
                  ) : null}
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
    </div>
  );
}