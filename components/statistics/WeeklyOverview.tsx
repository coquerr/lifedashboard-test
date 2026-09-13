import type { WeekOverWeekComparison } from "@/services/statisticsService";

interface WeeklyOverviewCard {
  label: string;
  value: string;
  comparison: WeekOverWeekComparison;
}

interface WeeklyOverviewProps {
  cards: WeeklyOverviewCard[];
}

function ComparisonIndicator({ comparison }: { comparison: WeekOverWeekComparison }) {
  if (comparison.percentChange === null) {
    return <p className="text-xs text-vanta-text-dim">Недостаточно данных за прошлую неделю</p>;
  }

  if (comparison.percentChange === 0) {
    return <p className="text-xs text-vanta-text-muted">Как на прошлой неделе</p>;
  }

  const arrow = comparison.percentChange > 0 ? "↑" : "↓";
  const colorClass = comparison.isPositive ? "text-vanta-accent" : "text-vanta-text-muted";

  return (
    <p className={`text-xs ${colorClass}`}>
      {arrow} {Math.abs(comparison.percentChange)}% с прошлой недели
    </p>
  );
}

export function WeeklyOverview({ cards }: WeeklyOverviewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="flex flex-col gap-2 rounded-xl bg-vanta-surface-hover p-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
            {card.label}
          </p>
          <p className="text-2xl font-medium text-vanta-text">{card.value}</p>
          <ComparisonIndicator comparison={card.comparison} />
        </div>
      ))}
    </div>
  );
}