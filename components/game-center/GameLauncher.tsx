"use client";

import { GAME_LIST } from "@/lib/games";
import { useGameCenter } from "@/context/GameCenterContext";
import { playClick } from "@/hooks/useSound";

export default function GameLauncher() {
  const { openGame } = useGameCenter();

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-[440px]">
      {GAME_LIST.map((game) => (
        <button
          key={game.id}
          onClick={() => {
            playClick();
            openGame(game.id);
          }}
          className="text-left border border-gunmetal bg-charcoal rounded-sm p-5 transition-all duration-300 hover:border-blue hover:-translate-y-0.5"
        >
          <div className="font-display text-[16px] font-semibold text-offwhite mb-1.5">
            {game.title}
          </div>
          <div className="text-titanium text-[12px] leading-relaxed">{game.tagline}</div>
        </button>
      ))}
    </div>
  );
}
