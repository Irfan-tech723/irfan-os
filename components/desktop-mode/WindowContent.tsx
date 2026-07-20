"use client";

import type { WindowKind } from "@/context/DesktopModeContext";
import { projects, GITHUB_URL, LINKEDIN_URL } from "@/lib/data";
import { downloadResume } from "@/components/Hero";
import { useAchievements } from "@/context/AchievementContext";
import { useDevMode } from "@/context/DevModeContext";
import Terminal from "@/components/Terminal";

export default function WindowContent({ kind }: { kind: WindowKind }) {
  const { unlock } = useAchievements();
  const { toggleOpen } = useDevMode();

  if (kind === "projects") {
    return (
      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.index} className="border border-gunmetal rounded-sm p-3">
            <div className="font-display text-[13px] font-semibold text-offwhite">{p.title}</div>
            <div className="font-mono text-[10.5px] text-titanium mt-1">{p.stack.join(" · ")}</div>
          </div>
        ))}
      </div>
    );
  }

  if (kind === "resume") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <div className="font-mono text-[12px] text-titanium">resume.pdf</div>
        <button
          onClick={() => downloadResume(() => unlock("downloaded-resume"))}
          className="btn btn-primary"
        >
          Open Resume
        </button>
      </div>
    );
  }

  if (kind === "terminal") {
    return (
      <Terminal
        title="irfan@terminal — window"
        initialLine='<span class="text-titanium">// type "help" to begin</span>'
        placeholder="type a command..."
      />
    );
  }

  if (kind === "github") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <div className="font-mono text-[12px] text-titanium">{GITHUB_URL.replace("https://", "")}</div>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          Open GitHub ↗
        </a>
      </div>
    );
  }

  if (kind === "linkedin") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <div className="font-mono text-[11px] text-titanium break-all px-2">
          {LINKEDIN_URL.replace("https://", "")}
        </div>
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          Open LinkedIn ↗
        </a>
      </div>
    );
  }

  if (kind === "contact") {
    return (
      <div className="space-y-2 font-mono text-[12px] text-[#c9c9c7]">
        <div><span className="text-amber">EMAIL</span> &nbsp;irfanmmk317@gmail.com</div>
        <div><span className="text-amber">PHONE</span> &nbsp;+91 8714334899</div>
        <div><span className="text-amber">GITHUB</span> &nbsp;github.com/Irfan-tech723</div>
        <div><span className="text-amber">LINKEDIN</span> &nbsp;linkedin.com/in/muhammed-irfan-k-m-16513a293</div>
      </div>
    );
  }

  if (kind === "diagnostics") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <div className="font-mono text-[11px] text-titanium leading-relaxed">
          Full FPS / memory / scene-hierarchy readout lives in Developer Mode.
        </div>
        <button onClick={toggleOpen} className="btn btn-ghost">
          Open Developer Console
        </button>
      </div>
    );
  }

  return null;
}
