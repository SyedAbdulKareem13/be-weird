"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useIsWeird } from "@/lib/mode-store";

/** Interactive elements that grow the ring even without a data-cursor tag. */
const INTERACTIVE_SELECTOR = 'a, button, [role="button"]';
/** Media surfaces where the ring flips to difference blending. */
const MEDIA_SELECTOR = "img, canvas, video";

const RING_SIZE = 36; // px
const DOT_SIZE = 8; // px

type RingState = "default" | "interactive" | "target";

/**
 * Global custom cursor. Mounted once (wired by the shell).
 *
 * - Hazard dot tracks the pointer 1:1; bone ring trails on a Motion spring.
 * - closest('[data-cursor]') → crosshair ticks + mono label chip (INSPECT / PULL / ...).
 * - a / button / [role=button] without data-cursor → ring scales 1.5x.
 * - img / canvas / video → ring blends with mix-blend-mode: difference.
 * - Renders nothing on coarse pointers or in boring mode (globals.css restores
 *   the native cursor there).
 */
export default function CustomCursor(): ReactElement | null {
  const isWeird = useIsWeird();
  const [finePointer, setFinePointer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [interactive, setInteractive] = useState(false);
  const [blend, setBlend] = useState(false);
  const visibleRef = useRef(false);

  // Dot follows 1:1; ring chases it on a spring. Start parked offscreen.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28 });

  // Touch / stylus devices get the native cursor, not this one.
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = (): void => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isWeird || !finePointer) return;

    const onMove = (e: PointerEvent): void => {
      if (document.hidden) return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    // Delegated hover state: recompute everything from the newest target.
    const onOver = (e: PointerEvent): void => {
      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;
      const tagged = el.closest("[data-cursor]");
      const value = tagged?.getAttribute("data-cursor") ?? null;
      setLabel(value ? value.toUpperCase() : null);
      setInteractive(!tagged && el.closest(INTERACTIVE_SELECTOR) !== null);
      setBlend(el.closest(MEDIA_SELECTOR) !== null);
    };

    // relatedTarget === null → pointer left the window entirely.
    const onOut = (e: PointerEvent): void => {
      if (e.relatedTarget !== null) return;
      visibleRef.current = false;
      setVisible(false);
      setLabel(null);
      setInteractive(false);
      setBlend(false);
    };

    // Hidden tab: settle the ring springs onto their targets so no
    // animation frames keep churning in the background.
    const onVisibility = (): void => {
      if (document.hidden) {
        ringX.jump(x.get());
        ringY.jump(y.get());
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("visibilitychange", onVisibility);
      visibleRef.current = false;
      setVisible(false);
      setLabel(null);
      setInteractive(false);
      setBlend(false);
    };
  }, [isWeird, finePointer, x, y, ringX, ringY]);

  if (!isWeird || !finePointer) return null;

  const ringState: RingState = label
    ? "target"
    : interactive
      ? "interactive"
      : "default";

  return (
    <>
      {/* Trailing ring + crosshair + label chip */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[130]"
        style={{
          x: ringX,
          y: ringY,
          left: -RING_SIZE / 2,
          top: -RING_SIZE / 2,
          width: RING_SIZE,
          height: RING_SIZE,
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          className="absolute inset-0"
          style={blend ? { mixBlendMode: "difference" } : undefined}
          animate={ringState}
          initial={false}
          variants={{
            default: { scale: 1 },
            interactive: { scale: 1.5 },
            target: { scale: 1.25 },
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          {/* Two stacked rings crossfade (opacity only) instead of animating
              border-color, which Motion can't interpolate through CSS vars. */}
          <motion.div
            className="absolute inset-0 rounded-full border-[1.5px] border-bone"
            initial={false}
            animate={{ opacity: label ? 0 : 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-[1.5px] border-hazard"
            initial={false}
            animate={{ opacity: label ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          />
          {/* Crosshair ticks at N / S / E / W */}
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: label ? 1 : 0, scale: label ? 1 : 0.4 }}
            transition={{ duration: 0.15 }}
          >
            <span className="absolute left-1/2 top-[-5px] h-[7px] w-[1.5px] -translate-x-1/2 bg-hazard" />
            <span className="absolute bottom-[-5px] left-1/2 h-[7px] w-[1.5px] -translate-x-1/2 bg-hazard" />
            <span className="absolute left-[-5px] top-1/2 h-[1.5px] w-[7px] -translate-y-1/2 bg-hazard" />
            <span className="absolute right-[-5px] top-1/2 h-[1.5px] w-[7px] -translate-y-1/2 bg-hazard" />
          </motion.div>
        </motion.div>

        {/* Label chip — outside the blend/scale layer so it stays legible */}
        <AnimatePresence>
          {label !== null && (
            <motion.span
              key="cursor-label"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.12 }}
              className="absolute left-full top-full ml-1.5 mt-1.5 whitespace-nowrap bg-ink px-1.5 py-0.5 font-[family-name:var(--font-space-mono)] text-[10px] uppercase leading-none tracking-[0.14em] text-hazard"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dot — 1:1 tracker, rendered after the ring so it sits on top */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[130] rounded-full bg-hazard"
        style={{
          x,
          y,
          left: -DOT_SIZE / 2,
          top: -DOT_SIZE / 2,
          width: DOT_SIZE,
          height: DOT_SIZE,
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
