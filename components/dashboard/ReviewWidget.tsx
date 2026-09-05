"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { useFlashcards } from "@/hooks/useFlashcards";

export function ReviewWidget() {
  const { dueCards } = useFlashcards();

  if (dueCards.length === 0) return null;

  return (
    <Link href="/review">
      <Card className="flex items-center gap-4 p-5 transition-colors hover:border-vanta-accent">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-vanta-accent/15 text-vanta-accent">
          <BookOpen className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="flex-1">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
            Повторение
          </p>
          <p className="mt-0.5 text-sm font-medium text-vanta-text">
            Повторить {dueCards.length} {dueCards.length === 1 ? "карточку" : "карточек"}
          </p>
        </div>
      </Card>
    </Link>
  );
}