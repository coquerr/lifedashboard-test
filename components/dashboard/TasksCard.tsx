"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useTasks } from "@/hooks/useTasks";
import { todayISO } from "@/lib/date";

export function TasksCard() {
  const { getTasksForDate, addTask, toggleTask } = useTasks();
  const [draft, setDraft] = useState("");
  const today = todayISO();
  const tasks = getTasksForDate(today);

  const doneCount = tasks.filter((task) => task.done).length;
  const progress = tasks.length === 0 ? 0 : (doneCount / tasks.length) * 100;

  function handleAdd() {
    const title = draft.trim();
    if (title.length === 0) return;

    addTask({ title, date: today, time: null });
    setDraft("");
  }

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
          Задачи на сегодня
        </p>
        <Link href="/tasks" className="text-xs text-vanta-text-muted hover:text-vanta-accent">
          {doneCount}/{tasks.length}
        </Link>
      </div>

      <ProgressBar value={progress} />

      <ul className="flex flex-col gap-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center gap-3">
            <Checkbox checked={task.done} onChange={() => toggleTask(task.id)} label={task.title} />
            <span
              className={`text-sm ${
                task.done ? "text-vanta-text-dim line-through" : "text-vanta-text"
              }`}
            >
              {task.title}
            </span>
            {task.time ? (
              <span className="ml-auto font-mono text-xs text-vanta-text-dim">{task.time}</span>
            ) : null}
          </li>
        ))}
        {tasks.length === 0 ? (
          <li className="text-sm text-vanta-text-muted">Задач на сегодня пока нет</li>
        ) : null}
      </ul>

      <div className="flex gap-2 border-t border-vanta-border pt-4">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleAdd();
          }}
          placeholder="Новая задача на сегодня"
          className="flex-1 rounded-xl border border-vanta-border bg-transparent px-3 py-2 text-sm text-vanta-text placeholder:text-vanta-text-dim outline-none focus:border-vanta-accent"
        />
        <button
          type="button"
          onClick={handleAdd}
          aria-label="Добавить задачу"
          className="flex items-center justify-center rounded-xl bg-vanta-accent px-3 py-2 text-vanta-bg transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </Card>
  );
}