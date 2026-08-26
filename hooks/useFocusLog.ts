import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import type { FocusLog } from "@/types/focus";

const DEFAULT_LOG: FocusLog = { entries: {} };

export function useFocusLog(): FocusLog {
  const [log] = useLocalStorageState<FocusLog>(STORAGE_KEYS.focus, DEFAULT_LOG);
  return log;
}