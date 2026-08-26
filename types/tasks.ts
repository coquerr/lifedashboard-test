export interface Task {
  id: string;
  title: string;
  date: string;
  time: string | null;
  done: boolean;
  createdAt: string;
}

export interface TaskInput {
  title: string;
  date: string;
  time: string | null;
}