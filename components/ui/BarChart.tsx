interface BarChartProps {
  data: { label: string; value: number }[];
  formatValue?: (value: number) => string;
  thresholdValue?: number;
  thresholdLabel?: string;
}

export function BarChart({ data, formatValue, thresholdValue, thresholdLabel }: BarChartProps) {
  const max = Math.max(1, thresholdValue ?? 0, ...data.map((point) => point.value));
  const thresholdPercent =
    thresholdValue !== undefined ? Math.min(100, (thresholdValue / max) * 100) : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex h-20 items-end justify-between gap-2">
        {thresholdPercent !== null ? (
          <div
            className="pointer-events-none absolute inset-x-0 flex items-center gap-1"
            style={{ bottom: `${thresholdPercent}%` }}
          >
            <div className="h-px flex-1 border-t border-dashed border-vanta-text-dim" />
            {thresholdLabel ? (
              <span className="shrink-0 -translate-y-1.5 font-mono text-[9px] uppercase tracking-wide text-vanta-text-dim">
                {thresholdLabel}
              </span>
            ) : null}
          </div>
        ) : null}

        {data.map((point) => {
          const heightPercent = Math.round((point.value / max) * 100);
          const barHeightPercent = point.value > 0 ? Math.max(heightPercent, 6) : 2;

          return (
            <div key={point.label} className="relative flex h-full flex-1 items-end justify-center">
              {point.value > 0 ? (
                <span
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap text-[10px] text-vanta-text-dim"
                  style={{ bottom: `calc(${barHeightPercent}% + 4px)` }}
                >
                  {formatValue ? formatValue(point.value) : String(point.value)}
                </span>
              ) : null}
              <div
                className="w-full max-w-6 rounded-t-md bg-vanta-accent/70"
                style={{ height: `${barHeightPercent}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between gap-2">
        {data.map((point) => (
          <span key={point.label} className="flex-1 text-center text-[10px] text-vanta-text-dim">
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}