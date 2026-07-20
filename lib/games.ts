export type GameId = "tictactoe" | "snake" | "pong" | "memory";

export type GameDef = {
  id: GameId;
  title: string;
  tagline: string;
  controls: string;
};

export const GAMES: Record<GameId, GameDef> = {
  tictactoe: {
    id: "tictactoe",
    title: "Tic-Tac-Toe",
    tagline: "You vs. the system. It doesn't lose on purpose.",
    controls: "Click a cell.",
  },
  snake: {
    id: "snake",
    title: "Snake",
    tagline: "Grow without hitting the walls or yourself.",
    controls: "Arrow keys or WASD.",
  },
  pong: {
    id: "pong",
    title: "Pong",
    tagline: "First to 5 against the house AI.",
    controls: "Arrow keys / W & S, or move your mouse.",
  },
  memory: {
    id: "memory",
    title: "Memory",
    tagline: "Match every module. Fewer moves, better score.",
    controls: "Click two cards to flip them.",
  },
};

export const GAME_LIST = Object.values(GAMES);

// Maps loose terminal input ("play snake", "snake", "tic tac toe", ...) to a
// registered GameId, or null if it doesn't match anything we know.
export function resolveGameSlug(input: string): GameId | null {
  const s = input.trim().toLowerCase();
  if (s === "tictactoe" || s === "tic tac toe" || s === "tic-tac-toe") return "tictactoe";
  if (s === "snake") return "snake";
  if (s === "pong") return "pong";
  if (s === "memory" || s === "memory game") return "memory";
  return null;
}
