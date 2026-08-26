import { todayISO } from "@/lib/date";
import type { FocusLog } from "@/types/focus";

export function getMinutesForDate(log: FocusLog, date: string): number {
  return log.entries[date] ?? 0;
}

export function addMinutes(log: FocusLog, date: string, minutes: number): FocusLog {
  const current = getMinutesForDate(log, date);
  return { entries: { ...log.entries, [date]: current + minutes } };
}

export function getTodayMinutes(log: FocusLog): number {
  return getMinutesForDate(log, todayISO());
}