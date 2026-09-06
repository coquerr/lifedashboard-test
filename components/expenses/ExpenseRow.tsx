"use client";

import { Trash2 } from "lucide-react";

import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { DEFAULT_EXPENSE_CATEGORY_ICON, EXPENSE_CATEGORIES } from "@/lib/expense-categories";
import { formatMoney } from "@/lib/format";
import type { Expense } from "@/types/expenses";

interface ExpenseRowProps {
  expense: Expense;
  onDelete: () => void;
}

export function ExpenseRow({ expense, onDelete }: ExpenseRowProps) {
  const { isConfirming, handleClick } = useConfirmDelete(onDelete);
  const category = EXPENSE_CATEGORIES.find((option) => option.value === expense.category);
  const IconComponent = category?.icon ?? DEFAULT_EXPENSE_CATEGORY_ICON;

  return (
    <div className="flex items-center gap-3 border-b border-white/5 py-4 last:border-b-0">
      <IconComponent className="h-4 w-4 text-vanta-text-dim" strokeWidth={1.75} />
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