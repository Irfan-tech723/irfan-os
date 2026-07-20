"use client";

import { useEffect, useState } from "react";
import { useVoiceConsole } from "@/hooks/useVoiceConsole";
import { useSound } from "@/hooks/useSound";
import { showToast } from "./Toast";
import DiagnosticsOverlay from "./DiagnosticsOverlay";
import { useIrfanAI } from "@/context/IrfanAIContext";
import { useDesktopMode } from "@/context/DesktopModeContext";

export default function UtilityBar() {
  const [time, setTime] = useState("");
  const { supported, listening, toggle } = useVoiceConsole(showToast);
  const { muted, toggle: toggleSound } = useSound();
  const [diagnostics, setDiagnostics] = useState(false);
  const { open: openAI } = useIrfanAI();
  const { isDesktop, toggleMode } = useDesktopMode();

  useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString([], { hour12: false }) + " — GOTHAM SECTOR 7"
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[400] flex justify-between items-center px-[8vw] py-5 font-mono text-[11px] text-titanium pointer-events-none">
      <span
        className="pointer-events-auto cursor-default select-none"
        style={{ letterSpacing: "0.08em" }}
        onDoubleClick={() => {
          setDiagnostics((d) => !d);
          showToast(diagnostics ? "Diagnostics closed" : "FPS + viewport readout enabled");
        }}
        title="Double-click for diagnostics"
      >
        {time}
      </span>
      <div className="pointer-events-auto flex items-center gap-2.5">
        <button
          onClick={toggleMode}
          title={isDesktop ? "Back to website mode" : "Switch to desktop mode"}
          className="flex items-center gap-2 bg-charcoal border border-gunmetal rounded-full px-3.5 py-2 text-titanium transition-all duration-300 hover:border-blue hover:text-offwhite"
          style={{ letterSpacing: "0.1em" }}
        >
          {isDesktop ? "WEBSITE MODE" : "DESKTOP MODE"}
        </button>
        <button
          onClick={openAI}
          title="Ask IRFAN AI"
          className="flex items-center gap-2 bg-charcoal border border-gunmetal rounded-full px-3.5 py-2 text-titanium transition-all duration-300 hover:border-blue hover:text-offwhite"
          style={{ letterSpacing: "0.1em" }}
        >
          IRFAN AI
        </button>
        <button
          onClick={toggleSound}
          title={muted ? "Enable UI sound" : "Mute UI sound"}
          className="flex items-center gap-2 bg-charcoal border border-gunmetal rounded-full px-3.5 py-2 text-titanium transition-all duration-300 hover:border-blue hover:text-offwhite"
          style={{ letterSpacing: "0.1em" }}
        >
          {muted ? "SOUND OFF" : "SOUND ON"}
        </button>
        <button
          onClick={toggle}
          title={supported ? "Voice console" : "Speech recognition not supported in this browser"}
          className={`flex items-center gap-2 bg-charcoal border rounded-full px-3.5 py-2 transition-all duration-300 ${
            listening ? "border-amber text-amber" : "border-gunmetal text-titanium"
          } ${!supported ? "opacity-40" : "hover:border-blue hover:text-offwhite"}`}
          style={{ letterSpacing: "0.1em" }}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full bg-current ${listening ? "animate-pulse" : ""}`}
          />
          {listening ? "LISTENING" : "VOICE OFF"}
        </button>
      </div>
      {diagnostics && <DiagnosticsOverlay />}
    </div>
  );
}
