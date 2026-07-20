"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/data";
import { useAchievements } from "@/context/AchievementContext";

// Minimal shape of the (non-standard) SpeechRecognition API — TS lib.dom
// doesn't ship types for it, so we declare just what we use.
interface SpeechRecognitionResultLike {
  results: { [index: number]: { [index: number]: { transcript: string } }; length: number };
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionResultLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

export function useVoiceConsole(onToast: (msg: string) => void) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const listeningRef = useRef(false);
  const { unlock } = useAchievements();

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Impl = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Impl) {
      setSupported(false);
      return;
    }
    setSupported(true);
    const recognition = new Impl();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (e) => {
      const said = e.results[e.results.length - 1][0].transcript.toLowerCase();
      handleVoiceCommand(said);
    };
    recognition.onend = () => {
      if (listeningRef.current) {
        try {
          recognition.start();
        } catch {
          /* already started */
        }
      }
    };
    recognition.onerror = () => {
      onToast("VOICE — mic access unavailable in this environment");
    };
    recognitionRef.current = recognition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleVoiceCommand(said: string) {
    unlock("used-voice-commands");
    const go = (id: string, spoken: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      speak(spoken);
    };
    if (said.includes("project")) go("projects", "Opening projects.");
    else if (said.includes("about")) go("about", "Opening about.");
    else if (said.includes("contact")) go("contact", "Opening the secure channel.");
    else if (said.includes("skill")) go("skills", "Opening skills.");
    else if (said.includes("education")) go("achievements", "Opening education.");
    else if (said.includes("achievement")) go("achievements", "Opening the record.");
    else if (said.includes("resume")) {
      document.getElementById("resume-btn")?.dispatchEvent(new MouseEvent("click"));
      speak("Opening resume.");
    } else if (said.includes("linkedin")) {
      window.open(LINKEDIN_URL, "_blank");
      speak("Opening LinkedIn.");
    } else if (said.includes("github")) {
      window.open(GITHUB_URL, "_blank");
      speak("Opening GitHub.");
    } else if (said.includes("top") || said.includes("home")) go("hero", "Back to overview.");
  }

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.05;
    utter.pitch = 0.9;
    utter.volume = 0.6;
    window.speechSynthesis.speak(utter);
  }

  const toggle = useCallback(() => {
    if (!supported || !recognitionRef.current) {
      onToast("VOICE CONSOLE — not supported in this browser");
      return;
    }
    const next = !listeningRef.current;
    listeningRef.current = next;
    setListening(next);
    try {
      next ? recognitionRef.current.start() : recognitionRef.current.stop();
    } catch {
      /* ignore */
    }
  }, [supported, onToast]);

  return { supported, listening, toggle };
}
