"use client";

import { Trash2 } from "lucide-react";

import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { EXPENSE_CATEGORIES } from "@/lib/expense-categories";
import { formatMoney } from "@/lib/format";
import type { Expense } from "@/types/expenses";

interface ExpenseRowProps {
  expense: Expense;
  onDelete: () => void;
}

export function ExpenseRow({ expense, onDelete }: ExpenseRowProps) {
  const { isConfirming, handleClick } = useConfirmDelete(onDelete);
  const category = EXPENSE_CATEGORIES.find((option) => option.value === expense.category);

  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-vanta-surface-hover">
      <span className="text-lg">{category?.icon ?? "📦"}</span>
      <div className="flex-1">
        <p className="text-sm text-vanta-text">{expense.title}</p>
        <p className="text-xs text-vanta-text-dim">{category?.label ?? "Другое"}</p>
      </div>
      <span className="text-sm text-vanta-text">{formatMoney(expense.amount)}</span>
      <button
        type="button"
        onClick={handleClick}
        aria-label={isConfirming ? "Подтвердить удаление" : "Удалить расход"}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
          isConfirming
            ? "bg-red-500/15 text-red-400"
            : "text-vanta-text-dim hover:text-red-400"
        }`}
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}