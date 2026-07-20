"use client";

import { useEffect, useState } from "react";

export default function DiagnosticsOverlay() {
  const [fps, setFps] = useState(0);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    function updateViewport() {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    }
    updateViewport();
    window.addEventListener("resize", updateViewport);

    let frames = 0;
    let last = performance.now();
    let raf: number;
    function loop(now: number) {
      frames += 1;
      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", updateViewport);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-6 z-[9400] bg-charcoal border border-blue rounded-sm px-4 py-3 font-mono text-[11px] text-blue"
      style={{ letterSpacing: "0.06em" }}
    >
      <div className="text-amber mb-1">{`// DIAGNOSTIC MODE`}</div>
      <div>FPS: {fps}</div>
      <div>
        VIEWPORT: {viewport.w}×{viewport.h}
      </div>
      <div>BUILD: irfan-os v1.0</div>
    </div>
  );
}
