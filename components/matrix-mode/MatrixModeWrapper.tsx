"use client";

import { useEffect } from "react";
import { useMatrixMode } from "@/context/MatrixModeContext";
import { playTypingTick } from "@/hooks/useSound";
import MatrixRain from "./MatrixRain";

export default function MatrixModeWrapper({ children }: { children: React.ReactNode }) {
  const { isActive } = useMatrixMode();

  useEffect(() => {
    if (!isActive) return;
    function handleKey() {
      playTypingTick();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isActive]);

  return (
    <>
      <div
        className="transition-[filter] duration-700 ease-in-out"
        style={{
          filter: isActive
            ? "grayscale(1) sepia(1) hue-rotate(78deg) saturate(3) brightness(0.9) contrast(1.15)"
            : "none",
        }}
      >
        {children}
      </div>
      {isActive && (
        <>
          <MatrixRain />
          {/* CRT vignette + scanline emphasis, purely decorative, above the rain */}
          <div
            className="fixed inset-0 z-[8100] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
              boxShadow: "inset 0 0 140px 40px rgba(0,0,0,0.6)",
            }}
          />
          <div className="fixed top-4 right-6 z-[8200] font-mono text-[10px] text-[#3fff6b] pointer-events-none" style={{ letterSpacing: "0.14em" }}>
            MATRIX MODE — type &quot;exit&quot; in the terminal to return
          </div>
        </>
      )}
    </>
  );
}
