"use client";

import { useState } from "react";
import { Plus, Repeat } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { HabitFormModal } from "@/components/habits/HabitFormModal";
import { useHabits } from "@/hooks/useHabits";
import { todayISO } from "@/lib/date";
import { HABIT_ICON_MAP } from "@/lib/habitIconMap";
import { getWeeklyProgress, isHabitDoneOnDate } from "@/services/habitsService";
import type { Habit, HabitInput } from "@/types/habits";

export default function HabitsPage() {
  const { habits, addHabit, editHabit, removeHabit, toggleHabit } = useHabits();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const today = todayISO();

  function openCreateModal() {
    setEditingHabit(null);
    setModalKey((key) => key + 1);
    setModalOpen(true);
  }

  function openEditModal(habit: Habit) {
    setEditingHabit(habit);
    setModalKey((key) => key + 1);
    setModalOpen(true);
  }

  function handleSave(input: HabitInput) {
    if (editingHabit) {
      editHabit(editingHabit.id, input);
    } else {
      addHabit(input);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
          Регулярность
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-vanta-text">Привычки</h1>
      </div>

      {habits.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Repeat className="h-8 w-8 text-vanta-text-dim" strokeWidth={1.5} />
          <p className="text-sm text-vanta-text-muted">Пока нет ни одной привычки</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {habits.map((habit) => {
            const doneToday = isHabitDoneOnDate(habit, today);
            const { completed, target } = getWeeklyProgress(habit, new Date());
            const IconComponent = HABIT_ICON_MAP[habit.icon];

            return (
              <Card key={habit.id} className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={doneToday}
                    onChange={() => toggleHabit(habit.id, today)}
                    label={habit.title}
                  />
                  <button
                    type="button"
                    onClick={() => openEditModal(habit)}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    {IconComponent ? (
                      <IconComponent
                        className="h-5 w-5 text-vanta-text-dim"
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
                    <span className="text-xs text-vanta-text-muted">
                      {completed}/{target}
                    </span>
                  </button>
                </div>
                <ProgressBar value={(completed / target) * 100} />
              </Card>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={openCreateModal}
        aria-label="Добавить привычку"
        className="fixed bottom-24 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-vanta-accent text-vanta-bg shadow-[0_12px_32px_-8px_rgba(201,162,75,0.5)] transition-opacity hover:opacity-90 md:bottom-8 md:right-8"
      >
        <Plus className="h-6 w-6" strokeWidth={2} />
      </button>

      <HabitFormModal
        key={modalKey}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={editingHabit ? () => removeHabit(editingHabit.id) : undefined}
        habit={editingHabit}
      />
    </div>
  );
}