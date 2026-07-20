"use client";

import { useEffect } from "react";
import { useGameCenter } from "@/context/GameCenterContext";
import { GAMES } from "@/lib/games";
import GameLauncher from "./GameLauncher";
import TicTacToe from "./games/TicTacToe";
import Snake from "./games/Snake";
import Pong from "./games/Pong";
import MemoryGame from "./games/MemoryGame";

const GAME_COMPONENTS = {
  tictactoe: TicTacToe,
  snake: Snake,
  pong: Pong,
  memory: MemoryGame,
};

export default function GameCenterHost() {
  const { isOpen, activeGame, backToLauncher, close } = useGameCenter();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        activeGame ? backToLauncher() : close();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, activeGame, backToLauncher, close]);

  if (!isOpen) return null;

  const ActiveGameComponent = activeGame ? GAME_COMPONENTS[activeGame] : null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9200] flex items-center justify-center p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="w-full max-w-[560px] bg-[#020202] border border-gunmetal rounded-md overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between px-4 py-3 bg-charcoal border-b border-gunmetal">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4a2020]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#4a3d1a]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#1a3a22]" />
            <span className="ml-2 font-mono text-[11px] text-titanium">
              game-center{activeGame ? ` — ${GAMES[activeGame].title}` : ""}
            </span>
          </div>
          <div className="flex gap-2">
            {activeGame && (
              <button
                onClick={backToLauncher}
                className="font-mono text-[10px] uppercase text-titanium hover:text-offwhite transition-colors"
                style={{ letterSpacing: "0.08em" }}
              >
                ‹ Launcher
              </button>
            )}
            <button
              onClick={close}
              className="font-mono text-[10px] uppercase text-titanium hover:text-offwhite transition-colors"
              style={{ letterSpacing: "0.08em" }}
            >
              ✕ Exit
            </button>
          </div>
        </div>

        <div className="p-7 flex items-center justify-center min-h-[380px]">
          {ActiveGameComponent ? <ActiveGameComponent /> : <GameLauncher />}
        </div>
      </div>
    </div>
  );
}
