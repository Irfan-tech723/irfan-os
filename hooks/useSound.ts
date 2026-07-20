"use client";

import { useCallback, useEffect, useState } from "react";

// All sounds here are synthesized with oscillators rather than shipped as
// audio files — there's no asset to swap in, and it keeps the bundle at
// zero extra bytes. Browsers block audio before a user gesture, so the very
// first attempt (e.g. the boot chime) may silently no-op until the visitor
// clicks or types something — that's expected, not a bug.

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function isMuted(): boolean {
  if (typeof window === "undefined") return true;
  // Default is muted — only an explicit "0" turns sound on.
  return window.localStorage.getItem("irfan-os-sound-muted") !== "0";
}

function tone(freq: number, durationMs: number, gain = 0.05, type: OscillatorType = "sine") {
  if (isMuted()) return;
  const audio = getContext();
  if (!audio) return;
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = 0;
  osc.connect(g);
  g.connect(audio.destination);
  const now = audio.currentTime;
  g.gain.linearRampToValueAtTime(gain, now + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
  osc.start(now);
  osc.stop(now + durationMs / 1000 + 0.02);
}

export function playClick() {
  tone(720, 45, 0.04, "square");
}

export function playToggle() {
  tone(420, 70, 0.04, "sine");
}

export function playTypingTick() {
  tone(900 + Math.random() * 200, 18, 0.02, "square");
}

export function playBootChime() {
  tone(220, 90, 0.05, "sine");
  setTimeout(() => tone(330, 90, 0.05, "sine"), 100);
  setTimeout(() => tone(440, 140, 0.05, "sine"), 200);
}

export function useSound() {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    setMuted(isMuted());
  }, []);

  const toggle = useCallback(() => {
    const wasMuted = isMuted();
    const nowMuted = !wasMuted;
    window.localStorage.setItem("irfan-os-sound-muted", nowMuted ? "1" : "0");
    setMuted(nowMuted);
    if (!nowMuted) tone(560, 40, 0.04, "sine");
  }, []);

  return { muted, toggle };
}
