"use client";

import { Pause, Play, RotateCcw } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { useFocusTimer } from "@/hooks/useFocusTimer";

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} мин`;
  return `${hours} ч ${minutes} мин`;
}

export function FocusCard() {
  const {
    durations,
    duration,
    secondsLeft,
    isRunning,
    todayMinutes,
    toggle,
    reset,
    selectDuration,
  } = useFocusTimer();

  return (
    <Card bracket className="flex flex-col items-center gap-6 p-6">
      <div className="flex items-center gap-2">
        {durations.map((option) => (
          <button
            key={option}
            type="button"
            disabled={isRunning}
            onClick={() => selectDuration(option)}
            className={`rounded-full px-3 py-1 text-xs transition-colors disabled:opacity-40 ${
              duration === option
                ? "bg-vanta-accent/15 text-vanta-accent"
                : "text-vanta-text-muted hover:text-vanta-text"
            }`}
          >
            {option} мин
          </button>
        ))}
      </div>

      <p className="font-mono text-6xl font-semibold tabular-nums tracking-tight text-vanta-text">
        {formatCountdown(secondsLeft)}
      </p>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={reset}
          aria-label="Сбросить таймер"
          className="flex h-10 w-10 items-center justify-center rounded-full text-vanta-text-dim transition-colors hover:text-vanta-text"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <button
          type="button"
          onClick={toggle}
          aria-label={isRunning ? "Пауза" : "Старт"}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-vanta-accent text-vanta-bg transition-opacity hover:opacity-90"
        >
          {isRunning ? (
            <Pause className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Play className="ml-0.5 h-6 w-6" strokeWidth={2} />
          )}
        </button>

        <div className="h-10 w-10" aria-hidden="true" />
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
        Сегодня: {formatDuration(todayMinutes)}
      </p>
    </Card>
  );
}