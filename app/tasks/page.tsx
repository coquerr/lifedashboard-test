"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, CalendarX2 } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { DateStrip } from "@/components/tasks/DateStrip";
import { WeekStrip } from "@/components/tasks/WeekStrip";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { useTasks } from "@/hooks/useTasks";
import { addDaysISO, formatDateHuman, todayISO } from "@/lib/date";
import type { Task, TaskInput } from "@/types/tasks";

const SWIPE_THRESHOLD = 50;

export default function TasksPage() {
  const { getTasksForDate, addTask, editTask, removeTask, toggleTask } = useTasks();
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const tasksForDay = getTasksForDate(selectedDate);

  function openCreateModal() {
    setEditingTask(null);
    setModalKey((key) => key + 1);
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setModalKey((key) => key + 1);
    setModalOpen(true);
  }

  function handleSave(input: TaskInput) {
    if (editingTask) {
      editTask(editingTask.id, input);
    } else {
      addTask(input);
    }
  }

  function handleTouchStart(event: React.TouchEvent) {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (!touchStart.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;

    touchStart.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) return;

    setSelectedDate((date) => addDaysISO(date, deltaX < 0 ? 1 : -1));
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 lg:grid lg:max-w-6xl lg:grid-cols-[1fr_240px] lg:items-start lg:gap-6">
      <div className="flex flex-col gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
            Планирование
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-vanta-text">Задачи</h1>
        </div>

        <div className="hidden items-center justify-between lg:flex">
          <button
            type="button"
            onClick={() => setSelectedDate((date) => addDaysISO(date, -1))}
            aria-label="Предыдущий день"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-vanta-border text-vanta-text-muted transition-colors hover:text-vanta-text"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={() => setSelectedDate(todayISO())}
            className="text-sm font-medium capitalize text-vanta-text"
          >
            {formatDateHuman(selectedDate)}
          </button>

          <button
            type="button"
            onClick={() => setSelectedDate((date) => addDaysISO(date, 1))}
            aria-label="Следующий день"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-vanta-border text-vanta-text-muted transition-colors hover:text-vanta-text"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="lg:hidden">
          <p className="mb-2 text-center text-sm font-medium capitalize text-vanta-text">
            {formatDateHuman(selectedDate)}
          </p>
          <WeekStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>

        <Card
          className="flex flex-col gap-1 p-2"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {tasksForDay.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-3 py-10 text-center">
              <CalendarX2 className="h-8 w-8 text-vanta-text-dim" strokeWidth={1.5} />
              <p className="text-sm text-vanta-text-muted">На этот день задач нет</p>
            </div>
          ) : (
            tasksForDay.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-vanta-surface-hover"
              >
                <Checkbox
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  label={task.title}
                />
                <button
                  type="button"
                  onClick={() => openEditModal(task)}
                  className="flex flex-1 items-center justify-between gap-3 text-left"
                >
                  <span
                    className={`text-sm ${
                      task.done ? "text-vanta-text-dim line-through" : "text-vanta-text"
                    }`}
                  >
                    {task.title}
                  </span>
                  {task.time ? (
                    <span className="font-mono text-xs text-vanta-text-dim">{task.time}</span>
                  ) : null}
                </button>
              </div>
            ))
          )}
        </Card>
      </div>

      <div className="hidden lg:block lg:pt-[52px]">
        <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      <button
        type="button"
        onClick={openCreateModal}
        aria-label="Добавить задачу"
        className="fixed bottom-24 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-vanta-accent text-vanta-bg shadow-[0_12px_32px_-8px_rgba(201,162,75,0.5)] transition-opacity hover:opacity-90 md:bottom-8 md:right-8"
      >
        <Plus className="h-6 w-6" strokeWidth={2} />
      </button>

      <TaskFormModal
        key={modalKey}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={editingTask ? () => removeTask(editingTask.id) : undefined}
        task={editingTask}
        defaultDate={selectedDate}
      />
    </div>
  );
}