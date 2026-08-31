import { useCallback, useRef, useSyncExternalStore } from "react";

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
 * Снимок кэшируется в useRef и обновляется ТОЛЬКО внутри колбэка
 * setInterval — то есть ровно раз в intervalMs. getSnapshot при этом
 * просто читает закэшированное значение, не пересчитывая его заново.
 * Если бы getSnapshot вызывал Date.now() напрямую при каждом обращении,
 * React видел бы "новый" снимок при любом ре-рендере (не только по
 * таймеру) и уходил в бесконечный цикл — именно так был устроен баг,
 * который эта версия исправляет (см. grabli/pitfalls в snapshot проекта).
 *
 * Кэш — локальный для каждого вызова хука (через useRef), поэтому
 * компоненты с разным intervalMs тикают независимо друг от друга.
 *
 * Возвращает null до первой подписки на клиенте — это ожидаемо и
 * специально: время на сервере и на клиенте не может совпадать,
 * поэтому реальное значение показывается только после монтирования.
 */
export function useNow(intervalMs = 1000): Date | null {
  const timestampRef = useRef<number>(0);

  const subscribe = useCallback(
    (callback: () => void) => {
      timestampRef.current = Date.now();

      const id = setInterval(() => {
        timestampRef.current = Date.now();
        callback();
      }, intervalMs);

      return () => clearInterval(id);
    },
    [intervalMs],
  );

  const getSnapshot = useCallback(() => timestampRef.current, []);

  const timestamp = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return timestamp === 0 ? null : new Date(timestamp);
}