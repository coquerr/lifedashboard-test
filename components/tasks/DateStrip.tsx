"use client";

import { addDaysISO, todayISO } from "@/lib/date";

interface DateStripProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const SHORT_WEEKDAY_FORMAT: Intl.DateTimeFormatOptions = { weekday: "short" };
const DAY_NUMBER_FORMAT: Intl.DateTimeFormatOptions = { day: "numeric" };

function toLocalDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00`);
}

export function DateStrip({ selectedDate, onSelectDate }: DateStripProps) {
  const today = todayISO();
  const days = Array.from({ length: 7 }, (_, index) => addDaysISO(selectedDate, index - 3));

  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
        Дни
      </p>
      <div className="flex flex-col gap-1.5">
        {days.map((date) => {
          const isSelected = date === selectedDate;
          const isToday = date === today;
          const dateObj = toLocalDate(date);
          const weekday = dateObj.toLocaleDateString("ru-RU", SHORT_WEEKDAY_FORMAT);
          const dayNumber = dateObj.toLocaleDateString("ru-RU", DAY_NUMBER_FORMAT);

          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelectDate(date)}
              aria-current={isSelected ? "date" : undefined}
              className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vanta-accent focus-visible:ring-offset-2 focus-visible:ring-offset-vanta-bg ${
                isSelected
                  ? "border-vanta-accent bg-vanta-accent/10 text-vanta-text"
                  : "border-vanta-border text-vanta-text-muted hover:border-vanta-text-dim hover:text-vanta-text"
              }`}
            >
              <span className="text-sm capitalize">{weekday}</span>
              <span className="flex items-center gap-1.5 font-mono text-sm">
                {dayNumber}
                {isToday ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-vanta-accent" aria-hidden="true" />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}