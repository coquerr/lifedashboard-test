import { Card } from "@/components/ui/Card";
import { formatMoney } from "@/lib/format";
import type { DayPoint } from "@/services/statisticsService";

interface WeeklyExpensesChartProps {
  data: DayPoint[];
}

const CHART_HEIGHT_PX = 160;
const MIN_BAR_HEIGHT_PERCENT = 4;

export function WeeklyExpensesChart({ data }: WeeklyExpensesChartProps) {
  const maxValue = Math.max(...data.map((point) => point.value), 1);
  const todayIndex = data.length - 1;

  return (
    <Card className="flex flex-col gap-4 p-5">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
        Расходы по дням
      </p>

      <div className="flex items-end justify-between gap-2" style={{ height: CHART_HEIGHT_PX }}>
        {data.map((point, index) => {
          const heightPercent =
            point.value === 0
              ? MIN_BAR_HEIGHT_PERCENT
              : Math.max(MIN_BAR_HEIGHT_PERCENT, Math.round((point.value / maxValue) * 100));
          const isToday = index === todayIndex;

          return (
            <div key={`${point.label}-${index}`} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-full w-full items-end justify-center">
                <div
                  className={`w-full max-w-6 rounded-t-sm transition-all ${
                    isToday ? "bg-vanta-accent" : "bg-vanta-surface-hover"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                  title={formatMoney(point.value)}
                />
              </div>
              <span className="text-xs text-vanta-text-dim">{point.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}