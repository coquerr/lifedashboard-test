export function formatTime(date: Date): string {
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatLiters(ml: number): string {
  return (ml / 1000).toFixed(1);
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Форматирует продолжительность в минутах как "X ч Y мин" (или только
 * "Y мин", если часов нет). Единая точка форматирования — раньше была
 * продублирована как formatDuration в FocusCard.tsx/app/focus/page.tsx
 * и как formatFocusMinutes в app/stats/page.tsx (см. аудит M1).
 */
export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} мин`;
  return `${hours} ч ${minutes} мин`;
}

/**
 * Форматирует обратный отсчёт в секундах как "MM:SS". Использовалась
 * только в компонентах таймера фокуса (FocusCard.tsx, app/focus/page.tsx),
 * но дублировалась дословно между ними — вынесена сюда по тому же принципу.
 */
export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}