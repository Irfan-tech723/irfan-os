"use client";

import { useState } from "react";
import type { DemoStepKind } from "@/lib/project-demos";
import { playClick } from "@/hooks/useSound";

export default function DemoStepView({
  kind,
  onAdvance,
}: {
  kind: DemoStepKind;
  onAdvance: () => void;
}) {
  const [processing, setProcessing] = useState(false);

  function go() {
    playClick();
    onAdvance();
  }

  if (kind === "login") {
    return (
      <div className="flex flex-col gap-3 w-full max-w-[280px] mx-auto">
        <input
          placeholder="email"
          disabled
          className="bg-charcoal border border-gunmetal rounded-sm px-3 py-2 font-mono text-[12px] text-titanium"
        />
        <input
          placeholder="password"
          disabled
          className="bg-charcoal border border-gunmetal rounded-sm px-3 py-2 font-mono text-[12px] text-titanium"
        />
        <button onClick={go} className="btn btn-primary justify-center mt-2">
          Sign In
        </button>
        <div className="font-mono text-[10px] text-titanium text-center">
          JWT-authenticated in the real app — this step is a mock.
        </div>
      </div>
    );
  }

  if (kind === "dashboard") {
    return (
      <div className="w-full max-w-[340px] mx-auto space-y-2">
        {[
          { name: "Goa Trip", you: "+₹1,240", them: "Alex, Priya, Sam" },
          { name: "Flat Rent — July", you: "−₹640", them: "Roommates" },
        ].map((g) => (
          <div key={g.name} className="card !p-4 flex justify-between items-center">
            <div>
              <div className="font-display text-[13px] font-semibold">{g.name}</div>
              <div className="font-mono text-[10px] text-titanium">{g.them}</div>
            </div>
            <div className={`font-mono text-[12px] ${g.you.startsWith("+") ? "text-blue" : "text-amber"}`}>
              {g.you}
            </div>
          </div>
        ))}
        <button onClick={go} className="btn btn-ghost w-full justify-center mt-2">
          Add Expense →
        </button>
      </div>
    );
  }

  if (kind === "expense") {
    return (
      <div className="flex flex-col gap-3 w-full max-w-[280px] mx-auto">
        <input placeholder="What was it for?" disabled className="bg-charcoal border border-gunmetal rounded-sm px-3 py-2 font-mono text-[12px] text-titanium" />
        <input placeholder="Amount (₹)" disabled className="bg-charcoal border border-gunmetal rounded-sm px-3 py-2 font-mono text-[12px] text-titanium" />
        <div className="font-mono text-[10px] text-titanium">Split equally with: Alex, Priya, Sam</div>
        <button onClick={go} className="btn btn-primary justify-center mt-2">
          Save &amp; Settle
        </button>
      </div>
    );
  }

  if (kind === "upload") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-[220px] h-[140px] border-2 border-dashed border-gunmetal rounded-sm flex items-center justify-center font-mono text-[11px] text-titanium">
          drop microscopy image
        </div>
        <button
          onClick={() => {
            playClick();
            setProcessing(true);
            setTimeout(() => onAdvance(), 1000);
          }}
          className="btn btn-primary"
          disabled={processing}
        >
          {processing ? "Running YOLOv8..." : "Upload & Analyze"}
        </button>
      </div>
    );
  }

  if (kind === "prediction") {
    return (
      <div className="w-full max-w-[300px] mx-auto space-y-3">
        <div className="w-full h-[140px] bg-charcoal border border-gunmetal rounded-sm flex items-center justify-center font-mono text-[10px] text-titanium">
          [ annotated detections ]
        </div>
        <div className="card !p-4">
          <div className="font-mono text-[11px] text-titanium">DETECTIONS: <span className="text-amber">7 particles</span></div>
          <div className="font-mono text-[11px] text-titanium">SAFETY SCORE (WHO/EFSA ref): <span className="text-amber">Moderate</span></div>
        </div>
      </div>
    );
  }

  if (kind === "qr") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-[140px] h-[140px] bg-charcoal border border-gunmetal rounded-sm flex items-center justify-center font-mono text-[28px] text-titanium">
          ▦
        </div>
        <button onClick={go} className="btn btn-primary">
          Scan
        </button>
      </div>
    );
  }

  if (kind === "record") {
    return (
      <div className="w-full max-w-[300px] mx-auto space-y-2 font-mono text-[12px] text-[#c9c9c7]">
        <div><span className="text-amber">BLOOD TYPE</span> &nbsp;O+</div>
        <div><span className="text-amber">ALLERGIES</span> &nbsp;Penicillin</div>
        <div><span className="text-amber">EMERGENCY CONTACT</span> &nbsp;On file</div>
        <div className="font-mono text-[10px] text-titanium mt-2">Synced from Firebase in the real app.</div>
      </div>
    );
  }

  if (kind === "workspace") {
    return (
      <div className="w-full max-w-[300px] mx-auto text-center space-y-3">
        <div className="font-mono text-[11px] text-titanium leading-relaxed">
          You&apos;re looking at it — this portfolio is the fourth project.
        </div>
        <div className="font-mono text-[10px] text-blue">Next.js · R3F · GSAP · Tailwind</div>
      </div>
    );
  }

  return null;
}
