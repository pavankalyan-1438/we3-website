"use client";

import { createContext, useContext } from "react";
import type { ScrollState } from "@/hooks/useScrollController";
import { useScrollController } from "@/hooks/useScrollController";

const ScrollContext = createContext<(ScrollState & { prefersReducedMotion: boolean }) | null>(null);

export function ScrollController({ children }: { children: React.ReactNode }) {
  const scroll = useScrollController();
  return <ScrollContext.Provider value={scroll}>{children}</ScrollContext.Provider>;
}

export function useScrollContext() {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error("useScrollContext must be used within ScrollController");
  }
  return ctx;
}
