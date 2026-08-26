"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useWater } from "@/hooks/useWater";
import { formatLiters } from "@/lib/format";

export default function WaterPage() {
  const { goalMl, todayAmountMl, addWater, setGoal } = useWater();
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState(formatLiters(goalMl));

  const progress = goalMl === 0 ? 0 : (todayAmountMl / goalMl) * 100;

  function startEditingGoal() {
    setGoalDraft(formatLiters(goalMl));
    setIsEditingGoal(true);
  }

  function commitGoal() {
    const parsed = Number(goalDraft.replace(",", "."));
    if (Number.isFinite(parsed) && parsed > 0) {
      setGoal(Math.round(parsed * 1000));
    }
    setIsEditingGoal(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
          Гидратация
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-vanta-text">Вода</h1>
      </div>

      <Card bracket className="flex flex-col items-center gap-6 p-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-mono text-6xl font-semibold tabular-nums tracking-tight text-vanta-text">
            {formatLiters(todayAmountMl)}
          </p>
          <p className="text-sm text-vanta-text-muted">
            из{" "}
            {isEditingGoal ? (
              <input
                autoFocus
                inputMode="decimal"
                value={goalDraft}
                onChange={(event) => setGoalDraft(event.target.value)}
                onBlur={commitGoal}
                onKeyDown={(event) => {
                  if (event.key === "Enter") commitGoal();
                }}
                className="w-12 border-b border-vanta-border bg-transparent text-center text-vanta-text-muted outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={startEditingGoal}
                className="underline decoration-vanta-border decoration-dotted underline-offset-4 hover:text-vanta-text hover:decoration-vanta-accent"
              >
                {formatLiters(goalMl)}
              </button>
            )}{" "}
            л
          </p>
        </div>

        <div className="w-full">
          <ProgressBar value={progress} className="h-2" />
        </div>

        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={() => addWater(-250)}
            aria-label="Уменьшить на 250 мл"
            className="flex items-center justify-center rounded-xl border border-vanta-border px-4 py-3 text-vanta-text-muted transition-colors hover:text-vanta-text"
          >
            <Minus className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => addWater(250)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-vanta-border px-4 py-3 text-sm font-medium text-vanta-text transition-colors hover:border-vanta-accent"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            250 мл
          </button>
          <button
            type="button"
            onClick={() => addWater(500)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-vanta-accent px-4 py-3 text-sm font-medium text-vanta-bg transition-opacity hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            500 мл
          </button>
        </div>
      </Card>
    </div>
  );
}