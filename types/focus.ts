export type FocusDurationMinutes = 25 | 50 | 90;

export type FocusTag = "coding" | "english" | "study" | "untracked";

export interface FocusSession {
  id: string;
  duration: number;
  date: string;
  tag: FocusTag;
}

export interface FocusLog {
  entries: FocusSession[];
}

export const FOCUS_TAG_LABELS: Record<FocusTag, string> = {
  coding: "TypeScript / C++ / Python",
  english: "Английский",
  study: "Учёба",
  untracked: "Без категории",
};