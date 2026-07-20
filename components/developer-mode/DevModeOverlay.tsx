"use client";

import { useEffect, useState } from "react";
import { useDevMode } from "@/context/DevModeContext";

const SECTIONS = ["hero", "about", "skills", "projects", "achievements", "contact"];

// performance.memory is Chrome-only and not in the standard lib.dom types.
interface PerformanceMemoryLike {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
}

export default function DevModeOverlay() {
  const { isOpen, wireframes, toggleWireframes, close } = useDevMode();
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState<PerformanceMemoryLike | null>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!isOpen) return;

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
        const perf = performance as unknown as { memory?: PerformanceMemoryLike };
        if (perf.memory) setMemory(perf.memory);
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", updateViewport);
      cancelAnimationFrame(raf);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-6 z-[9300] w-[280px] bg-[#020202] border border-blue rounded-sm overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-charcoal border-b border-gunmetal">
        <span className="font-mono text-[10px] text-blue uppercase" style={{ letterSpacing: "0.14em" }}>
          Developer Mode
        </span>
        <button onClick={close} className="font-mono text-[10px] text-titanium hover:text-offwhite">
          ✕
        </button>
      </div>

      <div className="p-4 font-mono text-[11px] text-[#c9c9c7] leading-relaxed space-y-3">
        <div>
          <div className="text-titanium text-[9px] uppercase mb-1" style={{ letterSpacing: "0.12em" }}>
            Performance
          </div>
          <div>FPS: <span className="text-amber">{fps}</span></div>
          {memory && (
            <div>
              Heap: <span className="text-amber">
                {(memory.usedJSHeapSize / 1048576).toFixed(1)} / {(memory.totalJSHeapSize / 1048576).toFixed(1)} MB
              </span>
            </div>
          )}
          <div>Viewport: <span className="text-amber">{viewport.w}×{viewport.h}</span></div>
          <div>DPR: <span className="text-amber">{typeof window !== "undefined" ? window.devicePixelRatio : 1}</span></div>
        </div>

        <div>
          <div className="text-titanium text-[9px] uppercase mb-1" style={{ letterSpacing: "0.12em" }}>
            Scene Hierarchy
          </div>
          {SECTIONS.map((id) => (
            <div key={id} className="text-titanium">
              └ <span className="text-[#c9c9c7]">#{id}</span>
            </div>
          ))}
        </div>

        <div>
          <div className="text-titanium text-[9px] uppercase mb-1" style={{ letterSpacing: "0.12em" }}>
            Rendering
          </div>
          <button
            onClick={toggleWireframes}
            className={`w-full text-left border rounded-sm px-2.5 py-1.5 transition-colors ${
              wireframes ? "border-blue text-blue" : "border-gunmetal text-titanium hover:text-offwhite"
            }`}
          >
            wireframes: {wireframes ? "on" : "off"}
          </button>
        </div>
      </div>
    </div>
  );
}
