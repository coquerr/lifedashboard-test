"use client";

import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import type { DailyScore, DailyScoreBreakdown } from "@/services/statisticsService";

const BREAKDOWN_LABELS: Record<keyof DailyScoreBreakdown, string> = {
  tasks: "Tasks",
  habits: "Habits",
  focus: "Focus",
  water: "Water",
  other: "Other",
};

interface DailyScoreCardProps {
  score: DailyScore;
}

export function DailyScoreCard({ score }: DailyScoreCardProps) {
  const breakdownKeys = Object.keys(score.breakdown) as (keyof DailyScoreBreakdown)[];
  const animatedTotal = useAnimatedValue(score.total, 800);

  const breakdownText = breakdownKeys
    .map((key) => `${BREAKDOWN_LABELS[key]}: ${score.breakdown[key]}`)
    .join(" • ");

  return (
    <div className="relative flex flex-col items-center gap-3 px-8 py-10 text-center">
      <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-vanta-accent/50" />
      <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-vanta-accent/50" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-vanta-accent/50" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-vanta-accent/50" />

      <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
        Daily Score
      </p>

      <p className="font-mono text-8xl font-semibold tabular-nums tracking-tight text-vanta-text">
        {Math.round(animatedTotal)}
      </p>
      <p className="text-sm text-vanta-accent">{score.label}</p>

      <p className="mt-2 font-mono text-xs text-vanta-text-dim">{breakdownText}</p>
    </div>
  );
}