type Listener = () => void;
type CacheEntry = { raw: string | null; value: unknown };

const listenersByKey = new Map<string, Set<Listener>>();
const cacheByKey = new Map<string, CacheEntry>();

function getListeners(key: string): Set<Listener> {
  let set = listenersByKey.get(key);
  if (!set) {
    set = new Set();
    listenersByKey.set(key, set);
  }
  return set;
}

/**
 * Подписка на изменения значения по ключу — своя (внутри вкладки) и
 * через нативное событие "storage" (синхронизация между вкладками).
 */
export function subscribeToKey(key: string, callback: Listener): () => void {
  const listeners = getListeners(key);
  listeners.add(callback);

  function handleStorageEvent(event: StorageEvent) {
    if (event.key === key) callback();
  }

  window.addEventListener("storage", handleStorageEvent);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorageEvent);
  };
}

/**
 * Снимок значения по ключу. Кэш нужен, чтобы useSyncExternalStore
 * получал ту же ссылку на объект, если сырая строка в localStorage не
 * изменилась — без этого React будет считать снимок "новым" на каждом
 * рендере и уйдёт в бесконечный цикл повторных рендеров.
 */
export function readValue<T>(key: string, initialValue: T): T {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    raw = null;
  }

  const cached = cacheByKey.get(key);
  if (cached && cached.raw === raw) {
    return cached.value as T;
  }

  let parsed: T;
  if (raw === null) {
    parsed = initialValue;
  } else {
    try {
      parsed = JSON.parse(raw) as T;
    } catch {
      parsed = initialValue;
    }
  }

  cacheByKey.set(key, { raw, value: parsed });
  return parsed;
}

export function writeValue<T>(key: string, value: T): void {
  const raw = JSON.stringify(value);

  try {
    window.localStorage.setItem(key, raw);
  } catch {
    // Игнорируем ошибки записи (например, переполнение хранилища).
  }

  cacheByKey.set(key, { raw, value });
  getListeners(key).forEach((listener) => listener());
}