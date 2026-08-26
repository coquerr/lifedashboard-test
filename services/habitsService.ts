import { startOfWeek, toISODate } from "@/lib/date";
import type { Habit, HabitInput } from "@/types/habits";

export function createHabit(input: HabitInput): Habit {
  return {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    icon: input.icon,
    frequency: input.frequency,
    completedDates: [],
    createdAt: new Date().toISOString(),
  };
}

export function addHabit(habits: Habit[], input: HabitInput): Habit[] {
  return [...habits, createHabit(input)];
}

export function updateHabit(habits: Habit[], id: string, input: HabitInput): Habit[] {
  return habits.map((habit) =>
    habit.id === id
      ? { ...habit, title: input.title.trim(), icon: input.icon, frequency: input.frequency }
      : habit,
  );
}

export function deleteHabit(habits: Habit[], id: string): Habit[] {
  return habits.filter((habit) => habit.id !== id);
}

export function isHabitDoneOnDate(habit: Habit, date: string): boolean {
  return habit.completedDates.includes(date);
}

export function toggleHabitCompletion(habits: Habit[], id: string, date: string): Habit[] {
  return habits.map((habit) => {
    if (habit.id !== id) return habit;

    const alreadyDone = habit.completedDates.includes(date);
    const completedDates = alreadyDone
      ? habit.completedDates.filter((d) => d !== date)
      : [...habit.completedDates, date];

    return { ...habit, completedDates };
  });
}

export function getWeeklyProgress(
  habit: Habit,
  referenceDate: Date,
): { completed: number; target: number } {
  const target = habit.frequency.type === "daily" ? 7 : habit.frequency.timesPerWeek;

  const weekStart = startOfWeek(referenceDate);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return toISODate(d);
  });

  const completed = habit.completedDates.filter((d) => weekDates.includes(d)).length;

  return { completed, target };
}