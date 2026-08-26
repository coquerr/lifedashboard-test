"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Modal } from "@/components/ui/Modal";
import type { Task, TaskInput } from "@/types/tasks";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: TaskInput) => void;
  onDelete?: () => void;
  task?: Task | null;
  defaultDate: string;
}

export function TaskFormModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  task,
  defaultDate,
}: TaskFormModalProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [date, setDate] = useState(task?.date ?? defaultDate);
  const [time, setTime] = useState(task?.time ?? "");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (trimmed.length === 0) return;

    onSave({ title: trimmed, date, time: time.length > 0 ? time : null });
    onClose();
  }

  function handleDeleteClick() {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    onDelete?.();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? "Изменить задачу" : "Новая задача"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-title" className="text-xs text-vanta-text-muted">
            Название
          </label>
          <input
            id="task-title"
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например: Позвонить в банк"
            className="rounded-xl border border-vanta-border bg-transparent px-3 py-2.5 text-sm text-vanta-text placeholder:text-vanta-text-dim outline-none focus:border-vanta-accent"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="task-date" className="text-xs text-vanta-text-muted">
              Дата
            </label>
            <input
              id="task-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="rounded-xl border border-vanta-border bg-transparent px-3 py-2.5 text-sm text-vanta-text outline-none focus:border-vanta-accent [color-scheme:dark]"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="task-time" className="text-xs text-vanta-text-muted">
              Время (необязательно)
            </label>
            <input
              id="task-time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="rounded-xl border border-vanta-border bg-transparent px-3 py-2.5 text-sm text-vanta-text outline-none focus:border-vanta-accent [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          {task && onDelete ? (
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
              className="rounded-xl bg-vanta-accent px-4 py-2.5 text-sm font-medium text-vanta-bg transition-opacity hover:opacity-90"
            >
              Сохранить
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}