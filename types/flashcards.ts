export type ReviewRating = "again" | "hard" | "good" | "easy";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  interval: number;
  ease: number;
  repetitions: number;
  nextReviewAt: string;
  createdAt: string;
}

export interface FlashcardInput {
  front: string;
  back: string;
}

export interface FlashcardLog {
  entries: Flashcard[];
}