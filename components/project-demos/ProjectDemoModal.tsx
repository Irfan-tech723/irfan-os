"use client";

import { useState } from "react";
import { PROJECT_DEMOS } from "@/lib/project-demos";
import DemoStepView from "./DemoStepView";

export default function ProjectDemoModal({
  projectIndex,
  title,
  onClose,
}: {
  projectIndex: string;
  title: string;
  onClose: () => void;
}) {
  const steps = PROJECT_DEMOS[projectIndex] || [];
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9050] flex items-center justify-center p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[440px] bg-[#020202] border border-gunmetal rounded-md overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between px-4 py-3 bg-charcoal border-b border-gunmetal">
          <span className="font-mono text-[11px] text-titanium">{title} — demo</span>
          <button onClick={onClose} className="font-mono text-[10px] text-titanium hover:text-offwhite">
            ✕ Close
          </button>
        </div>

        <div className="p-7 min-h-[260px] flex items-center justify-center">
          {step && <DemoStepView kind={step.kind} onAdvance={() => !isLast && setStepIndex((i) => i + 1)} />}
        </div>

        <div className="flex items-center justify-between px-6 pb-5">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i === stepIndex ? "bg-blue" : "bg-gunmetal"}`}
              />
            ))}
          </div>
          <div className="font-mono text-[10px] text-titanium">
            {step?.title} ({stepIndex + 1}/{steps.length})
          </div>
        </div>
      </div>
    </div>
  );
}
