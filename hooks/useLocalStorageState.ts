import { useCallback, useSyncExternalStore } from "react";

import { readValue, subscribeToKey, writeValue } from "@/lib/local-store";

/**
 * Состояние, синхронизированное с localStorage через useSyncExternalStore —
 * это канонический React-подход для подписки на внешние системы (в
 * отличие от чтения localStorage внутри useEffect и последующего
 * setState, что вызывает лишний каскадный рендер).
 *
 * На сервере и при первой гидратации возвращается initialValue —
 * реальное значение подставляется сразу после подписки на клиенте,
 * так что рассинхронизации разметки не возникает.
 *
 * Эта же точка входа в будущем позволит подменить localStorage на
 * синхронизацию с Supabase, не меняя компоненты, которые используют хук.
 */
export function useLocalStorageState<T>(key: string, initialValue: T) {
  const subscribe = useCallback(
    (callback: () => void) => subscribeToKey(key, callback),
    [key],
  );

  const getSnapshot = useCallback(() => readValue(key, initialValue), [key, initialValue]);
  const getServerSnapshot = useCallback(() => initialValue, [initialValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readValue(key, initialValue);
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
      writeValue(key, resolved);
    },
    [key, initialValue],
  );

  return [value, setValue] as const;
}