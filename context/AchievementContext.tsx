"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ACHIEVEMENTS, type AchievementId, type AchievementDef } from "@/lib/achievements";

const STORAGE_KEY = "irfan-os-achievements";

type AchievementContextValue = {
  unlocked: Set<AchievementId>;
  queue: AchievementDef[];
  unlock: (id: AchievementId) => void;
  dismissFront: () => void;
};

const AchievementContext = createContext<AchievementContextValue | null>(null);

function readSession(): AchievementId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AchievementId[]) : [];
  } catch {
    return [];
  }
}

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  // Session-only by design (sessionStorage, not localStorage) — progress
  // resets the next time the visitor opens a fresh tab, matching "store
  // progress only during the current session."
  const [unlocked, setUnlocked] = useState<Set<AchievementId>>(new Set());
  const [queue, setQueue] = useState<AchievementDef[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    setUnlocked(new Set(readSession()));
    hydrated.current = true;
  }, []);

  const unlock = useCallback((id: AchievementId) => {
    setUnlocked((prev) => {
      if (prev.has(id)) return prev; // already unlocked — no duplicate notification
      const next = new Set(prev);
      next.add(id);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      }
      setQueue((q) => [...q, ACHIEVEMENTS[id]]);
      return next;
    });
  }, []);

  const dismissFront = useCallback(() => {
    setQueue((q) => q.slice(1));
  }, []);

  return (
    <AchievementContext.Provider value={{ unlocked, queue, unlock, dismissFront }}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const ctx = useContext(AchievementContext);
  if (!ctx) {
    throw new Error("useAchievements must be used within an AchievementProvider");
  }
  return ctx;
}
