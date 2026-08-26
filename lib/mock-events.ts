import type { UpcomingEvent } from "@/types/dashboard";

/**
 * Мок ближайшего события.
 *
 * Полноценный модуль событий (создание, редактирование, локальное
 * хранение или Supabase) — отдельный будущий этап, не текущий.
 */
export function getMockUpcomingEvent(): UpcomingEvent {
  const eventDate = new Date();
  eventDate.setHours(eventDate.getHours() + 2, 30, 0, 0);

  return {
    title: "Созвон по проекту",
    time: eventDate.toISOString(),
  };
}