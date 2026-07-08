"use client";

import { useEffect, useState } from "react";
import { useIsWeird } from "@/lib/mode-store";

/**
 * "FILE READ: 43%" — how much of the archive the researcher has processed.
 * Mono text for the nav plus a hairline hazard progress bar pinned to the
 * very top of the viewport. Weird mode only.
 */
export default function FileReadProgress() {
  const isWeird = useIsWeird();
  const [progress, setProgress] = useState(0);
  // Render nothing until mounted: SSR can't know the visitor's mode, and a
  // client that resolved "boring" pre-hydration would otherwise see a
  // different tree than the server sent (React #418).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isWeird) return;
    let rafId: number | null = null;
    const measure = () => {
      rafId = null;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      setProgress(Math.round(value));
    };
    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isWeird]);

  if (!mounted || !isWeird) return null;

  return (
    <>
      <span
        suppressHydrationWarning
        className="text-[10px] tracking-[0.14em] whitespace-nowrap uppercase opacity-60"
      >
        FILE READ: {progress}%
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[101] h-[1.5px] bg-hazard transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </>
  );
}
