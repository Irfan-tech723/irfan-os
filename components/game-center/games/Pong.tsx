"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GameShell from "../GameShell";
import { useGameLoop } from "@/hooks/useGameLoop";
import { playClick } from "@/hooks/useSound";

const WIDTH = 380;
const HEIGHT = 240;
const PADDLE_H = 50;
const PADDLE_W = 8;
const BALL_SIZE = 8;
const WIN_SCORE = 5;

export default function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState({ player: 0, ai: 0 });

  const playerY = useRef(HEIGHT / 2 - PADDLE_H / 2);
  const aiY = useRef(HEIGHT / 2 - PADDLE_H / 2);
  const ball = useRef({ x: WIDTH / 2, y: HEIGHT / 2, vx: 2.6, vy: 2 });
  const keys = useRef({ up: false, down: false });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.current.up = true;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.current.down = true;
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.current.up = false;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.current.down = false;
    }
    function handleMouse(e: MouseEvent) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const y = e.clientY - rect.top;
      playerY.current = Math.min(Math.max(y - PADDLE_H / 2, 0), HEIGHT - PADDLE_H);
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  const resetBall = useCallback((direction: number) => {
    ball.current = { x: WIDTH / 2, y: HEIGHT / 2, vx: 2.6 * direction, vy: (Math.random() - 0.5) * 3 };
  }, []);

  const tick = useCallback(() => {
    if (keys.current.up) playerY.current = Math.max(playerY.current - 4, 0);
    if (keys.current.down) playerY.current = Math.min(playerY.current + 4, HEIGHT - PADDLE_H);

    // AI tracks the ball with a deliberate lag so it's beatable.
    const aiCenter = aiY.current + PADDLE_H / 2;
    if (aiCenter < ball.current.y - 10) aiY.current += 2.6;
    else if (aiCenter > ball.current.y + 10) aiY.current -= 2.6;
    aiY.current = Math.min(Math.max(aiY.current, 0), HEIGHT - PADDLE_H);

    const b = ball.current;
    b.x += b.vx;
    b.y += b.vy;

    if (b.y <= 0 || b.y >= HEIGHT - BALL_SIZE) b.vy *= -1;

    // Player paddle (left)
    if (
      b.x <= PADDLE_W &&
      b.y + BALL_SIZE >= playerY.current &&
      b.y <= playerY.current + PADDLE_H
    ) {
      b.vx = Math.abs(b.vx) * 1.03;
      playClick();
    }
    // AI paddle (right)
    if (
      b.x >= WIDTH - PADDLE_W - BALL_SIZE &&
      b.y + BALL_SIZE >= aiY.current &&
      b.y <= aiY.current + PADDLE_H
    ) {
      b.vx = -Math.abs(b.vx) * 1.03;
    }

    if (b.x < 0) {
      setScore((s) => {
        const next = { ...s, ai: s.ai + 1 };
        if (next.ai >= WIN_SCORE) setGameOver(true);
        return next;
      });
      resetBall(1);
    } else if (b.x > WIDTH) {
      setScore((s) => {
        const next = { ...s, player: s.player + 1 };
        if (next.player >= WIN_SCORE) setGameOver(true);
        return next;
      });
      resetBall(-1);
    }

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.strokeStyle = "#242424";
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(WIDTH / 2, 0);
      ctx.lineTo(WIDTH / 2, HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#3f7fff";
      ctx.fillRect(0, playerY.current, PADDLE_W, PADDLE_H);
      ctx.fillStyle = "#ffb020";
      ctx.fillRect(WIDTH - PADDLE_W, aiY.current, PADDLE_W, PADDLE_H);
      ctx.fillStyle = "#eef0ef";
      ctx.fillRect(b.x, b.y, BALL_SIZE, BALL_SIZE);
    }
  }, [resetBall]);

  useGameLoop(tick, 16, !paused && !gameOver);

  function restart() {
    playerY.current = HEIGHT / 2 - PADDLE_H / 2;
    aiY.current = HEIGHT / 2 - PADDLE_H / 2;
    resetBall(Math.random() > 0.5 ? 1 : -1);
    setScore({ player: 0, ai: 0 });
    setGameOver(false);
    setPaused(false);
  }

  return (
    <GameShell
      title="Pong"
      score={`YOU ${score.player} — ${score.ai} SYSTEM`}
      paused={paused}
      onTogglePause={() => setPaused((p) => !p)}
      onRestart={restart}
      gameOver={gameOver}
      gameOverTitle={score.player > score.ai ? "You win" : "System wins"}
      gameOverBody={`${score.player} — ${score.ai}`}
      controlsHint="Mouse, arrow keys, or W/S to move your paddle."
    >
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className="border border-gunmetal rounded-sm"
      />
    </GameShell>
  );
}
