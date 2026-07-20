"use client";

import dynamic from "next/dynamic";
import RevealSection from "./RevealSection";
import { timeline } from "@/lib/data";

const InteractiveGlobe = dynamic(() => import("./globe/InteractiveGlobe"), { ssr: false });

export default function About() {
  return (
    <RevealSection id="about" className="section">
      <div className="eyebrow reveal">Dossier 01</div>
      <h2 className="section-title reveal">About</h2>
      <p className="section-sub reveal">
        A brief record of how the workspace came to be.
      </p>
      <div className="reveal grid md:grid-cols-[1fr_320px] gap-14 items-start">
        <div className="border-l border-gunmetal pl-9 flex flex-col gap-11">
          {timeline.map((item) => (
            <div key={item.title} className="relative">
              <div className="absolute -left-[43px] top-1 w-2.5 h-2.5 rounded-full bg-black border-2 border-blue" />
              <div
                className="font-mono text-amber text-xs mb-1.5"
                style={{ letterSpacing: "0.1em" }}
              >
                {item.year}
              </div>
              <div className="font-display text-xl font-semibold text-offwhite mb-1.5">
                {item.title}
              </div>
              <div className="text-titanium text-sm leading-relaxed max-w-[520px]">
                {item.body}
              </div>
            </div>
          ))}
        </div>
        <InteractiveGlobe />
      </div>
    </RevealSection>
  );
}
