"use client";

import { useEffect, useRef } from "react";

// Calls `onTick` roughly every `intervalMs`, only while `active` is true.
// Uses requestAnimationFrame under the hood (rather than setInterval) so it
// pauses cleanly with the tab and doesn't drift.
export function useGameLoop(onTick: () => void, intervalMs: number, active: boolean) {
  const callbackRef = useRef(onTick);
  callbackRef.current = onTick;

  useEffect(() => {
    if (!active) return;
    let raf: number;
    let last = performance.now();

    function loop(now: number) {
      if (now - last >= intervalMs) {
        last = now;
        callbackRef.current();
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [intervalMs, active]);
}
