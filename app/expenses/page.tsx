"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { ExpenseFormModal } from "@/components/expenses/ExpenseFormModal";
import { ExpenseRow } from "@/components/expenses/ExpenseRow";
import { useExpenses } from "@/hooks/useExpenses";
import { startOfMonth, startOfWeek, todayISO, toISODate } from "@/lib/date";
import { formatMoney } from "@/lib/format";
import * as expensesService from "@/services/expensesService";

type RangeKey = "today" | "week" | "month";

const RANGE_LABELS: Record<RangeKey, string> = {
  today: "Сегодня",
  week: "Неделя",
  month: "Месяц",
};

export default function ExpensesPage() {
  const { expenses, addExpense, removeExpense } = useExpenses();
  const [range, setRange] = useState<RangeKey>("today");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const today = todayISO();

  const fromDate = useMemo(() => {
    if (range === "today") return today;
    if (range === "week") return toISODate(startOfWeek(new Date()));
    return toISODate(startOfMonth(new Date()));
  }, [range, today]);

  const filtered = expensesService.getExpensesInRange(expenses, fromDate, today);
  const total = expensesService.sumExpenses(filtered);

  function openCreateModal() {
    setModalKey((key) => key + 1);
    setModalOpen(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
          Финансы
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-vanta-text">Расходы</h1>
      </div>

      <div className="flex gap-2">
        {(Object.keys(RANGE_LABELS) as RangeKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setRange(key)}
            className={`flex-1 rounded-xl border px-3 py-2 text-sm transition-colors ${
              range === key
                ? "border-vanta-accent bg-vanta-accent/15 text-vanta-text"
                : "border-vanta-border text-vanta-text-muted"
            }`}
          >
            {RANGE_LABELS[key]}
          </button>
        ))}
      </div>

      <Card className="flex flex-col gap-1 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
          Итого · {RANGE_LABELS[range]}
        </p>
        <p className="text-3xl font-semibold text-vanta-text">{formatMoney(total)}</p>
      </Card>

      <Card className="flex flex-col gap-1 p-2">
        {filtered.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-vanta-text-muted">
            Расходов за этот период нет
          </p>
        ) : (
          filtered.map((expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              onDelete={() => removeExpense(expense.id)}
            />
          ))
        )}
      </Card>

      <button
        type="button"
        onClick={openCreateModal}
        aria-label="Добавить расход"
        className="fixed bottom-24 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-vanta-accent text-vanta-bg shadow-[0_12px_32px_-8px_rgba(201,162,75,0.5)] transition-opacity hover:opacity-90 md:bottom-8 md:right-8"
      >
        <Plus className="h-6 w-6" strokeWidth={2} />
      </button>

      <ExpenseFormModal
        key={modalKey}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addExpense}
      />
    </div>
  );
}