"use client";

export default function GameShell({
  title,
  score,
  paused,
  onTogglePause,
  onRestart,
  gameOver,
  gameOverTitle,
  gameOverBody,
  controlsHint,
  children,
}: {
  title: string;
  score?: React.ReactNode;
  paused?: boolean;
  onTogglePause?: () => void;
  onRestart: () => void;
  gameOver: boolean;
  gameOverTitle?: string;
  gameOverBody?: React.ReactNode;
  controlsHint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex items-center justify-between w-full max-w-[420px]">
        <div>
          <div className="font-display text-[15px] font-semibold text-offwhite">{title}</div>
          {score !== undefined && (
            <div className="font-mono text-[11px] text-amber mt-0.5">{score}</div>
          )}
        </div>
        <div className="flex gap-2">
          {onTogglePause && (
            <button
              onClick={onTogglePause}
              className="font-mono text-[10px] uppercase border border-gunmetal rounded-sm px-3 py-1.5 text-titanium hover:border-blue hover:text-offwhite transition-colors"
              style={{ letterSpacing: "0.08em" }}
            >
              {paused ? "Resume" : "Pause"}
            </button>
          )}
          <button
            onClick={onRestart}
            className="font-mono text-[10px] uppercase border border-gunmetal rounded-sm px-3 py-1.5 text-titanium hover:border-blue hover:text-offwhite transition-colors"
            style={{ letterSpacing: "0.08em" }}
          >
            Restart
          </button>
        </div>
      </div>

      <div className="relative">
        {children}

        {(gameOver || paused) && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-center px-6">
            {paused && !gameOver && (
              <div className="font-mono text-[12px] text-titanium uppercase" style={{ letterSpacing: "0.16em" }}>
                Paused
              </div>
            )}
            {gameOver && (
              <>
                <div className="font-mono text-[10px] text-amber uppercase" style={{ letterSpacing: "0.16em" }}>
                  {gameOverTitle ?? "Session Ended"}
                </div>
                {gameOverBody && (
                  <div className="font-display text-lg font-semibold text-offwhite">
                    {gameOverBody}
                  </div>
                )}
                <button
                  onClick={onRestart}
                  className="mt-1 font-mono text-[11px] uppercase border border-blue text-blue rounded-sm px-4 py-2 hover:bg-blue hover:text-white transition-colors"
                  style={{ letterSpacing: "0.1em" }}
                >
                  Play Again
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="font-mono text-[10.5px] text-titanium">{controlsHint}</div>
    </div>
  );
}
