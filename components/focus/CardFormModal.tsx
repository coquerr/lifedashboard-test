"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Modal } from "@/components/ui/Modal";
import type { FlashcardInput } from "@/types/flashcards";

interface CardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: FlashcardInput) => void;
}

export function CardFormModal({ isOpen, onClose, onSave }: CardFormModalProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const isValid = front.trim().length > 0 && back.trim().length > 0;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedFront = front.trim();
    const trimmedBack = back.trim();

    if (trimmedFront.length === 0 || trimmedBack.length === 0) return;

    onSave({ front: trimmedFront, back: trimmedBack });
    setFront("");
    setBack("");
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Новая карточка">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="card-front" className="text-xs text-vanta-text-muted">
            Вопрос / термин
          </label>
          <textarea
            id="card-front"
            autoFocus
            rows={2}
            value={front}
            onChange={(event) => setFront(event.target.value)}
            placeholder="Например: ∫ x² dx"
            className="resize-none rounded-xl border border-vanta-border bg-transparent px-3 py-2.5 text-sm text-vanta-text placeholder:text-vanta-text-dim outline-none focus:border-vanta-accent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="card-back" className="text-xs text-vanta-text-muted">
            Ответ
          </label>
          <textarea
            id="card-back"
            rows={2}
            value={back}
            onChange={(event) => setBack(event.target.value)}
            placeholder="Например: x³/3 + C"
            className="resize-none rounded-xl border border-vanta-border bg-transparent px-3 py-2.5 text-sm text-vanta-text placeholder:text-vanta-text-dim outline-none focus:border-vanta-accent"
          />
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-vanta-border px-4 py-2.5 text-sm text-vanta-text-muted transition-colors hover:text-vanta-text"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="rounded-xl bg-vanta-accent px-4 py-2.5 text-sm font-medium text-vanta-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:opacity-40"
          >
            Сохранить
          </button>
        </div>
      </form>
    </Modal>
  );
}