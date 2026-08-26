import type { WaterLog } from "@/types/water";

export function getAmountForDate(log: WaterLog, date: string): number {
  return log.entries[date] ?? 0;
}

export function addWater(log: WaterLog, date: string, deltaMl: number): WaterLog {
  const current = getAmountForDate(log, date);
  const next = Math.max(0, current + deltaMl);
  return { ...log, entries: { ...log.entries, [date]: next } };
}

export function setGoal(log: WaterLog, goalMl: number): WaterLog {
  return { ...log, goalMl };
}