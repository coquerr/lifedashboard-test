"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

interface FocusModeContextValue {
  isFocusMode: boolean;
  setFocusMode: (value: boolean) => void;
}

const FocusModeContext = createContext<FocusModeContextValue | null>(null);

export function FocusModeProvider({ children }: { children: ReactNode }) {
  const [isFocusMode, setFocusMode] = useState(false);

  const value = useMemo(() => ({ isFocusMode, setFocusMode }), [isFocusMode]);

  return <FocusModeContext.Provider value={value}>{children}</FocusModeContext.Provider>;
}

export function useFocusMode(): FocusModeContextValue {
  const context = useContext(FocusModeContext);
  if (!context) {
    throw new Error("useFocusMode должен использоваться внутри FocusModeProvider");
  }
  return context;
}