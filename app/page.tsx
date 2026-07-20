"use client";

import { useState } from "react";
import BootSequence from "@/components/BootSequence";
import UtilityBar from "@/components/UtilityBar";
import ConsoleDock from "@/components/ConsoleDock";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import SecretTerminal from "@/components/SecretTerminal";
import ToastHost from "@/components/Toast";

import { AchievementProvider, useAchievements } from "@/context/AchievementContext";
import AchievementHost from "@/components/achievement-system/AchievementHost";

import { GameCenterProvider } from "@/context/GameCenterContext";
import GameCenterHost from "@/components/game-center/GameCenterHost";

import { MatrixModeProvider } from "@/context/MatrixModeContext";
import MatrixModeWrapper from "@/components/matrix-mode/MatrixModeWrapper";

import { DevModeProvider } from "@/context/DevModeContext";
import DevModeOverlay from "@/components/developer-mode/DevModeOverlay";

import { IrfanAIProvider } from "@/context/IrfanAIContext";
import IrfanAI from "@/components/irfan-ai/IrfanAI";

import { DesktopModeProvider } from "@/context/DesktopModeContext";
import WindowManagerHost from "@/components/desktop-mode/WindowManagerHost";

function PageContent() {
  const [booted, setBooted] = useState(false);
  const { unlock } = useAchievements();

  return (
    <>
      <BootSequence
        onDone={() => {
          setBooted(true);
          unlock("booted-os");
        }}
      />

      <MatrixModeWrapper>
        <div className="grain" />
        <div className="scanline" />

        <div
          className="transition-opacity duration-700"
          style={{ opacity: booted ? 1 : 0 }}
        >
          <UtilityBar />
          <ConsoleDock />
          <Hero ready={booted} />
          <About />
          <Skills />
          <Projects />
          <Achievements />
          <Contact />
          <footer className="px-[8vw] py-14 border-t border-gunmetal flex justify-between font-mono text-[11px] text-titanium flex-wrap gap-2.5">
            <span style={{ letterSpacing: "0.08em" }}>© 2026 MUHAMMED IRFAN K M</span>
            <span style={{ letterSpacing: "0.08em" }}>
              PRESS <span className="text-blue">`</span> FOR SECURE TERMINAL
            </span>
          </footer>
        </div>
      </MatrixModeWrapper>

      <SecretTerminal />
      <ToastHost />
      <AchievementHost />
      <GameCenterHost />
      <DevModeOverlay />
      <IrfanAI />
      <WindowManagerHost />
    </>
  );
}

export default function Page() {
  return (
    <AchievementProvider>
      <GameCenterProvider>
        <MatrixModeProvider>
          <DevModeProvider>
            <IrfanAIProvider>
              <DesktopModeProvider>
                <PageContent />
              </DesktopModeProvider>
            </IrfanAIProvider>
          </DevModeProvider>
        </MatrixModeProvider>
      </GameCenterProvider>
    </AchievementProvider>
  );
}
