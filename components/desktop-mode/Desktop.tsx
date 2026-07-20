"use client";

import { useDesktopMode, type WindowKind } from "@/context/DesktopModeContext";
import DesktopIcon from "./DesktopIcon";

const ICONS: { kind: WindowKind; label: string; glyph: string }[] = [
  { kind: "projects", label: "Projects", glyph: "PR" },
  { kind: "resume", label: "Resume", glyph: "RÉ" },
  { kind: "terminal", label: "Terminal", glyph: ">_" },
  { kind: "github", label: "GitHub", glyph: "GH" },
  { kind: "linkedin", label: "LinkedIn", glyph: "IN" },
  { kind: "contact", label: "Contact", glyph: "@" },
  { kind: "diagnostics", label: "Diagnostics", glyph: "DX" },
];

export default function Desktop() {
  const { openWindow, toggleMode } = useDesktopMode();

  return (
    <div className="fixed inset-0 bg-black z-[7000]">
      <div className="grain" />
      <div className="scanline" />
      <button
        onClick={toggleMode}
        className="absolute top-6 right-8 font-mono text-[10px] uppercase border border-gunmetal rounded-full px-3.5 py-2 text-titanium hover:border-blue hover:text-offwhite transition-colors"
        style={{ letterSpacing: "0.1em" }}
      >
        Website Mode
      </button>
      <div className="absolute top-8 left-8 flex flex-col gap-6">
        {ICONS.map((icon) => (
          <DesktopIcon
            key={icon.kind}
            label={icon.label}
            glyph={icon.glyph}
            onOpen={() => openWindow(icon.kind)}
          />
        ))}
      </div>
      <div
        className="absolute bottom-8 left-8 font-mono text-[10px] text-titanium"
        style={{ letterSpacing: "0.1em" }}
      >
        DESKTOP MODE — double-click an icon to open it · toggle back from the top bar
      </div>
    </div>
  );
}
