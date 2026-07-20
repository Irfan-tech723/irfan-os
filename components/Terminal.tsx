"use client";

import { useRef, useState } from "react";
import { runCommand } from "@/lib/commands";
import { downloadResume } from "./Hero";
import { showToast } from "./Toast";
import { playClick } from "@/hooks/useSound";
import { useAchievements } from "@/context/AchievementContext";
import { useGameCenter } from "@/context/GameCenterContext";
import { useMatrixMode } from "@/context/MatrixModeContext";

type LogEntry = { html: string; isCommand?: boolean };

export default function Terminal({
  title,
  initialLine,
  placeholder,
}: {
  title: string;
  initialLine: string;
  placeholder: string;
}) {
  const [log, setLog] = useState<LogEntry[]>([{ html: initialLine }]);
  const [value, setValue] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const { unlock } = useAchievements();
  const { openLauncher, openGame } = useGameCenter();
  const { activate: activateMatrix, deactivate: deactivateMatrix } = useMatrixMode();

  function submit() {
    const cmd = value.trim();
    if (cmd === "") return;
    playClick();
    const result = runCommand(cmd);
    setLog((prev) => {
      const next: LogEntry[] = [...prev, { html: cmd, isCommand: true }];
      if (result) {
        if (result.clear) return [];
        next.push({ html: result.html });
      }
      return next;
    });
    if (result?.triggerResumeDownload) downloadResume(() => unlock("downloaded-resume"));
    if (result?.toast) showToast(result.toast);
    if (result?.scrollTo)
      document.getElementById(result.scrollTo)?.scrollIntoView({ behavior: "smooth" });
    if (result?.openUrl) window.open(result.openUrl, "_blank", "noopener,noreferrer");
    if (result?.openGame) {
      result.openGame === "launcher" ? openLauncher() : openGame(result.openGame);
    }
    if (result?.matrixMode) {
      result.matrixMode === "on" ? activateMatrix() : deactivateMatrix();
    }
    setValue("");
    requestAnimationFrame(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    });
  }

  return (
    <div className="bg-[#020202] border border-gunmetal rounded-md overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2 px-4 py-3 bg-charcoal border-b border-gunmetal">
        <span className="w-2.5 h-2.5 rounded-full bg-[#4a2020]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#4a3d1a]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#1a3a22]" />
        <span className="ml-3 font-mono text-[11px] text-titanium">{title}</span>
      </div>
      <div
        ref={logRef}
        className="px-6 py-5 font-mono text-[13px] leading-[1.85] min-h-[220px] max-h-[340px] overflow-y-auto text-[#c9c9c7]"
      >
        {log.map((entry, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap ${entry.isCommand ? "" : "mb-3.5"}`}
            dangerouslySetInnerHTML={{
              __html: entry.isCommand
                ? `<span class="text-blue">&gt;</span> ${escapeForDisplay(entry.html)}`
                : entry.html,
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2.5 px-6 pb-5 font-mono text-[13px]">
        <span className="text-blue">&gt;</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-offwhite font-mono text-[13px] placeholder:text-titanium/60"
        />
      </div>
    </div>
  );
}

function escapeForDisplay(s: string) {
  return s.replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return map[c];
  });
}
