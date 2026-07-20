"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

export type WindowKind =
  | "projects"
  | "resume"
  | "terminal"
  | "github"
  | "linkedin"
  | "contact"
  | "diagnostics";

export type DesktopWindow = {
  id: string;
  kind: WindowKind;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minimized: boolean;
  maximized: boolean;
  z: number;
};

const DEFAULTS: Record<WindowKind, { title: string; w: number; h: number }> = {
  projects: { title: "Projects.app", w: 420, h: 460 },
  resume: { title: "Resume.pdf", w: 380, h: 220 },
  terminal: { title: "Terminal", w: 460, h: 420 },
  github: { title: "GitHub.lnk", w: 360, h: 180 },
  linkedin: { title: "LinkedIn.lnk", w: 360, h: 180 },
  contact: { title: "Contact.app", w: 380, h: 260 },
  diagnostics: { title: "Diagnostics", w: 300, h: 260 },
};

type DesktopModeContextValue = {
  isDesktop: boolean;
  toggleMode: () => void;
  windows: DesktopWindow[];
  openWindow: (kind: WindowKind) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindow: (id: string, patch: Partial<DesktopWindow>) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
};

const DesktopModeContext = createContext<DesktopModeContextValue | null>(null);

export function DesktopModeProvider({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [windows, setWindows] = useState<DesktopWindow[]>([]);
  const zCounter = useRef(1);
  const idCounter = useRef(0);

  const toggleMode = useCallback(() => setIsDesktop((d) => !d), []);

  const openWindow = useCallback((kind: WindowKind) => {
    setWindows((prev) => {
      // Re-focus if that program is already open rather than stacking duplicates.
      const existing = prev.find((w) => w.kind === kind);
      if (existing) {
        zCounter.current += 1;
        return prev.map((w) =>
          w.id === existing.id ? { ...w, minimized: false, z: zCounter.current } : w
        );
      }
      const def = DEFAULTS[kind];
      idCounter.current += 1;
      zCounter.current += 1;
      const offset = (idCounter.current % 6) * 24;
      const next: DesktopWindow = {
        id: `win-${idCounter.current}`,
        kind,
        title: def.title,
        x: 120 + offset,
        y: 90 + offset,
        w: def.w,
        h: def.h,
        minimized: false,
        maximized: false,
        z: zCounter.current,
      };
      return [...prev, next];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, z } : w)));
  }, []);

  const updateWindow = useCallback((id: string, patch: Partial<DesktopWindow>) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }, []);

  const toggleMinimize = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)));
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)));
  }, []);

  return (
    <DesktopModeContext.Provider
      value={{
        isDesktop,
        toggleMode,
        windows,
        openWindow,
        closeWindow,
        focusWindow,
        updateWindow,
        toggleMinimize,
        toggleMaximize,
      }}
    >
      {children}
    </DesktopModeContext.Provider>
  );
}

export function useDesktopMode() {
  const ctx = useContext(DesktopModeContext);
  if (!ctx) throw new Error("useDesktopMode must be used within a DesktopModeProvider");
  return ctx;
}
