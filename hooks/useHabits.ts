import { useCallback } from "react";

import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import * as habitsService from "@/services/habitsService";
import type { Habit, HabitInput } from "@/types/habits";

const DEFAULT_HABITS: Habit[] = [
  {
    id: "seed-water",
    title: "Вода",
    icon: "💧",
    frequency: { type: "daily" },
    completedDates: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-reading",
    title: "Чтение",
    icon: "📖",
    frequency: { type: "weekly", timesPerWeek: 3 },
    completedDates: [],
    createdAt: new Date().toISOString(),
  },
];

export function useHabits() {
  const [habits, setHabits] = useLocalStorageState<Habit[]>(STORAGE_KEYS.habits, DEFAULT_HABITS);

  const addHabit = useCallback(
    (input: HabitInput) => setHabits((current) => habitsService.addHabit(current, input)),
    [setHabits],
  );

  const editHabit = useCallback(
    (id: string, input: HabitInput) =>
      setHabits((current) => habitsService.updateHabit(current, id, input)),
    [setHabits],
  );

  const removeHabit = useCallback(
    (id: string) => setHabits((current) => habitsService.deleteHabit(current, id)),
    [setHabits],
  );

  const toggleHabit = useCallback(
    (id: string, date: string) =>
      setHabits((current) => habitsService.toggleHabitCompletion(current, id, date)),
    [setHabits],
  );

  return { habits, addHabit, editHabit, removeHabit, toggleHabit };
}