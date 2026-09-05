export const STORAGE_KEYS = {
  username: "vanta:username",
  // v2 — модель Этапа 3 (дата/время у задач, иконка/частота/лог у привычек).
  tasks: "vanta:tasks:v2",
  habits: "vanta:habits:v2",
  // v2 — модель Этапа 4: лог по дням вместо одного числа. Это даёт
  // автоматический сброс на новый день и сохраняет историю на будущее
  // (Statistics), плюс чинит UTC-баг определения "сегодня" у фокуса.
  water: "vanta:water:v2",
  focus: "vanta:focus:v2",
  expenses: "vanta:expenses",
  flashcards: "vanta:flashcards",
} as const;