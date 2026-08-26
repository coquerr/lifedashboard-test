import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import type { WaterLog } from "@/types/water";

const DEFAULT_LOG: WaterLog = { goalMl: 2000, entries: {} };

export function useWaterLog(): WaterLog {
  const [log] = useLocalStorageState<WaterLog>(STORAGE_KEYS.water, DEFAULT_LOG);
  return log;
}