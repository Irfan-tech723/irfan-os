"use client";

import { useRef, useState, useEffect } from "react";
import { useIrfanAI } from "@/context/IrfanAIContext";
import { getAIResponse } from "@/lib/ai-responses";
import { downloadResume } from "@/components/Hero";
import { useAchievements } from "@/context/AchievementContext";
import { GITHUB_URL } from "@/lib/data";
import { playClick } from "@/hooks/useSound";

type Message = { role: "user" | "ai"; text: string };

const SUGGESTIONS = [
  "Tell me about Expense Splitter",
  "What technologies do you know?",
  "Which project is your favorite?",
  "Show backend experience",
  "Download resume",
  "Contact Irfan",
];

export default function IrfanAI() {
  const { isOpen, close } = useIrfanAI();
  const { unlock } = useAchievements();
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "IRFAN AI online. Ask about a project, the tech stack, or how to get in touch — I only know what's in this portfolio." },
  ]);
  const [value, setValue] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  function ask(question: string) {
    if (!question.trim()) return;
    playClick();
    const response = getAIResponse(question);
    setMessages((prev) => [...prev, { role: "user", text: question }, { role: "ai", text: response.text }]);
    setValue("");

    if (response.action === "resume") downloadResume(() => unlock("downloaded-resume"));
    if (response.action === "contact") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
    if (response.action === "projects") {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    }
    if (response.action === "github") window.open(GITHUB_URL, "_blank");
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9100] flex items-center justify-center p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="w-full max-w-[480px] bg-[#020202] border border-blue rounded-md overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between px-4 py-3 bg-charcoal border-b border-gunmetal">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
            <span className="font-mono text-[11px] text-blue uppercase" style={{ letterSpacing: "0.14em" }}>
              IRFAN AI
            </span>
          </div>
          <button onClick={close} className="font-mono text-[10px] text-titanium hover:text-offwhite">
            ✕ Close
          </button>
        </div>

        <div ref={logRef} className="px-5 py-4 max-h-[320px] overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`font-mono text-[12.5px] leading-relaxed max-w-[85%] px-3.5 py-2.5 rounded-sm ${
                m.role === "ai"
                  ? "bg-charcoal border border-gunmetal text-[#c9c9c7]"
                  : "bg-blue/10 border border-blue text-offwhite ml-auto"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="font-mono text-[10px] border border-gunmetal rounded-full px-2.5 py-1 text-titanium hover:border-blue hover:text-offwhite transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 px-5 pb-5 pt-1 font-mono text-[13px] border-t border-gunmetal">
          <span className="text-blue">&gt;</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") ask(value);
            }}
            autoComplete="off"
            spellCheck={false}
            placeholder="Ask about a project, skill, or how to reach him..."
            className="flex-1 bg-transparent border-none outline-none text-offwhite font-mono text-[13px] placeholder:text-titanium/60 py-2.5"
          />
        </div>
      </div>
    </div>
  );
}
