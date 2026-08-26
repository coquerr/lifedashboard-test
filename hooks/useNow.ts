import { useCallback, useSyncExternalStore } from "react";

function getSnapshot(): number {
  return Date.now();
}

function getServerSnapshot(): number {
  // На сервере фиксированного времени нет и быть не должно — реальное
  // значение появится сразу после подписки на клиенте.
  return 0;
}

/**
 * Текущее время, обновляется с заданным интервалом через
 * useSyncExternalStore (канонический способ подписки на внешние,
 * не связанные с React источники данных, такие как таймер).
 *
 * Возвращает null до первой подписки на клиенте — это ожидаемо и
 * специально: время на сервере и на клиенте не может совпадать,
 * поэтому реальное значение показывается только после монтирования.
 */
export function useNow(intervalMs = 1000): Date | null {
  const subscribe = useCallback(
    (callback: () => void) => {
      const id = setInterval(callback, intervalMs);
      return () => clearInterval(id);
    },
    [intervalMs],
  );

  const timestamp = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return timestamp === 0 ? null : new Date(timestamp);
}