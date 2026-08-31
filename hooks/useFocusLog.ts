"use client";

import { useEffect, useRef } from "react";

import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import * as focusService from "@/services/focusService";
import type { FocusLog } from "@/types/focus";

const DEFAULT_LOG: FocusLog = { entries: [] };

export function useFocusLog(): FocusLog {
  const [log, setLog] = useLocalStorageState<FocusLog>(STORAGE_KEYS.focus, DEFAULT_LOG);
  const hasMigratedRef = useRef(false);

  useEffect(() => {
    if (hasMigratedRef.current) return;
    hasMigratedRef.current = true;

    const { log: migratedLog, wasMigrated } = focusService.migrateFocusLog(log);
    if (wasMigrated) {
      setLog(migratedLog);
    }
  }, [log, setLog]);

  return log;
}