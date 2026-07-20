"use client";

import { useEffect, useState } from "react";
import { playBootChime } from "@/hooks/useSound";

const BOOT_LINES = [
  "> AUTHENTICATING...",
  "> ACCESS LEVEL VERIFIED",
  "> INITIALIZING AI CORE",
  "> LOADING PROJECT DATABASE",
  "> MOUNTING FILE SYSTEM",
  "> CONNECTING MODULES",
  "> SYSTEM READY",
  "",
  "WELCOME MUHAMMED IRFAN",
];

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let cancelled = false;

    function tick() {
      if (cancelled) return;
      if (lineIndex >= BOOT_LINES.length) {
        // A brief monitor-flicker beat before the reveal — sells the
        // "screen powering on" feeling without being a cheesy glitch effect.
        setFlicker(true);
        playBootChime();
        setTimeout(() => {
          if (cancelled) return;
          setFlicker(false);
          setHiding(true);
          setTimeout(() => {
            if (cancelled) return;
            setGone(true);
            onDone();
          }, 900);
        }, 220);
        return;
      }
      const line = BOOT_LINES[lineIndex];
      charIndex += 1;
      setDisplayed((prev) => {
        const done = BOOT_LINES.slice(0, lineIndex);
        return [...done, line.slice(0, charIndex)];
      });
      if (charIndex <= line.length) {
        setTimeout(tick, line === "" ? 40 : 18);
      } else {
        lineIndex += 1;
        charIndex = 0;
        setTimeout(tick, 160);
      }
    }

    const start = setTimeout(tick, 400);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div
      className="fixed inset-0 bg-black z-[10000] flex items-center justify-center transition-opacity duration-1000"
      style={{ opacity: hiding ? 0 : flicker ? 0.4 : 1 }}
    >
      <div className="font-mono text-blue text-sm leading-8 w-[90%] max-w-[560px] whitespace-pre-wrap">
        {displayed.map((line, i) => (
          <div key={i} className={line === "WELCOME MUHAMMED IRFAN" ? "text-amber" : ""}>
            {line}
          </div>
        ))}
        <span className="inline-block w-2 h-3.5 bg-blue align-middle animate-pulse" />
      </div>
    </div>
  );
}
