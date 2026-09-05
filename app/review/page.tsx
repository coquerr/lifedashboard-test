"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { useFocusMode } from "@/components/layout/FocusModeContext";
import { useFlashcards } from "@/hooks/useFlashcards";
import type { Flashcard, ReviewRating } from "@/types/flashcards";

const RATING_BUTTONS: { rating: ReviewRating; label: string }[] = [
  { rating: "again", label: "Снова" },
  { rating: "hard", label: "Сложно" },
  { rating: "good", label: "Нормально" },
  { rating: "easy", label: "Легко" },
];

export default function ReviewPage() {
  const router = useRouter();
  const { dueCards, reviewCard } = useFlashcards();
  const { setFocusMode } = useFocusMode();

  const sessionCardsRef = useRef<Flashcard[] | null>(null);
  if (sessionCardsRef.current === null) {
    sessionCardsRef.current = dueCards;
  }
  const sessionCards = sessionCardsRef.current;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setFocusMode(true);
    return () => setFocusMode(false);
  }, [setFocusMode]);

  function handleClose() {
    router.push("/");
  }

  function handleFlip() {
    if (!isFlipped) setIsFlipped(true);
  }

  function handleRate(rating: ReviewRating) {
    const card = sessionCards[currentIndex];
    if (!card) return;

    reviewCard(card, rating);
    setIsFlipped(false);
    setCurrentIndex((index) => index + 1);
  }

  const currentCard = sessionCards[currentIndex];
  const isSessionComplete = currentIndex >= sessionCards.length || sessionCards.length === 0;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-vanta-bg">
      <div className="flex items-center justify-between px-4 pt-safe pt-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
          {isSessionComplete
            ? "Готово"
            : `${currentIndex + 1} из ${sessionCards.length}`}
        </p>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Завершить"
          className="flex h-11 w-11 items-center justify-center rounded-full text-vanta-text-dim transition-colors hover:text-vanta-text"
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-safe">
        {isSessionComplete ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-2xl font-semibold text-vanta-text">Все карточки повторены</p>
            <p className="text-sm text-vanta-text-muted">Возвращайся завтра за новыми</p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 rounded-xl bg-vanta-accent px-5 py-2.5 text-sm font-medium text-vanta-bg transition-opacity hover:opacity-90"
            >
              На главную
            </button>
          </div>
        ) : (
          <>
            <div className="w-full max-w-sm" style={{ perspective: "1200px" }}>
              <button
                type="button"
                onClick={handleFlip}
                className="relative flex h-72 w-full items-center justify-center rounded-3xl border border-vanta-border bg-vanta-surface p-6 text-center transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center p-6"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <p className="text-xl font-medium text-vanta-text">{currentCard?.front}</p>
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center p-6"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <p className="text-xl font-medium text-vanta-accent">{currentCard?.back}</p>
                </div>
              </button>
            </div>

            {!isFlipped ? (
              <p className="text-xs text-vanta-text-dim">Нажми на карточку, чтобы увидеть ответ</p>
            ) : (
              <div className="grid w-full max-w-sm grid-cols-4 gap-2">
                {RATING_BUTTONS.map((button) => (
                  <button
                    key={button.rating}
                    type="button"
                    onClick={() => handleRate(button.rating)}
                    className="rounded-xl border border-vanta-border px-2 py-3 text-xs font-medium text-vanta-text-muted transition-colors hover:border-vanta-accent hover:text-vanta-text"
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}