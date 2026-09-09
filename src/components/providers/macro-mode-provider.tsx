"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type MacroMode = "normal" | "nerd";

const STORAGE_KEY = "full.macro-mode.v1";

interface MacroModeContextValue {
  mode: MacroMode;
  isNerd: boolean;
  setMode: (mode: MacroMode) => void;
  toggle: () => void;
}

const MacroModeContext = createContext<MacroModeContextValue | null>(null);

export function MacroModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<MacroMode>("normal");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "nerd" || stored === "normal") setModeState(stored);
    } catch {
      /* storage unavailable — default mode is fine */
    }
  }, []);

  const setMode = useCallback((next: MacroMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({
      mode,
      isNerd: mode === "nerd",
      setMode,
      toggle: () => setMode(mode === "nerd" ? "normal" : "nerd"),
    }),
    [mode, setMode],
  );

  return <MacroModeContext.Provider value={value}>{children}</MacroModeContext.Provider>;
}

export function useMacroMode() {
  const context = useContext(MacroModeContext);
  if (!context) throw new Error("useMacroMode must be used inside <MacroModeProvider>");
  return context;
}
