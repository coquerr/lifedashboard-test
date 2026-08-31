import { todayISO } from "@/lib/date";
import type { FocusLog, FocusSession, FocusTag } from "@/types/focus";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getMinutesForDate(log: FocusLog, date: string): number {
  return log.entries
    .filter((session) => session.date === date)
    .reduce((total, session) => total + session.duration, 0);
}

export function addSession(
  log: FocusLog,
  date: string,
  duration: number,
  tag: FocusTag = "untracked",
): FocusLog {
  const session: FocusSession = { id: createId(), duration, date, tag };
  return { entries: [...log.entries, session] };
}

export function getTodayMinutes(log: FocusLog): number {
  return getMinutesForDate(log, todayISO());
}

interface MigrationResult {
  log: FocusLog;
  wasMigrated: boolean;
}

/**
 * Мигрирует старый формат FocusLog (entries: Record<date, minutes>) в
 * новый (entries: FocusSession[]). Чистая функция — не пишет в
 * localStorage. Вызывающий код (хук) сам решает, когда зафиксировать
 * результат через setLog, ориентируясь на флаг wasMigrated.
 *
 * Принимает unknown, потому что до вызова этой функции нельзя быть
 * уверенным, в каком формате реально лежат данные в localStorage —
 * это ровно тот случай, старый или новый формат, для которого функция
 * существует.
 */
export function migrateFocusLog(raw: unknown): MigrationResult {
  if (
    raw !== null &&
    typeof raw === "object" &&
    "entries" in raw &&
    Array.isArray((raw as { entries: unknown }).entries)
  ) {
    return { log: raw as FocusLog, wasMigrated: false };
  }

  if (
    raw !== null &&
    typeof raw === "object" &&
    "entries" in raw &&
    typeof (raw as { entries: unknown }).entries === "object"
  ) {
    const oldEntries = (raw as { entries: Record<string, number> }).entries;

    const migratedSessions: FocusSession[] = Object.entries(oldEntries).map(
      ([date, minutes]) => ({
        id: createId(),
        date,
        duration: minutes,
        tag: "untracked",
      }),
    );

    return { log: { entries: migratedSessions }, wasMigrated: true };
  }

  return { log: { entries: [] }, wasMigrated: false };
}