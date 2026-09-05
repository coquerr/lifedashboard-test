"use client";

import { useEffect, useState } from "react";

/**
 * Возвращает значение с задержкой delayMs — обновляется только после
 * того, как value перестаёт меняться на этот период. Используется для
 * умного парсинга ввода (smartParser), чтобы не пересчитывать при
 * каждом нажатии клавиши.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}