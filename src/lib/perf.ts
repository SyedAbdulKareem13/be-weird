"use client";

import { useEffect, useState } from "react";

/**
 * Device performance tier. "low" devices skip the genuinely expensive systems
 * (particle canvas, 3D physics badge, smooth-scroll) and fall back to their
 * static/CSS equivalents — the site stays fully readable and still weird, just
 * buttery on weak hardware. Capable machines get the full show.
 */
export type PerfTier = "high" | "low";

export function detectPerfTier(): PerfTier {
  if (typeof navigator === "undefined") return "high";
  // hardwareConcurrency is universal; deviceMemory is Chromium-only (GB).
  const cores = navigator.hardwareConcurrency || 8;
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  if (cores <= 4) return "low";
  if (typeof memory === "number" && memory <= 4) return "low";
  return "high";
}

/**
 * SSR renders "high", but every heavy consumer only mounts its payload after
 * hydration (behind WeirdOnly / IntersectionObserver), so resolving the real
 * tier in a mount effect causes no flash and no hydration mismatch.
 */
export function usePerfTier(): PerfTier {
  const [tier, setTier] = useState<PerfTier>("high");
  useEffect(() => {
    setTier(detectPerfTier());
  }, []);
  return tier;
}
