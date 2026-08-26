"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { EXPENSE_CATEGORIES } from "@/lib/expense-categories";
import { formatMoney } from "@/lib/format";
import type { Expense } from "@/types/expenses";

interface ExpenseRowProps {
  expense: Expense;
  onDelete: () => void;
}

export function ExpenseRow({ expense, onDelete }: ExpenseRowProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const category = EXPENSE_CATEGORIES.find((option) => option.value === expense.category);

  function handleDeleteClick() {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    onDelete();
  }

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
        onClick={handleDeleteClick}
        aria-label={confirmingDelete ? "Подтвердить удаление" : "Удалить расход"}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
          confirmingDelete
            ? "bg-red-500/15 text-red-400"
            : "text-vanta-text-dim hover:text-red-400"
        }`}
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}