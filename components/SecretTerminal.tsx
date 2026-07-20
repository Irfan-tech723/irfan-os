"use client";

import { useEffect, useState } from "react";
import Terminal from "./Terminal";
import { useKonami } from "@/hooks/useKonami";
import { showToast } from "./Toast";
import { useAchievements } from "@/context/AchievementContext";

export default function SecretTerminal() {
  const [open, setOpen] = useState(false);
  const { unlock } = useAchievements();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "`") {
        e.preventDefault();
        setOpen((prev) => {
          const next = !prev;
          if (next) unlock("opened-secret-terminal");
          return next;
        });
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [unlock]);

  useKonami(() => {
    showToast("Welcome, operative.");
    document.body.style.transition = "filter .15s ease";
    document.body.style.filter = "invert(1)";
    setTimeout(() => {
      document.body.style.filter = "none";
    }, 150);
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9000] flex items-center justify-center p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="w-full max-w-[640px]">
        <Terminal
          title="root@classified — press ESC to close"
          initialLine='<span class="text-titanium">// classified channel — type "help"</span>'
          placeholder="whoami"
        />
      </div>
    </div>
  );
}
