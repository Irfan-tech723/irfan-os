"use client";

import { createContext, useCallback, useContext, useState } from "react";

type IrfanAIContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const IrfanAIContext = createContext<IrfanAIContextValue | null>(null);

export function IrfanAIProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <IrfanAIContext.Provider value={{ isOpen, open, close }}>
      {children}
    </IrfanAIContext.Provider>
  );
}

export function useIrfanAI() {
  const ctx = useContext(IrfanAIContext);
  if (!ctx) throw new Error("useIrfanAI must be used within an IrfanAIProvider");
  return ctx;
}
