/**
 * Дата в формате YYYY-MM-DD по ЛОКАЛЬНЫМ компонентам даты.
 *
 * Специально не используется date.toISOString() — он переводит время в
 * UTC и рядом с полуночью может сместить дату на день назад/вперёд в
 * зависимости от часового пояса пользователя.
 */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDaysISO(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function formatDateHuman(isoDate: string): string {
  const today = todayISO();
  const tomorrow = addDaysISO(today, 1);
  const yesterday = addDaysISO(today, -1);

  if (isoDate === today) return "Сегодня";
  if (isoDate === tomorrow) return "Завтра";
  if (isoDate === yesterday) return "Вчера";

  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
}

export function getLastNDaysISO(n: number, referenceDate: Date = new Date()): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const date = new Date(referenceDate);
    date.setDate(date.getDate() - i);
    dates.push(toISODate(date));
  }
  return dates;
}

export function startOfMonth(date: Date): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), 1);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}