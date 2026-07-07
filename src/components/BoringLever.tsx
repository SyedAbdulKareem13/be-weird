"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { useModeStore, type ArchiveMode } from "@/lib/mode-store";
import { SCRAMBLE_CHARS } from "@/lib/gsap";
import LetterGlitch from "@/components/reactbits/LetterGlitch";

/**
 * THE LEVER — emergency-switch styled mode toggle. Pulling it down engages
 * BORING mode (the readable resume); pushing it up restores WEIRD mode.
 * Fully keyboard-operable in both modes: it IS the accessibility feature.
 */

/** Knob travel in px between WEIRD (top) and BORING (bottom) detents. */
const KNOB_TRAVEL = 22;
/** How long the full-screen glitch flash stays up. */
const GLITCH_MS = 450;

const GLITCH_COLORS = ["#FF4D00", "#6E4BFF", "#EFEAE3"];
const GLITCH_CHARACTERS = "SPECIMENARCHIVE13" + SCRAMBLE_CHARS;

export default function BoringLever(): React.JSX.Element {
  const mode = useModeStore((s) => s.mode);
  const toggleMode = useModeStore((s) => s.toggleMode);

  // Server always renders WEIRD; read the real verdict only after mount so
  // hydration never mismatches (the <head> script may have set boring).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const shown: ArchiveMode = mounted ? mode : "weird";
  const isBoring = shown === "boring";

  const [glitch, setGlitch] = useState(false);
  const glitchTimer = useRef<number | null>(null);
  // No spring until the user actually pulls — a boring-mode visitor's knob
  // should sit at the bottom on load, not slam down.
  const hasInteracted = useRef(false);

  useEffect(() => {
    return () => {
      if (glitchTimer.current !== null) window.clearTimeout(glitchTimer.current);
    };
  }, []);

  const handlePull = () => {
    hasInteracted.current = true;
    toggleMode();

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    setGlitch(true);
    if (glitchTimer.current !== null) window.clearTimeout(glitchTimer.current);
    glitchTimer.current = window.setTimeout(() => setGlitch(false), GLITCH_MS);
  };

  const knobTransition = hasInteracted.current
    ? ({ type: "spring", stiffness: 500, damping: 22 } as const)
    : ({ duration: 0 } as const);

  return (
    <div className="flex select-none items-center gap-2.5 font-[family-name:var(--font-space-mono)]">
      {/* caption + state readout */}
      <div className="flex flex-col items-end gap-1 text-right">
        <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.16em] opacity-70">
          In case of recruiter — pull
        </span>
        <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em]">
          MODE: {isBoring ? "BORING" : "WEIRD"}
        </span>
      </div>

      {/* the lever itself */}
      <button
        type="button"
        role="switch"
        aria-checked={isBoring}
        aria-label="Boring mode. In case of recruiter, pull."
        data-cursor="PULL"
        onClick={handlePull}
        className={
          "relative h-12 w-[26px] shrink-0 rounded-[5px] border " +
          (isBoring ? "border-transparent" : "border-line-strong")
        }
        style={
          isBoring
            ? { backgroundColor: "#1F4FD8" }
            : {
                backgroundImage:
                  "repeating-linear-gradient(45deg, var(--taxi) 0px, var(--taxi) 8px, var(--ink) 8px, var(--ink) 16px)",
              }
        }
      >
        {/* slot */}
        <span
          aria-hidden="true"
          className="absolute bottom-[4px] left-1/2 top-[4px] w-2 -translate-x-1/2 rounded-full bg-ink"
        />
        {/* handle knob */}
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{ x: "-50%", y: isBoring ? KNOB_TRAVEL : 0 }}
          transition={knobTransition}
          className="absolute left-1/2 top-[4px] flex h-4 w-[30px] items-center justify-center rounded-[3px] border-2 border-ink bg-bone shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
        >
          <span className="h-[2px] w-3 rounded-full bg-ink opacity-70" />
        </motion.span>
      </button>

      {/* glitch flash on pull — portaled past the blurred nav, never blocks input */}
      {glitch &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[200]"
          >
            <LetterGlitch
              glitchColors={GLITCH_COLORS}
              glitchSpeed={18}
              centerVignette={false}
              outerVignette={true}
              smooth={false}
              characters={GLITCH_CHARACTERS}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
