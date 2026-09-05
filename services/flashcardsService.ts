import { addDaysISO, todayISO } from "@/lib/date";
import type { Flashcard, FlashcardInput, FlashcardLog, ReviewRating } from "@/types/flashcards";

const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createCard(log: FlashcardLog, input: FlashcardInput): FlashcardLog {
  const today = todayISO();

  const card: Flashcard = {
    id: createId(),
    front: input.front,
    back: input.back,
    interval: 0,
    ease: DEFAULT_EASE,
    repetitions: 0,
    nextReviewAt: today,
    createdAt: today,
  };

  return { entries: [...log.entries, card] };
}

export function deleteCard(log: FlashcardLog, id: string): FlashcardLog {
  return { entries: log.entries.filter((card) => card.id !== id) };
}

export function getDueCards(log: FlashcardLog, referenceDate: string = todayISO()): Flashcard[] {
  return log.entries.filter((card) => card.nextReviewAt <= referenceDate);
}

/**
 * Обновляет карточку по SM-2-подобной формуле (модифицированная под
 * Anki-стиль: "Hard" не сбрасывает прогресс полностью, только
 * замедляет рост интервала; "Again" — единственная оценка, которая
 * обнуляет repetitions и возвращает interval к 1 дню).
 */
export function reviewCard(card: Flashcard, rating: ReviewRating, referenceDate: string = todayISO()): Flashcard {
  let { interval, ease, repetitions } = card;

  if (rating === "again") {
    repetitions = 0;
    interval = 1;
    ease = Math.max(MIN_EASE, ease - 0.2);
  } else if (rating === "hard") {
    ease = Math.max(MIN_EASE, ease - 0.15);
    interval = repetitions === 0 ? 1 : Math.round(interval * 1.2);
    repetitions += 1;
  } else if (rating === "good") {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * ease);
    repetitions += 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * ease * 1.3);
    ease = ease + 0.15;
    repetitions += 1;
  }

  return {
    ...card,
    interval,
    ease,
    repetitions,
    nextReviewAt: addDaysISO(referenceDate, interval),
  };
}

export function updateCardInLog(log: FlashcardLog, updatedCard: Flashcard): FlashcardLog {
  return {
    entries: log.entries.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
  };
}