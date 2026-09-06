import { useCallback, useEffect, useRef } from "react";

import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { migrateHabitIcon } from "@/lib/habitIconMap";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import * as habitsService from "@/services/habitsService";
import type { Habit, HabitInput } from "@/types/habits";

const DEFAULT_HABITS: Habit[] = [
  {
    id: "seed-water",
    title: "Вода",
    icon: "droplet",
    frequency: { type: "daily" },
    completedDates: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-reading",
    title: "Чтение",
    icon: "book",
    frequency: { type: "weekly", timesPerWeek: 3 },
    completedDates: [],
    createdAt: new Date().toISOString(),
  },
];

/**
 * Прогоняет список привычек через migrateHabitIcon. Возвращает исходный
 * массив без изменений, если миграция ничего не поменяла (чтобы не
 * создавать лишний setState, если все иконки уже актуальны).
 */
function migrateHabitsIcons(habits: Habit[]): { habits: Habit[]; wasMigrated: boolean } {
  let wasMigrated = false;

  const migrated = habits.map((habit) => {
    const migratedIcon = migrateHabitIcon(habit.icon);
    if (migratedIcon === habit.icon) return habit;

    wasMigrated = true;
    return { ...habit, icon: migratedIcon };
  });

  return { habits: wasMigrated ? migrated : habits, wasMigrated };
}

export function useHabits() {
  const [habits, setHabits] = useLocalStorageState<Habit[]>(STORAGE_KEYS.habits, DEFAULT_HABITS);
  const hasCheckedMigration = useRef(false);

  useEffect(() => {
    if (hasCheckedMigration.current) return;
    hasCheckedMigration.current = true;

    const { habits: migratedHabits, wasMigrated } = migrateHabitsIcons(habits);
    if (wasMigrated) {
      setHabits(migratedHabits);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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