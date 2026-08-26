interface BarChartProps {
  data: { label: string; value: number }[];
  formatValue?: (value: number) => string;
}

export function BarChart({ data, formatValue }: BarChartProps) {
  const max = Math.max(1, ...data.map((point) => point.value));

  return (
    <div className="flex items-end justify-between gap-2">
      {data.map((point) => {
        const heightPercent = Math.round((point.value / max) * 100);

        return (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-20 w-full items-end justify-center">
              <div
                className="w-full max-w-6 rounded-t-md bg-vanta-accent/70"
                style={{ height: `${point.value > 0 ? Math.max(heightPercent, 6) : 2}%` }}
                title={formatValue ? formatValue(point.value) : String(point.value)}
              />
            </div>
            <span className="text-[10px] text-vanta-text-dim">{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}