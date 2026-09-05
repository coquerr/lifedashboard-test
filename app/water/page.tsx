"use client";

import { useState } from "react";
import { Dumbbell, Plus } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { useWater } from "@/hooks/useWater";
import { formatLiters } from "@/lib/format";

function vibrate() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(50);
  }
}

const HERO_BUTTON_BASE =
  "flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-vanta-border px-3 py-3.5 text-sm font-medium text-vanta-text transition-colors hover:border-vanta-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vanta-accent focus-visible:ring-offset-2 focus-visible:ring-offset-vanta-bg";

export default function WaterPage() {
  const { goalMl, todayAmountMl, addWater, setGoal } = useWater();
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState(formatLiters(goalMl));

  const animatedAmountMl = useAnimatedValue(todayAmountMl, 500);
  const progress = goalMl === 0 ? 0 : (animatedAmountMl / goalMl) * 100;

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

  function handleAddWater(deltaMl: number) {
    vibrate();
    addWater(deltaMl);
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
        <p className="font-mono text-7xl font-semibold tabular-nums tracking-tight text-vanta-text">
          {formatLiters(Math.round(animatedAmountMl))}
        </p>

        <div className="flex w-full flex-col items-center gap-2">
          <ProgressBar
            value={progress}
            className="h-2"
            trackClassName="bg-white/10"
            glow
          />
          <p className="text-xs text-vanta-text-dim">
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
                className="w-10 rounded-sm border-b border-vanta-border bg-transparent text-center text-vanta-text-dim outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vanta-accent focus-visible:ring-offset-2 focus-visible:ring-offset-vanta-bg"
              />
            ) : (
              <button
                type="button"
                onClick={startEditingGoal}
                className="rounded-sm underline decoration-vanta-border decoration-dotted underline-offset-4 hover:text-vanta-text hover:decoration-vanta-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vanta-accent focus-visible:ring-offset-2 focus-visible:ring-offset-vanta-bg"
              >
                {formatLiters(goalMl)}
              </button>
            )}{" "}
            л
          </p>
        </div>

        <div className="flex w-full gap-2">
          <button type="button" onClick={() => handleAddWater(250)} className={HERO_BUTTON_BASE}>
            <Plus className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            250
          </button>
          <button type="button" onClick={() => handleAddWater(300)} className={HERO_BUTTON_BASE}>
            <Dumbbell className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            300
          </button>
          <button type="button" onClick={() => handleAddWater(500)} className={HERO_BUTTON_BASE}>
            <Plus className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            500
          </button>
        </div>

        <button
          type="button"
          onClick={() => handleAddWater(-250)}
          className="text-xs text-vanta-text-dim transition-colors hover:text-vanta-text-muted"
        >
          −250
        </button>
      </Card>
    </div>
  );
}