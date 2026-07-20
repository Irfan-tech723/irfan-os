"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAchievements } from "./AchievementContext";

type DevModeContextValue = {
  isOpen: boolean;
  wireframes: boolean;
  toggleOpen: () => void;
  toggleWireframes: () => void;
  close: () => void;
};

const DevModeContext = createContext<DevModeContextValue | null>(null);

export function DevModeProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [wireframes, setWireframes] = useState(false);
  const { unlock } = useAchievements();

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) unlock("found-developer-mode");
      return next;
    });
  }, [unlock]);

  const toggleWireframes = useCallback(() => setWireframes((w) => !w), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Global shortcut: Ctrl+Shift+D (Cmd+Shift+D on Mac).
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();
        toggleOpen();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggleOpen]);

  return (
    <DevModeContext.Provider value={{ isOpen, wireframes, toggleOpen, toggleWireframes, close }}>
      {wireframes && (
        <style>{`* { outline: 1px solid rgba(63,127,255,0.35) !important; }`}</style>
      )}
      {children}
    </DevModeContext.Provider>
  );
}

export function useDevMode() {
  const ctx = useContext(DevModeContext);
  if (!ctx) throw new Error("useDevMode must be used within a DevModeProvider");
  return ctx;
}
