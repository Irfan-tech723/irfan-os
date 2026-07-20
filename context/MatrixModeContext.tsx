"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useAchievements } from "./AchievementContext";

type MatrixModeContextValue = {
  isActive: boolean;
  activate: () => void;
  deactivate: () => void;
};

const MatrixModeContext = createContext<MatrixModeContextValue | null>(null);

export function MatrixModeProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const { unlock } = useAchievements();

  const activate = useCallback(() => {
    setIsActive(true);
    unlock("activated-matrix-mode");
  }, [unlock]);

  const deactivate = useCallback(() => setIsActive(false), []);

  return (
    <MatrixModeContext.Provider value={{ isActive, activate, deactivate }}>
      {children}
    </MatrixModeContext.Provider>
  );
}

export function useMatrixMode() {
  const ctx = useContext(MatrixModeContext);
  if (!ctx) throw new Error("useMatrixMode must be used within a MatrixModeProvider");
  return ctx;
}
