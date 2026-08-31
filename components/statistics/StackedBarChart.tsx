import { FOCUS_TAG_LABELS } from "@/types/focus";
import type { FocusTag } from "@/types/focus";

interface StackedDayPoint {
  label: string;
  segments: { tag: FocusTag; value: number }[];
}

interface StackedBarChartProps {
  data: StackedDayPoint[];
  formatValue?: (value: number) => string;
}

const TAG_COLORS: Record<FocusTag, string> = {
  coding: "#c9a24b",
  english: "#5A7D9A",
  study: "#766C95",
  untracked: "#404040",
};

export function StackedBarChart({ data, formatValue }: StackedBarChartProps) {
  const dayTotals = data.map((day) => day.segments.reduce((sum, seg) => sum + seg.value, 0));
  const max = Math.max(1, ...dayTotals);

  const tagsPresent = new Set<FocusTag>();
  data.forEach((day) => day.segments.forEach((seg) => tagsPresent.add(seg.tag)));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-20 items-end justify-between gap-2">
        {data.map((day, index) => {
          const total = dayTotals[index];
          const totalHeightPercent = total > 0 ? Math.max((total / max) * 100, 6) : 2;

          return (
            <div key={day.label} className="relative flex h-full flex-1 items-end justify-center">
              {total > 0 ? (
                <span
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap text-[10px] text-vanta-text-dim"
                  style={{ bottom: `calc(${totalHeightPercent}% + 4px)` }}
                >
                  {formatValue ? formatValue(total) : String(total)}
                </span>
              ) : null}

              <div
                className="flex w-full max-w-6 flex-col-reverse overflow-hidden rounded-t-md"
                style={{ height: `${totalHeightPercent}%` }}
              >
                {day.segments.map((segment) => {
                  const segmentPercent = total > 0 ? (segment.value / total) * 100 : 0;
                  return (
                    <div
                      key={segment.tag}
                      style={{
                        height: `${segmentPercent}%`,
                        backgroundColor: TAG_COLORS[segment.tag],
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between gap-2">
        {data.map((day) => (
          <span key={day.label} className="flex-1 text-center text-[10px] text-vanta-text-dim">
            {day.label}
          </span>
        ))}
      </div>

      {tagsPresent.size > 0 ? (
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1.5">
          {Array.from(tagsPresent).map((tag) => (
            <div key={tag} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: TAG_COLORS[tag] }}
              />
              <span className="text-[11px] text-vanta-text-muted">{FOCUS_TAG_LABELS[tag]}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}