export type HabitFrequency = { type: "daily" } | { type: "weekly"; timesPerWeek: number };

export interface Habit {
  id: string;
  title: string;
  icon: string;
  frequency: HabitFrequency;
  completedDates: string[];
  createdAt: string;
}

export interface HabitInput {
  title: string;
  icon: string;
  frequency: HabitFrequency;
}