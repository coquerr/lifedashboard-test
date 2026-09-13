import { readValue, writeValue } from "@/lib/local-store";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import type { Expense } from "@/types/expenses";
import type { FocusLog } from "@/types/focus";
import type { Habit } from "@/types/habits";
import type { Task } from "@/types/tasks";
import type { WaterLog } from "@/types/water";

/**
 * Версия формата экспортного файла. Если структура снапшота когда-либо
 * изменится несовместимо, при импорте можно будет проверить это поле
 * и явно отказать в загрузке старого/чужого файла вместо тихого
 * искажения данных.
 */
const EXPORT_FORMAT_VERSION = 1;

const DEFAULT_TASKS: Task[] = [];
const DEFAULT_HABITS: Habit[] = [];
const DEFAULT_WATER_LOG: WaterLog = { goalMl: 2000, entries: {} };
const DEFAULT_EXPENSES: Expense[] = [];
const DEFAULT_FOCUS_LOG: FocusLog = { entries: [] };

export interface VantaExportSnapshot {
  formatVersion: number;
  exportedAt: string;
  data: {
    tasks: Task[];
    habits: Habit[];
    water: WaterLog;
    expenses: Expense[];
    focus: FocusLog;
  };
}

/**
 * Собирает снапшот строго по пяти пользовательским сущностям —
 * намеренно НЕ выгружает весь localStorage (там может быть системный
 * кэш вроде username или технический долг вроде flashcards).
 */
export function buildExportSnapshot(): VantaExportSnapshot {
  return {
    formatVersion: EXPORT_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      tasks: readValue(STORAGE_KEYS.tasks, DEFAULT_TASKS),
      habits: readValue(STORAGE_KEYS.habits, DEFAULT_HABITS),
      water: readValue(STORAGE_KEYS.water, DEFAULT_WATER_LOG),
      expenses: readValue(STORAGE_KEYS.expenses, DEFAULT_EXPENSES),
      focus: readValue(STORAGE_KEYS.focus, DEFAULT_FOCUS_LOG),
    },
  };
}

function buildExportFileName(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  const dateLabel = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return `vanta-backup-${dateLabel}.json`;
}

/**
 * Собирает снапшот и запускает скачивание файла в браузере — всё
 * происходит на клиенте, файл никуда не отправляется.
 */
export function downloadExportSnapshot(): void {
  const snapshot = buildExportSnapshot();
  const json = JSON.stringify(snapshot, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = buildExportFileName();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export type ImportResult =
  | { ok: true }
  | { ok: false; reason: "invalid-json" | "invalid-format" | "unsupported-version" };

/**
 * Базовая проверка структуры снапшота — не полноценная схема-валидация
 * (например, не проверяет каждое поле Task), а страховка от явно
 * постороннего/битого файла: наличие ожидаемых массивов/объектов по
 * ключу data.
 */
function isValidSnapshotShape(value: unknown): value is VantaExportSnapshot {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<VantaExportSnapshot>;

  if (typeof candidate.formatVersion !== "number") return false;
  if (typeof candidate.data !== "object" || candidate.data === null) return false;

  const data = candidate.data as Partial<VantaExportSnapshot["data"]>;

  return (
    Array.isArray(data.tasks) &&
    Array.isArray(data.habits) &&
    Array.isArray(data.expenses) &&
    typeof data.water === "object" &&
    data.water !== null &&
    typeof data.focus === "object" &&
    data.focus !== null
  );
}

/**
 * Полная замена: перезаписывает все пять ключей значениями из файла.
 * Слияние сознательно не реализовано — риск конфликтов id и дублей
 * выше пользы на этом этапе.
 */
function applySnapshot(snapshot: VantaExportSnapshot): void {
  writeValue(STORAGE_KEYS.tasks, snapshot.data.tasks);
  writeValue(STORAGE_KEYS.habits, snapshot.data.habits);
  writeValue(STORAGE_KEYS.water, snapshot.data.water);
  writeValue(STORAGE_KEYS.expenses, snapshot.data.expenses);
  writeValue(STORAGE_KEYS.focus, snapshot.data.focus);
}

/**
 * Читает File (из <input type="file">), валидирует и, если всё в
 * порядке, полностью перезаписывает пять ключей localStorage. Вызывающая
 * сторона отвечает за предварительное подтверждение у пользователя —
 * эта функция ничего не спрашивает сама.
 */
export function importSnapshotFromFile(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      const rawText = typeof reader.result === "string" ? reader.result : "";

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        resolve({ ok: false, reason: "invalid-json" });
        return;
      }

      if (!isValidSnapshotShape(parsed)) {
        resolve({ ok: false, reason: "invalid-format" });
        return;
      }

      if (parsed.formatVersion > EXPORT_FORMAT_VERSION) {
        resolve({ ok: false, reason: "unsupported-version" });
        return;
      }

      applySnapshot(parsed);
      resolve({ ok: true });
    };

    reader.onerror = () => {
      resolve({ ok: false, reason: "invalid-json" });
    };

    reader.readAsText(file);
  });
}