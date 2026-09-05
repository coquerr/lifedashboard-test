"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Calendar, Clock, X } from "lucide-react";

import { Modal } from "@/components/ui/Modal";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { parseNaturalLanguage } from "@/lib/smartParser";
import { toISODate } from "@/lib/date";
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
  const [isDateTouched, setIsDateTouched] = useState(Boolean(task));
  const [isTimeTouched, setIsTimeTouched] = useState(Boolean(task));

  const debouncedTitle = useDebouncedValue(title, 350);
  const parsed = useMemo(() => parseNaturalLanguage(debouncedTitle), [debouncedTitle]);

  useEffect(() => {
    if (parsed.date && !isDateTouched) {
      setDate(toISODate(parsed.date));
    }
  }, [parsed.date, isDateTouched]);

  useEffect(() => {
    if (parsed.time && !isTimeTouched) {
      setTime(parsed.time);
    }
  }, [parsed.time, isTimeTouched]);

  const { isConfirming: confirmingDelete, handleClick: handleDeleteClick } = useConfirmDelete(
    () => {
      onDelete?.();
      onClose();
    },
  );
  const isValid = title.trim().length > 0;

  function dismissDateBadge() {
    setIsDateTouched(true);
  }

  function dismissTimeBadge() {
    setIsTimeTouched(true);
    setTime("");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const finalParsed = parseNaturalLanguage(title);
    const finalTitle = finalParsed.cleanText.length > 0 ? finalParsed.cleanText : title.trim();

    if (finalTitle.length === 0) return;

    onSave({ title: finalTitle, date, time: time.length > 0 ? time : null });
    onClose();
  }

  const showDateBadge = parsed.date && !isDateTouched;
  const showTimeBadge = parsed.time && !isTimeTouched;

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
            placeholder="Например: Позвонить в банк завтра в 15:00"
            className="rounded-xl border border-vanta-border bg-transparent px-3 py-2.5 text-sm text-vanta-text placeholder:text-vanta-text-dim outline-none focus:border-vanta-accent"
          />
          {showDateBadge || showTimeBadge ? (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {showDateBadge ? (
                <button
                  type="button"
                  onClick={dismissDateBadge}
                  className="flex items-center gap-1 rounded-full bg-vanta-accent/15 px-2.5 py-1 text-xs text-vanta-accent transition-opacity hover:opacity-80"
                >
                  <Calendar className="h-3 w-3" strokeWidth={2} />
                  {parsed.date?.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                  <X className="h-3 w-3" strokeWidth={2} />
                </button>
              ) : null}
              {showTimeBadge ? (
                <button
                  type="button"
                  onClick={dismissTimeBadge}
                  className="flex items-center gap-1 rounded-full bg-vanta-accent/15 px-2.5 py-1 text-xs text-vanta-accent transition-opacity hover:opacity-80"
                >
                  <Clock className="h-3 w-3" strokeWidth={2} />
                  {parsed.time}
                  <X className="h-3 w-3" strokeWidth={2} />
                </button>
              ) : null}
            </div>
          ) : null}
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
              onChange={(event) => {
                setDate(event.target.value);
                setIsDateTouched(true);
              }}
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
              onChange={(event) => {
                setTime(event.target.value);
                setIsTimeTouched(true);
              }}
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