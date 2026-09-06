"use client";

import { useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";

import { useFocusTimer } from "@/hooks/useFocusTimer";
import { formatCountdown, formatDuration } from "@/lib/format";

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

  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);

  const hasProgress = secondsLeft !== duration * 60;
  const isExpanded = isRunning || hasProgress || isManuallyExpanded;

  function handleReset() {
    reset();
    setIsManuallyExpanded(false);
  }

  function handleCollapse() {
    setIsManuallyExpanded(false);
  }

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsManuallyExpanded(true)}
        className="flex w-full items-center gap-3 rounded-xl px-2 py-1 text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vanta-accent focus-visible:ring-offset-2 focus-visible:ring-offset-vanta-bg"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vanta-accent text-vanta-bg">
          <Play className="ml-0.5 h-4 w-4" strokeWidth={2} />
        </span>

        <span className="flex flex-1 items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-vanta-text-dim" strokeWidth={1.75} />
            <span className="font-mono text-lg font-semibold tabular-nums text-vanta-text">
              {formatCountdown(secondsLeft)}
            </span>
          </span>

          <span className="flex items-center gap-1">
            {durations.map((option) => (
              <span
                key={option}
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  selectDuration(option);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.stopPropagation();
                    event.preventDefault();
                    selectDuration(option);
                  }
                }}
                className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                  duration === option
                    ? "bg-vanta-accent/15 text-vanta-accent"
                    : "text-vanta-text-muted hover:text-vanta-text"
                }`}
              >
                {option}
              </span>
            ))}
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex w-full items-center justify-between">
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

        {!isRunning && !hasProgress ? (
          <button
            type="button"
            onClick={handleCollapse}
            aria-label="Свернуть"
            className="flex h-8 w-8 items-center justify-center rounded-full text-vanta-text-dim transition-colors hover:text-vanta-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vanta-accent focus-visible:ring-offset-2 focus-visible:ring-offset-vanta-bg"
          >
            <span className="text-lg leading-none">–</span>
          </button>
        ) : null}
      </div>

      <p className="font-mono text-6xl font-semibold tabular-nums tracking-tight text-vanta-text">
        {formatCountdown(secondsLeft)}
      </p>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleReset}
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
    </div>
  );
}