import { useSyncExternalStore } from "react";

/**
 * Кэш снимка на уровне модуля. Хранит текущую дату (обнулённую до
 * полуночи по ЛОКАЛЬНЫМ компонентам, как toISODate/todayISO в lib/date.ts)
 * и isoDate-строку, по которой определяем, не наступил ли уже новый день.
 *
 * Это не глобальный React-стейт — обычная переменная модуля, которая
 * переживает между вызовами хука, но не между перезагрузками страницы.
 */
let cachedToday: Date | null = null;
let cachedISO: string | null = null;

function toLocalISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Возвращает закэшированный на уровне модуля объект Date (начало текущих
 * суток). Если день с прошлого вызова не сменился — возвращается
 * СТРОГО ТА ЖЕ ссылка на объект, а не новый Date с тем же значением:
 * useSyncExternalStore сравнивает снимки через Object.is, и новый
 * объект каждый вызов означал бы "снимок всегда изменился" -> риск
 * бесконечного ре-рендера (см. грабля #2 в snapshot проекта).
 *
 * Снимок пересчитывается только когда isoDate реально сменился
 * (переход через полночь между вызовами) — обновление не "тикает"
 * само по себе, а происходит естественно при следующем рендере/вызове.
 */
function getSnapshot(): Date {
  const now = new Date();
  const nowISO = toLocalISODate(now);

  if (cachedToday === null || cachedISO !== nowISO) {
    cachedToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    cachedISO = nowISO;
  }

  return cachedToday;
}

// На сервере фиксированной "сегодняшней" даты нет и быть не должно —
// реальное значение появляется только после монтирования на клиенте,
// иначе сервер и клиент разойдутся (та же логика, что и в useNow).
function getServerSnapshot(): null {
  return null;
}

function subscribe(): () => void {
  // Дню не нужно "тикать" — снимок пересчитывается лениво при каждом
  // обращении к getSnapshot (см. комментарий выше), поэтому подписка
  // ни на что не подписывается и не порождает лишних ре-рендеров.
  return () => {};
}

/**
 * Безопасная для гидратации "сегодняшняя" дата (Date, обнулённая до
 * полуночи). Возвращает null до первого клиентского рендера — используйте
 * вместо прямого new Date()/todayISO() в теле компонентов и хуков,
 * рендерящихся на статически пререндеренных страницах (см. грабля #7
 * в snapshot проекта).
 */
export function useClientToday(): Date | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}