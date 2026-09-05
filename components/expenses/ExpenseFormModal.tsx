"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Tag, Wallet, X } from "lucide-react";

import { Modal } from "@/components/ui/Modal";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { parseNaturalLanguage } from "@/lib/smartParser";
import { todayISO } from "@/lib/date";
import { EXPENSE_CATEGORIES } from "@/lib/expense-categories";
import type { ExpenseCategory, ExpenseInput } from "@/types/expenses";

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: ExpenseInput) => void;
}

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  EXPENSE_CATEGORIES.map((option) => [option.value, option.label]),
);

export function ExpenseFormModal({ isOpen, onClose, onSave }: ExpenseFormModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>(EXPENSE_CATEGORIES[0].value);
  const [isAmountTouched, setIsAmountTouched] = useState(false);
  const [isCategoryTouched, setIsCategoryTouched] = useState(false);

  const debouncedTitle = useDebouncedValue(title, 350);
  const parsed = useMemo(() => parseNaturalLanguage(debouncedTitle), [debouncedTitle]);

  useEffect(() => {
    if (parsed.amount !== null && !isAmountTouched) {
      setAmount(String(parsed.amount));
    }
  }, [parsed.amount, isAmountTouched]);

  useEffect(() => {
    if (parsed.categoryHint && !isCategoryTouched) {
      const match = EXPENSE_CATEGORIES.find((option) => option.value === parsed.categoryHint);
      if (match) setCategory(match.value);
    }
  }, [parsed.categoryHint, isCategoryTouched]);

  const parsedAmount = Number(amount.replace(",", "."));
  const isValid = title.trim().length > 0 && Number.isFinite(parsedAmount) && parsedAmount > 0;

  function dismissAmountBadge() {
    setIsAmountTouched(true);
  }

  function dismissCategoryBadge() {
    setIsCategoryTouched(true);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const finalParsed = parseNaturalLanguage(title);
    const finalTitle =
      finalParsed.cleanText.length > 0 ? finalParsed.cleanText : title.trim();

    if (finalTitle.length === 0 || !Number.isFinite(parsedAmount) || parsedAmount <= 0) return;

    onSave({ title: finalTitle, amount: parsedAmount, category, date: todayISO() });
    onClose();
  }

  const showAmountBadge = parsed.amount !== null && !isAmountTouched;
  const showCategoryBadge = parsed.categoryHint && !isCategoryTouched;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Новый расход">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="expense-title" className="text-xs text-vanta-text-muted">
            Название
          </label>
          <input
            id="expense-title"
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например: Протеин 1800"
            className="rounded-xl border border-vanta-border bg-transparent px-3 py-2.5 text-sm text-vanta-text placeholder:text-vanta-text-dim outline-none focus:border-vanta-accent"
          />
          {showAmountBadge || showCategoryBadge ? (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {showAmountBadge ? (
                <button
                  type="button"
                  onClick={dismissAmountBadge}
                  className="flex items-center gap-1 rounded-full bg-vanta-accent/15 px-2.5 py-1 text-xs text-vanta-accent transition-opacity hover:opacity-80"
                >
                  <Wallet className="h-3 w-3" strokeWidth={2} />
                  {parsed.amount} ₽
                  <X className="h-3 w-3" strokeWidth={2} />
                </button>
              ) : null}
              {showCategoryBadge ? (
                <button
                  type="button"
                  onClick={dismissCategoryBadge}
                  className="flex items-center gap-1 rounded-full bg-vanta-accent/15 px-2.5 py-1 text-xs text-vanta-accent transition-opacity hover:opacity-80"
                >
                  <Tag className="h-3 w-3" strokeWidth={2} />
                  {CATEGORY_LABELS[parsed.categoryHint ?? ""]}
                  <X className="h-3 w-3" strokeWidth={2} />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="expense-amount" className="text-xs text-vanta-text-muted">
            Сумма, ₽
          </label>
          <input
            id="expense-amount"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setIsAmountTouched(true);
            }}
            placeholder="0"
            className="rounded-xl border border-vanta-border bg-transparent px-3 py-2.5 text-sm text-vanta-text placeholder:text-vanta-text-dim outline-none focus:border-vanta-accent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-vanta-text-muted">Категория</span>
          <div className="grid grid-cols-2 gap-2">
            {EXPENSE_CATEGORIES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setCategory(option.value);
                  setIsCategoryTouched(true);
                }}
                aria-pressed={category === option.value}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                  category === option.value
                    ? "border-vanta-accent bg-vanta-accent/15 text-vanta-accent"
                    : "border-vanta-border text-vanta-text-muted"
                }`}
              >
                <span>{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
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