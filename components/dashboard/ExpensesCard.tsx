"use client";

import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { useExpenses } from "@/hooks/useExpenses";
import { todayISO } from "@/lib/date";
import { EXPENSE_CATEGORIES } from "@/lib/expense-categories";
import { formatMoney } from "@/lib/format";
import * as expensesService from "@/services/expensesService";

export function ExpensesCard() {
  const { expenses } = useExpenses();
  const today = todayISO();
  const todayExpenses = expensesService.getExpensesInRange(expenses, today, today);
  const total = expensesService.sumExpenses(todayExpenses);

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
          Расходы сегодня
        </p>
        <Link href="/expenses" className="text-xs text-vanta-text-muted hover:text-vanta-accent">
          Все →
        </Link>
      </div>

      <p className="text-3xl font-semibold text-vanta-text">{formatMoney(total)}</p>

      <ul className="flex flex-col gap-2">
        {todayExpenses.length === 0 ? (
          <li className="text-sm text-vanta-text-muted">Сегодня расходов пока нет</li>
        ) : (
          todayExpenses.slice(0, 4).map((expense) => {
            const category = EXPENSE_CATEGORIES.find(
              (option) => option.value === expense.category,
            );
            return (
              <li key={expense.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-vanta-text-muted">
                  <span>{category?.icon ?? "📦"}</span>
                  {expense.title}
                </span>
                <span className="text-vanta-text">{formatMoney(expense.amount)}</span>
              </li>
            );
          })
        )}
      </ul>
    </Card>
  );
}