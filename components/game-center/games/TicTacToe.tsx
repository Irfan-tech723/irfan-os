"use client";

import { useState } from "react";
import GameShell from "../GameShell";
import { playClick } from "@/hooks/useSound";

type Cell = "X" | "O" | null;
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winner(board: Cell[]): Cell {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function isFull(board: Cell[]) {
  return board.every((c) => c !== null);
}

// Minimax is cheap enough at 3x3 to just solve it outright — the AI never loses.
function minimax(board: Cell[], player: "X" | "O"): { score: number; move?: number } {
  const win = winner(board);
  if (win === "O") return { score: 1 };
  if (win === "X") return { score: -1 };
  if (isFull(board)) return { score: 0 };

  const moves: { score: number; move: number }[] = [];
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    const next = [...board];
    next[i] = player;
    const result = minimax(next, player === "O" ? "X" : "O");
    moves.push({ score: result.score, move: i });
  }

  if (player === "O") {
    return moves.reduce((best, m) => (m.score > best.score ? m : best));
  }
  return moves.reduce((best, m) => (m.score < best.score ? m : best));
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [paused, setPaused] = useState(false);
  const [thinking, setThinking] = useState(false);

  const win = winner(board);
  const draw = !win && isFull(board);
  const gameOver = !!win || draw;

  function playerMove(i: number) {
    if (board[i] || gameOver || paused || thinking) return;
    playClick();
    const afterPlayer = [...board];
    afterPlayer[i] = "X";
    setBoard(afterPlayer);

    if (winner(afterPlayer) || isFull(afterPlayer)) return;

    setThinking(true);
    setTimeout(() => {
      const { move } = minimax(afterPlayer, "O");
      if (move !== undefined) {
        const afterAI = [...afterPlayer];
        afterAI[move] = "O";
        setBoard(afterAI);
      }
      setThinking(false);
    }, 350);
  }

  function restart() {
    setBoard(Array(9).fill(null));
    setThinking(false);
    setPaused(false);
  }

  return (
    <GameShell
      title="Tic-Tac-Toe"
      score={`YOU: X  ·  SYSTEM: O`}
      paused={paused}
      onTogglePause={() => setPaused((p) => !p)}
      onRestart={restart}
      gameOver={gameOver}
      gameOverTitle={win === "X" ? "You win" : win === "O" ? "System wins" : "Draw"}
      gameOverBody={win === "X" ? "Unusual. Well played." : win === "O" ? "As expected." : "Nobody blinked."}
      controlsHint="Click a cell. You are X."
    >
      <div className="grid grid-cols-3 gap-2 bg-black p-3 rounded-sm border border-gunmetal">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => playerMove(i)}
            disabled={!!cell || gameOver || paused}
            className="w-20 h-20 flex items-center justify-center bg-charcoal border border-gunmetal rounded-sm font-display text-3xl font-semibold transition-colors hover:border-blue disabled:hover:border-gunmetal"
          >
            {cell === "X" && <span className="text-blue">X</span>}
            {cell === "O" && <span className="text-amber">O</span>}
          </button>
        ))}
      </div>
    </GameShell>
  );
}
