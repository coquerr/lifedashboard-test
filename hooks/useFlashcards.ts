"use client";

import { useCallback } from "react";

import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { todayISO } from "@/lib/date";
import * as flashcardsService from "@/services/flashcardsService";
import type { Flashcard, FlashcardInput, FlashcardLog, ReviewRating } from "@/types/flashcards";

const DEFAULT_LOG: FlashcardLog = { entries: [] };

export function useFlashcards() {
  const [log, setLog] = useLocalStorageState<FlashcardLog>(STORAGE_KEYS.flashcards, DEFAULT_LOG);

  const dueCards = flashcardsService.getDueCards(log, todayISO());

  const addCard = useCallback(
    (input: FlashcardInput) => setLog((current) => flashcardsService.createCard(current, input)),
    [setLog],
  );

  const removeCard = useCallback(
    (id: string) => setLog((current) => flashcardsService.deleteCard(current, id)),
    [setLog],
  );

  const reviewCard = useCallback(
    (card: Flashcard, rating: ReviewRating) => {
      const updated = flashcardsService.reviewCard(card, rating, todayISO());
      setLog((current) => flashcardsService.updateCardInLog(current, updated));
    },
    [setLog],
  );

  return {
    allCards: log.entries,
    dueCards,
    addCard,
    removeCard,
    reviewCard,
  };
}