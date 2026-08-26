import type { Task, TaskInput } from "@/types/tasks";

export function createTask(input: TaskInput): Task {
  return {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    date: input.date,
    time: input.time,
    done: false,
    createdAt: new Date().toISOString(),
  };
}

export function addTask(tasks: Task[], input: TaskInput): Task[] {
  return [...tasks, createTask(input)];
}

export function updateTask(tasks: Task[], id: string, input: TaskInput): Task[] {
  return tasks.map((task) =>
    task.id === id
      ? { ...task, title: input.title.trim(), date: input.date, time: input.time }
      : task,
  );
}

export function deleteTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id);
}

export function toggleTaskDone(tasks: Task[], id: string): Task[] {
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
}

export function getTasksForDate(tasks: Task[], date: string): Task[] {
  return tasks
    .filter((task) => task.date === date)
    .sort((a, b) => {
      if (a.time === null && b.time === null) return 0;
      if (a.time === null) return 1;
      if (b.time === null) return -1;
      return a.time.localeCompare(b.time);
    });
}