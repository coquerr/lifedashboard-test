import { useCallback } from "react";

import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import * as tasksService from "@/services/tasksService";
import type { Task, TaskInput } from "@/types/tasks";

const DEFAULT_TASKS: Task[] = [];

export function useTasks() {
  const [tasks, setTasks] = useLocalStorageState<Task[]>(STORAGE_KEYS.tasks, DEFAULT_TASKS);

  const addTask = useCallback(
    (input: TaskInput) => setTasks((current) => tasksService.addTask(current, input)),
    [setTasks],
  );

  const editTask = useCallback(
    (id: string, input: TaskInput) =>
      setTasks((current) => tasksService.updateTask(current, id, input)),
    [setTasks],
  );

  const removeTask = useCallback(
    (id: string) => setTasks((current) => tasksService.deleteTask(current, id)),
    [setTasks],
  );

  const toggleTask = useCallback(
    (id: string) => setTasks((current) => tasksService.toggleTaskDone(current, id)),
    [setTasks],
  );

  const getTasksForDate = useCallback(
    (date: string) => tasksService.getTasksForDate(tasks, date),
    [tasks],
  );

  return { tasks, addTask, editTask, removeTask, toggleTask, getTasksForDate };
}