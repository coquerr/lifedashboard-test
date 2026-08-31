"use client";

import { useEffect, useRef } from "react";

import { addDaysISO, todayISO } from "@/lib/date";

interface WeekStripProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const RANGE = 15;

function weekdayShort(date: Date): string {
  const label = date.toLocaleDateString("ru-RU", { weekday: "short" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function WeekStrip({ selectedDate, onSelectDate }: WeekStripProps) {
  const selectedRef = useRef<HTMLButtonElement>(null);
  const today = todayISO();

  const dates = Array.from({ length: RANGE * 2 + 1 }, (_, index) =>
    addDaysISO(today, index - RANGE),
  );

  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedDate]);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
      {dates.map((date) => {
        const isSelected = date === selectedDate;
        const isToday = date === today;
        const day = new Date(`${date}T00:00:00`);

        return (
          <button
            key={date}
            ref={isSelected ? selectedRef : undefined}
            type="button"
            onClick={() => onSelectDate(date)}
            className={`flex min-w-[52px] shrink-0 flex-col items-center gap-1 rounded-xl border px-2 py-2.5 transition-colors ${
              isSelected
                ? "border-vanta-accent bg-vanta-accent/10 text-vanta-accent"
                : "border-vanta-border text-vanta-text-muted hover:text-vanta-text"
            }`}
          >
            <span className="text-[10px] uppercase tracking-wide">{weekdayShort(day)}</span>
            <span className="flex items-center gap-1 text-sm font-medium">
              {day.getDate()}
              {isToday ? <span className="h-1 w-1 rounded-full bg-vanta-accent" /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}