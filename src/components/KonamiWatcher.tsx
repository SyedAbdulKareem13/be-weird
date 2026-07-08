"use client";

/**
 * ↑↑↓↓←→←→BA — MAXIMUM WEIRD for 10 seconds: SplashCursor fluid trail +
 * inverted palette + a toast. Weird mode only. Cleans itself up.
 */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useIsWeird } from "@/lib/mode-store";
import { toast } from "@/lib/toast";

// WebGL fluid sim — only ever needed for the 10-second konami reward, so it
// stays out of the initial bundle entirely.
const SplashCursor = dynamic(
  () => import("@/components/reactbits/SplashCursor"),
  { ssr: false }
);

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function KonamiWatcher() {
  const isWeird = useIsWeird();
  const [active, setActive] = useState(false);
  const progress = useRef(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!isWeird) return;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[progress.current]) {
        progress.current += 1;
        if (progress.current === KONAMI.length) {
          progress.current = 0;
          setActive(true);
          toast("YOU FOUND THE FORBIDDEN FILE");
          if (timer.current) window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setActive(false), 10_000);
        }
      } else {
        progress.current = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [isWeird]);

  useEffect(() => {
    if (active) {
      document.documentElement.dataset.konami = "1";
    } else {
      delete document.documentElement.dataset.konami;
    }
    return () => {
      delete document.documentElement.dataset.konami;
    };
  }, [active]);

  if (!active || !isWeird) return null;

  return (
    <>
      {/* palette inversion while the forbidden file is open */}
      <style>{`
        html[data-konami="1"] { filter: invert(1) hue-rotate(180deg); }
        html[data-konami="1"] img,
        html[data-konami="1"] canvas,
        html[data-konami="1"] video { filter: invert(1) hue-rotate(180deg); }
      `}</style>
      <div className="fixed inset-0 z-[135]" aria-hidden="true">
        <SplashCursor />
      </div>
    </>
  );
}
