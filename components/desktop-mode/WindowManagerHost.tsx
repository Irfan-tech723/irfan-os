"use client";

import { useDesktopMode } from "@/context/DesktopModeContext";
import Desktop from "./Desktop";
import Window from "./Window";

export default function WindowManagerHost() {
  const { isDesktop, windows, toggleMinimize } = useDesktopMode();

  if (!isDesktop) return null;

  const minimized = windows.filter((w) => w.minimized);

  return (
    <>
      <Desktop />
      {windows.map((w) => (
        <Window key={w.id} win={w} />
      ))}
      {minimized.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[7500] flex gap-2 px-8 py-3 bg-charcoal/90 backdrop-blur-sm border-t border-gunmetal">
          {minimized.map((w) => (
            <button
              key={w.id}
              onClick={() => toggleMinimize(w.id)}
              className="font-mono text-[10px] text-titanium hover:text-offwhite border border-gunmetal rounded-sm px-3 py-1.5"
            >
              {w.title}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
