import { useCallback } from "react";

import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { todayISO } from "@/lib/date";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import * as waterService from "@/services/waterService";
import type { WaterLog } from "@/types/water";

const DEFAULT_LOG: WaterLog = { goalMl: 2000, entries: {} };

export function useWater() {
  const [log, setLog] = useLocalStorageState<WaterLog>(STORAGE_KEYS.water, DEFAULT_LOG);
  const today = todayISO();

  const todayAmountMl = waterService.getAmountForDate(log, today);

  const addWater = useCallback(
    (deltaMl: number) => setLog((current) => waterService.addWater(current, today, deltaMl)),
    [setLog, today],
  );

  const setGoal = useCallback(
    (goalMl: number) => setLog((current) => waterService.setGoal(current, goalMl)),
    [setLog],
  );

  return { goalMl: log.goalMl, todayAmountMl, addWater, setGoal };
}