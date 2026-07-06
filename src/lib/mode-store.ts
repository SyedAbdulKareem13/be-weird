"use client";

import { create } from "zustand";

export type ArchiveMode = "weird" | "boring";

type ModeState = {
  mode: ArchiveMode;
  konami: boolean;
  autoCalmed: boolean;
  setMode: (mode: ArchiveMode) => void;
  toggleMode: () => void;
  setKonami: (on: boolean) => void;
};

/**
 * The <head> script (layout.tsx) resolves the initial mode from the
 * "archive-mode" localStorage key or prefers-reduced-motion and stamps it on
 * <html data-mode> before hydration. The store reads that verdict here and
 * writes the same plain key back on every change.
 */
function initialMode(): ArchiveMode {
  if (typeof document === "undefined") return "weird";
  return document.documentElement.getAttribute("data-mode") === "boring"
    ? "boring"
    : "weird";
}

function wasAutoCalmed(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-auto-calmed") === "1";
}

function applyMode(mode: ArchiveMode) {
  document.documentElement.setAttribute("data-mode", mode);
  try {
    localStorage.setItem("archive-mode", mode);
  } catch {
    // private mode etc. — non-fatal
  }
}

export const useModeStore = create<ModeState>()((set, get) => ({
  mode: initialMode(),
  konami: false,
  autoCalmed: wasAutoCalmed(),
  setMode: (mode) => {
    applyMode(mode);
    set({ mode, autoCalmed: false });
  },
  toggleMode: () => {
    const next: ArchiveMode = get().mode === "weird" ? "boring" : "weird";
    applyMode(next);
    set({ mode: next, autoCalmed: false });
  },
  setKonami: (on) => set({ konami: on }),
}));

/** Convenience hook: true when full weirdness is allowed. */
export function useIsWeird(): boolean {
  return useModeStore((s) => s.mode === "weird");
}
