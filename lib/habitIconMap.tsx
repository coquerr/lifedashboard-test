import {
  BookOpen,
  Brain,
  Droplet,
  Dumbbell,
  Guitar,
  Leaf,
  Moon,
  PenLine,
  Salad,
  Target,
  Timer,
  type LucideIcon,
} from "lucide-react";

/**
 * Единственный источник правды для набора иконок привычек.
 * Ключ — стабильный id, хранящийся в Habit.icon. Значение — компонент lucide.
 * Порядок ключей определяет порядок отображения в сетке выбора.
 */
export const HABIT_ICON_MAP: Record<string, LucideIcon> = {
  droplet: Droplet,
  dumbbell: Dumbbell,
  target: Target,
  book: BookOpen,
  meditation: Brain,
  running: Timer,
  salad: Salad,
  sleep: Moon,
  focus: Target,
  writing: PenLine,
  guitar: Guitar,
  growth: Leaf,
};

export const HABIT_ICON_IDS = Object.keys(HABIT_ICON_MAP);

export const DEFAULT_HABIT_ICON_ID = HABIT_ICON_IDS[0];

/**
 * Старый формат хранил иконку привычки как эмодзи-символ напрямую в
 * localStorage. Эта таблица сопоставляет каждый ранее использовавшийся
 * эмодзи новому строковому id из HABIT_ICON_MAP.
 */
const LEGACY_EMOJI_TO_ID: Record<string, string> = {
  "💧": "droplet",
  "🏋️": "dumbbell",
  "🏋": "dumbbell",
  "📚": "book",
  "📖": "book",
  "🧘": "meditation",
  "🏃": "running",
  "🥗": "salad",
  "😴": "sleep",
  "🎯": "target",
  "✍️": "writing",
  "✍": "writing",
  "🎸": "guitar",
  "🌱": "growth",
};

/**
 * Чистая функция миграции: принимает текущее значение Habit.icon (может
 * быть старым эмодзи или уже новым id) и возвращает валидный id из
 * HABIT_ICON_MAP. Никаких побочных эффектов — вызывающий код сам решает,
 * нужно ли сохранять результат обратно в хранилище.
 */
export function migrateHabitIcon(icon: string): string {
  if (icon in HABIT_ICON_MAP) return icon;

  const mapped = LEGACY_EMOJI_TO_ID[icon];
  if (mapped) return mapped;

  return DEFAULT_HABIT_ICON_ID;
}