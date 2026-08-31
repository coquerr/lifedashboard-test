"use client";

import { useEffect, useRef } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { CircularProgress } from "@/components/focus/CircularProgress";
import { useFocusMode } from "@/components/layout/FocusModeContext";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { formatCountdown, formatDuration } from "@/lib/format";

export default function FocusPage() {
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

  const { setFocusMode } = useFocusMode();
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    setFocusMode(isRunning);
    return () => setFocusMode(false);
  }, [isRunning, setFocusMode]);

  useEffect(() => {
    if (!isRunning) {
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
      return;
    }

    if (!("wakeLock" in navigator)) return;

    let cancelled = false;

    navigator.wakeLock
      .request("screen")
      .then((sentinel) => {
        if (cancelled) {
          sentinel.release().catch(() => {});
          return;
        }
        wakeLockRef.current = sentinel;
      })
      .catch(() => {
        // Wake Lock недоступен (например, вкладка не активна) — тихо игнорируем.
      });

    return () => {
      cancelled = true;
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
    };
  }, [isRunning]);

  const totalSeconds = duration * 60;
  const progress = totalSeconds === 0 ? 0 : ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
          Концентрация
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-vanta-text">Фокус</h1>
      </div>

      <Card bracket className="flex flex-col items-center gap-10 p-10">
        <div className="flex items-center gap-2">
          {durations.map((option) => (
            <button
              key={option}
              type="button"
              disabled={isRunning}
              onClick={() => selectDuration(option)}
              className={`rounded-full px-4 py-1.5 text-xs transition-colors disabled:opacity-40 ${
                duration === option
                  ? "bg-vanta-accent/15 text-vanta-accent"
                  : "text-vanta-text-muted hover:text-vanta-text"
              }`}
            >
              {option} мин
            </button>
          ))}
        </div>

        <div className="relative flex h-[280px] w-[280px] items-center justify-center">
          <CircularProgress progress={progress} />
          <p className="font-mono text-7xl font-semibold tabular-nums tracking-tight text-vanta-text">
            {formatCountdown(secondsLeft)}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={reset}
            aria-label="Сбросить таймер"
            className="relative flex h-12 min-h-[48px] w-12 min-w-[48px] items-center justify-center rounded-full text-vanta-text-dim transition-colors hover:text-vanta-text"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={toggle}
            aria-label={isRunning ? "Пауза" : "Старт"}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-vanta-accent text-vanta-bg transition-opacity hover:opacity-90"
          >
            {isRunning ? (
              <Pause className="h-7 w-7" strokeWidth={2} />
            ) : (
              <Play className="ml-0.5 h-7 w-7" strokeWidth={2} />
            )}
          </button>

          <div className="h-12 w-12" aria-hidden="true" />
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vanta-text-dim">
          Сегодня: {formatDuration(todayMinutes)}
        </p>
      </Card>
    </div>
  );
}