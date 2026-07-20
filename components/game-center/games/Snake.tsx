"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GameShell from "../GameShell";
import { useGameLoop } from "@/hooks/useGameLoop";
import { playClick } from "@/hooks/useSound";

const GRID = 16;
const CELL = 20;
const SIZE = GRID * CELL;

type Point = { x: number; y: number };

function randomFood(snake: Point[]): Point {
  while (true) {
    const p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
}

export default function Snake() {
  const [snake, setSnake] = useState<Point[]>([{ x: 8, y: 8 }]);
  const [food, setFood] = useState<Point>(() => randomFood([{ x: 8, y: 8 }]));
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 });
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const dirRef = useRef(dir);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pendingDirRef = useRef<Point | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const map: Record<string, Point> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      };
      const next = map[e.key];
      if (!next) return;
      e.preventDefault();
      // Ignore a direct reversal into the snake's own neck.
      const current = dirRef.current;
      if (next.x === -current.x && next.y === -current.y) return;
      pendingDirRef.current = next;
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const tick = useCallback(() => {
    if (pendingDirRef.current) {
      dirRef.current = pendingDirRef.current;
      setDir(pendingDirRef.current);
      pendingDirRef.current = null;
    }
    setSnake((prev) => {
      const head = prev[0];
      const newHead = { x: head.x + dirRef.current.x, y: head.y + dirRef.current.y };

      const hitWall = newHead.x < 0 || newHead.y < 0 || newHead.x >= GRID || newHead.y >= GRID;
      const hitSelf = prev.some((s) => s.x === newHead.x && s.y === newHead.y);
      if (hitWall || hitSelf) {
        setGameOver(true);
        return prev;
      }

      const ateFood = newHead.x === food.x && newHead.y === food.y;
      const nextSnake = [newHead, ...prev];
      if (ateFood) {
        playClick();
        setFood(randomFood(nextSnake));
      } else {
        nextSnake.pop();
      }
      return nextSnake;
    });
  }, [food]);

  useGameLoop(tick, 120, !paused && !gameOver);

  // Draw every render (state changes each tick) rather than a separate loop.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, SIZE, SIZE);

    ctx.fillStyle = "#ffb020";
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);

    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#3f7fff" : "#5a5a5a";
      ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, [snake, food]);

  function restart() {
    const start = [{ x: 8, y: 8 }];
    setSnake(start);
    setFood(randomFood(start));
    dirRef.current = { x: 1, y: 0 };
    setDir({ x: 1, y: 0 });
    pendingDirRef.current = null;
    setGameOver(false);
    setPaused(false);
  }

  return (
    <GameShell
      title="Snake"
      score={`LENGTH: ${snake.length}`}
      paused={paused}
      onTogglePause={() => setPaused((p) => !p)}
      onRestart={restart}
      gameOver={gameOver}
      gameOverTitle="Session Ended"
      gameOverBody={`Final length: ${snake.length}`}
      controlsHint="Arrow keys or WASD to steer."
    >
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        className="border border-gunmetal rounded-sm"
      />
    </GameShell>
  );
}
