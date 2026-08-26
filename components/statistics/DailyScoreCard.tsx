import { Card } from "@/components/ui/Card";
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

  return (
    <Card bracket className="flex flex-col items-center gap-5 p-8 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
        Daily Score
      </p>

      <div>
        <p className="font-mono text-7xl font-semibold tabular-nums tracking-tight text-vanta-text">
          {score.total}
        </p>
        <p className="mt-1 text-sm text-vanta-accent">{score.label}</p>
      </div>

      <div className="grid w-full grid-cols-5 gap-2 text-xs">
        {breakdownKeys.map((key) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <span className="text-vanta-text-dim">{BREAKDOWN_LABELS[key]}</span>
            <span className="font-mono text-vanta-text">+{score.breakdown[key]}</span>
          </div>
        ))}
      </div>

      <p className="max-w-xs text-[11px] leading-relaxed text-vanta-text-dim">
        Игровой показатель активности за день — не медицинская и не объективная оценка
        продуктивности.
      </p>
    </Card>
  );
}