"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { GameId } from "@/lib/games";
import { useAchievements } from "./AchievementContext";

type GameCenterState = {
  isOpen: boolean;
  activeGame: GameId | null;
};

type GameCenterContextValue = GameCenterState & {
  openLauncher: () => void;
  openGame: (id: GameId) => void;
  backToLauncher: () => void;
  close: () => void;
};

const GameCenterContext = createContext<GameCenterContextValue | null>(null);

export function GameCenterProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameCenterState>({ isOpen: false, activeGame: null });
  const { unlock } = useAchievements();

  const openLauncher = useCallback(() => {
    setState({ isOpen: true, activeGame: null });
  }, []);

  const openGame = useCallback(
    (id: GameId) => {
      setState({ isOpen: true, activeGame: id });
      unlock("played-first-game");
    },
    [unlock]
  );

  const backToLauncher = useCallback(() => {
    setState((prev) => ({ ...prev, activeGame: null }));
  }, []);

  const close = useCallback(() => {
    setState({ isOpen: false, activeGame: null });
  }, []);

  const value = useMemo(
    () => ({ ...state, openLauncher, openGame, backToLauncher, close }),
    [state, openLauncher, openGame, backToLauncher, close]
  );

  return <GameCenterContext.Provider value={value}>{children}</GameCenterContext.Provider>;
}

export function useGameCenter() {
  const ctx = useContext(GameCenterContext);
  if (!ctx) throw new Error("useGameCenter must be used within a GameCenterProvider");
  return ctx;
}
