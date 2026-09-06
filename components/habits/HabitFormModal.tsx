"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Modal } from "@/components/ui/Modal";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { DEFAULT_HABIT_ICON_ID, HABIT_ICON_IDS, HABIT_ICON_MAP } from "@/lib/habitIconMap";
import type { Habit, HabitFrequency, HabitInput } from "@/types/habits";

const TITLE_PLACEHOLDERS = [
  "Например: Читать",
  "Чтение на английском",
  "Силовая тренировка",
  "Утренняя растяжка",
  "Медитация 10 минут",
  "Ложиться до полуночи",
];

function getRandomPlaceholder(): string {
  const index = Math.floor(Math.random() * TITLE_PLACEHOLDERS.length);
  return TITLE_PLACEHOLDERS[index];
}

interface HabitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: HabitInput) => void;
  onDelete?: () => void;
  habit?: Habit | null;
}

export function HabitFormModal({ isOpen, onClose, onSave, onDelete, habit }: HabitFormModalProps) {
  const [title, setTitle] = useState(habit?.title ?? "");
  const [icon, setIcon] = useState(habit?.icon ?? DEFAULT_HABIT_ICON_ID);
  const [frequencyType, setFrequencyType] = useState<HabitFrequency["type"]>(
    habit?.frequency.type ?? "daily",
  );
  const [timesPerWeek, setTimesPerWeek] = useState(
    habit?.frequency.type === "weekly" ? habit.frequency.timesPerWeek : 3,
  );
  const [placeholder] = useState(getRandomPlaceholder);

  const { isConfirming: confirmingDelete, handleClick: handleDeleteClick } = useConfirmDelete(
    () => {
      onDelete?.();
      onClose();
    },
  );
  const isValid = title.trim().length > 0;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (trimmed.length === 0) return;

    const frequency: HabitFrequency =
      frequencyType === "daily" ? { type: "daily" } : { type: "weekly", timesPerWeek };

    onSave({ title: trimmed, icon, frequency });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={habit ? "Изменить привычку" : "Новая привычка"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="habit-title" className="text-xs text-vanta-text-muted">
            Название
          </label>
          <input
            id="habit-title"
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={placeholder}
            className="rounded-xl border border-vanta-border bg-transparent px-3 py-2.5 text-sm text-vanta-text placeholder:text-vanta-text-dim outline-none focus:border-vanta-accent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-vanta-text-muted">Иконка</span>
          <div className="grid grid-cols-6 gap-3">
            {HABIT_ICON_IDS.map((iconId) => {
              const IconComponent = HABIT_ICON_MAP[iconId];
              const isSelected = icon === iconId;

              return (
                <button
                  key={iconId}
                  type="button"
                  onClick={() => setIcon(iconId)}
                  aria-pressed={isSelected}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                    isSelected
                      ? "border-vanta-accent bg-vanta-accent/10 text-vanta-accent"
                      : "border-transparent bg-white/5 text-white/50 hover:text-white"
                  }`}
                >
                  <IconComponent className="h-5 w-5" strokeWidth={1.75} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-vanta-text-muted">Частота</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFrequencyType("daily")}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                frequencyType === "daily"
                  ? "border-vanta-accent bg-vanta-accent/15 text-vanta-text"
                  : "border-vanta-border text-vanta-text-muted"
              }`}
            >
              Каждый день
            </button>
            <button
              type="button"
              onClick={() => setFrequencyType("weekly")}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                frequencyType === "weekly"
                  ? "border-vanta-accent bg-vanta-accent/15 text-vanta-text"
                  : "border-vanta-border text-vanta-text-muted"
              }`}
            >
              N раз в неделю
            </button>
          </div>

          {frequencyType === "weekly" ? (
            <div className="mt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTimesPerWeek((value) => Math.max(1, value - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-vanta-border text-vanta-text-muted transition-colors hover:text-vanta-text"
              >
                −
              </button>
              <span className="w-6 text-center text-sm text-vanta-text">{timesPerWeek}</span>
              <button
                type="button"
                onClick={() => setTimesPerWeek((value) => Math.min(7, value + 1))}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-vanta-border text-vanta-text-muted transition-colors hover:text-vanta-text"
              >
                +
              </button>
              <span className="text-sm text-vanta-text-muted">раз в неделю</span>
            </div>
          ) : null}
        </div>

        <div className="mt-2 flex items-center gap-2">
          {habit && onDelete ? (
            <button
              type="button"
              onClick={handleDeleteClick}
              className={`rounded-xl px-3 py-2.5 text-sm transition-colors ${
                confirmingDelete
                  ? "bg-red-500/15 text-red-400"
                  : "text-vanta-text-muted hover:text-red-400"
              }`}
            >
              {confirmingDelete ? "Точно удалить?" : "Удалить"}
            </button>
          ) : null}

          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-vanta-border px-4 py-2.5 text-sm text-vanta-text-muted transition-colors hover:text-vanta-text"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="rounded-xl bg-vanta-accent px-4 py-2.5 text-sm font-medium text-vanta-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:opacity-40"
            >
              Сохранить
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}