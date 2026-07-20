"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { GITHUB_URL } from "@/lib/data";
import { showToast } from "./Toast";
import { playClick } from "@/hooks/useSound";
import { useAchievements } from "@/context/AchievementContext";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

// Place your real resume at /public/resume.pdf — this opens it in a new tab.
// If it isn't there yet, this shows a toast instead of a broken tab.
// onOpened lets callers (the button below, the terminal's `resume` command)
// report the achievement only when the file genuinely opened.
export async function downloadResume(onOpened?: () => void) {
  playClick();
  try {
    const res = await fetch("/resume.pdf", { method: "HEAD" });
    if (res.ok) {
      window.open("/resume.pdf", "_blank", "noopener,noreferrer");
      onOpened?.();
      return;
    }
  } catch {
    /* fall through to the toast below */
  }
  showToast("RESUME NOT FOUND — add resume.pdf to /public");
}

export default function Hero({ ready }: { ready: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { unlock } = useAchievements();

  useEffect(() => {
    if (!ready || !contentRef.current) return;
    gsap.to(contentRef.current.querySelectorAll(".reveal"), {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.12,
    });
  }, [ready]);

  // Subtle depth: hero copy drifts a few pixels against the cursor.
  useEffect(() => {
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;
    function handleMove(e: MouseEvent) {
      if (!contentRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      contentRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <header id="hero" className="section flex flex-col justify-center min-h-screen pt-0">
      <div
        className={`absolute inset-0 transition-opacity duration-[1600ms] ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        {ready && <HeroScene />}
      </div>

      <div
        ref={contentRef}
        className="relative z-[2] max-w-[760px] transition-transform duration-300 ease-out will-change-transform"
      >
        <div className="eyebrow reveal">Private R&D Terminal — Clearance Level 5</div>
        <h1 className="reveal font-display font-bold leading-[0.98] tracking-tight text-offwhite text-[clamp(40px,7.5vw,96px)]">
          MUHAMMED
          <br />
          IRFAN <span className="text-blue">K M</span>
        </h1>
        <div
          className="reveal font-mono text-titanium text-sm mt-5 flex gap-2.5 flex-wrap"
          style={{ letterSpacing: "0.08em" }}
        >
          <span>SOFTWARE ENGINEER</span>
          <span className="text-gunmetal">/</span>
          <span>AI &amp; ML</span>
          <span className="text-gunmetal">/</span>
          <span>BACKEND SYSTEMS</span>
        </div>
        <p className="reveal mt-6 text-[#a9a9a7] text-base leading-relaxed max-w-[520px]">
          Computer Science (AI &amp; ML) undergraduate building end-to-end
          applications across computer vision, full-stack web development,
          and secure backend systems — engineered with the same discipline as
          the systems this terminal is modeled after.
        </p>
        <div className="reveal mt-11 flex gap-4 flex-wrap">
          <button
            id="resume-btn"
            onClick={() => downloadResume(() => unlock("downloaded-resume"))}
            className="btn btn-primary"
          >
            View Resume
          </button>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Open GitHub
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-10 left-[8vw] font-mono text-[10px] text-titanium flex items-center gap-2.5"
        style={{ letterSpacing: "0.2em" }}
      >
        <span>SCROLL</span>
        <span className="w-px h-9 bg-gradient-to-b from-titanium to-transparent animate-pulse" />
      </div>
    </header>
  );
}
