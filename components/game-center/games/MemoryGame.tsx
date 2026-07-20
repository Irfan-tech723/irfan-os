"use client";

import { useEffect, useState } from "react";
import GameShell from "../GameShell";
import { playClick } from "@/hooks/useSound";

const SYMBOLS = ["PYTHON", "REACT", "YOLO", "NODE", "NEXT.JS", "MYSQL", "GSAP", "FIREBASE"];

type Card = { id: number; symbol: string; matched: boolean };

function shuffledDeck(): Card[] {
  const deck = [...SYMBOLS, ...SYMBOLS].map((symbol, i) => ({ id: i, symbol, matched: false }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(() => shuffledDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [paused, setPaused] = useState(false);

  const gameOver = cards.every((c) => c.matched);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    setMoves((m) => m + 1);
    const cardA = cards.find((c) => c.id === a);
    const cardB = cards.find((c) => c.id === b);
    if (cardA && cardB && cardA.symbol === cardB.symbol) {
      setCards((prev) =>
        prev.map((c) => (c.id === a || c.id === b ? { ...c, matched: true } : c))
      );
      setFlipped([]);
    } else {
      const timer = setTimeout(() => setFlipped([]), 700);
      return () => clearTimeout(timer);
    }
  }, [flipped, cards]);

  function flip(id: number) {
    if (paused || gameOver) return;
    if (flipped.length === 2) return;
    if (flipped.includes(id)) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.matched) return;
    playClick();
    setFlipped((prev) => [...prev, id]);
  }

  function restart() {
    setCards(shuffledDeck());
    setFlipped([]);
    setMoves(0);
    setPaused(false);
  }

  return (
    <GameShell
      title="Memory"
      score={`MOVES: ${moves}`}
      paused={paused}
      onTogglePause={() => setPaused((p) => !p)}
      onRestart={restart}
      gameOver={gameOver}
      gameOverTitle="All Modules Matched"
      gameOverBody={`Completed in ${moves} moves`}
      controlsHint="Click two cards to flip them."
    >
      <div className="grid grid-cols-4 gap-2 bg-black p-3 rounded-sm border border-gunmetal w-[360px]">
        {cards.map((card) => {
          const isVisible = card.matched || flipped.includes(card.id);
          return (
            <button
              key={card.id}
              onClick={() => flip(card.id)}
              className={`h-[70px] rounded-sm border font-mono text-[10px] flex items-center justify-center text-center px-1 transition-colors ${
                card.matched
                  ? "border-blue text-blue bg-blue/10"
                  : isVisible
                  ? "border-amber text-amber bg-charcoal"
                  : "border-gunmetal text-transparent bg-graphite hover:border-titanium"
              }`}
              style={{ letterSpacing: "0.04em" }}
            >
              {isVisible ? card.symbol : "•"}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
