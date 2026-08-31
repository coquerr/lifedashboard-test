"use client";

import { useMemo, useRef, useState } from "react";
import { Plus, Receipt } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { ExpenseFormModal } from "@/components/expenses/ExpenseFormModal";
import { ExpenseRow } from "@/components/expenses/ExpenseRow";
import { useExpenses } from "@/hooks/useExpenses";
import { startOfMonth, startOfWeek, todayISO, toISODate } from "@/lib/date";
import { formatMoney } from "@/lib/format";
import * as expensesService from "@/services/expensesService";

type RangeKey = "today" | "week" | "month";

const RANGE_ORDER: RangeKey[] = ["today", "week", "month"];

const RANGE_LABELS: Record<RangeKey, string> = {
  today: "Сегодня",
  week: "Неделя",
  month: "Месяц",
};

const SWIPE_THRESHOLD = 50;

export default function ExpensesPage() {
  const { expenses, addExpense, removeExpense } = useExpenses();
  const [range, setRange] = useState<RangeKey>("today");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const touchStart = useRef<{ x: number; y: number } | null>(null);

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

  function handleTouchStart(event: React.TouchEvent) {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (!touchStart.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;

    touchStart.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) return;

    const currentIndex = RANGE_ORDER.indexOf(range);
    const nextIndex = deltaX < 0 ? currentIndex + 1 : currentIndex - 1;
    const clamped = Math.min(RANGE_ORDER.length - 1, Math.max(0, nextIndex));
    setRange(RANGE_ORDER[clamped]);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
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

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex flex-col gap-6"
      >
        <Card className="flex flex-col gap-1 p-5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
            Итого · {RANGE_LABELS[range]}
          </p>
          <p className="text-3xl font-semibold text-vanta-text">{formatMoney(total)}</p>
        </Card>

        <Card className="flex flex-col gap-1 p-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-3 py-8 text-center">
              <Receipt className="h-8 w-8 text-vanta-text-dim" strokeWidth={1.5} />
              <p className="text-sm text-vanta-text-muted">Расходов за этот период нет</p>
            </div>
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
      </div>

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