"use client";

import { useState } from "react";
import { Droplet, Minus, Plus } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useWater } from "@/hooks/useWater";
import { formatLiters } from "@/lib/format";

export function WaterCard() {
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
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
          Вода
        </p>
        <Droplet className="h-4 w-4 text-vanta-text-dim" strokeWidth={1.75} />
      </div>

      <div>
        <p className="text-3xl font-semibold text-vanta-text">
          {formatLiters(todayAmountMl)}{" "}
          <span className="text-base font-normal text-vanta-text-muted">
            /{" "}
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
                className="w-12 border-b border-vanta-border bg-transparent text-vanta-text-muted outline-none"
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
          </span>
        </p>
        <div className="mt-3">
          <ProgressBar value={progress} />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => addWater(-250)}
          aria-label="Уменьшить на 250 мл"
          className="flex items-center justify-center rounded-xl border border-vanta-border px-3 py-2 text-vanta-text-muted transition-colors hover:text-vanta-text"
        >
          <Minus className="h-4 w-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => addWater(250)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-vanta-border px-3 py-2 text-sm font-medium text-vanta-text transition-colors hover:border-vanta-accent"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          250
        </button>
        <button
          type="button"
          onClick={() => addWater(500)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-vanta-accent px-3 py-2 text-sm font-medium text-vanta-bg transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          500
        </button>
      </div>
    </Card>
  );
}