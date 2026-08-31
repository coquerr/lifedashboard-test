"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { todayISO } from "@/lib/date";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import * as focusService from "@/services/focusService";
import type { FocusDurationMinutes, FocusLog, FocusTag } from "@/types/focus";

const DEFAULT_LOG: FocusLog = { entries: [] };
const DURATIONS: FocusDurationMinutes[] = [25, 50, 90];

export function useFocusTimer() {
  const [log, setLog] = useLocalStorageState<FocusLog>(STORAGE_KEYS.focus, DEFAULT_LOG);
  const [duration, setDuration] = useState<FocusDurationMinutes>(25);
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [tag, setTag] = useState<FocusTag>("untracked");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasMigratedRef = useRef(false);

  useEffect(() => {
    if (hasMigratedRef.current) return;
    hasMigratedRef.current = true;

    const { log: migratedLog, wasMigrated } = focusService.migrateFocusLog(log);
    if (wasMigrated) {
      setLog(migratedLog);
    }
  }, [log, setLog]);

  const todayMinutes = focusService.getTodayMinutes(log);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setLog((current) => focusService.addSession(current, todayISO(), duration, tag));
          return duration * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, duration, tag, setLog]);

  const toggle = useCallback(() => setIsRunning((prev) => !prev), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(duration * 60);
  }, [duration]);

  const selectDuration = useCallback((minutes: FocusDurationMinutes) => {
    setIsRunning(false);
    setDuration(minutes);
    setSecondsLeft(minutes * 60);
  }, []);

  return {
    durations: DURATIONS,
    duration,
    secondsLeft,
    isRunning,
    todayMinutes,
    tag,
    setTag,
    toggle,
    reset,
    selectDuration,
  };
}