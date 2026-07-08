"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "@/lib/gsap";
import { useIsWeird } from "@/lib/mode-store";
import { detectPerfTier } from "@/lib/perf";

/**
 * PRELOADER — "hellow" (hello + the W of WEIRD), hand-drawn on like the
 * macOS setup greeting. While the ink dries, the heavy assets (3D badge
 * chunk, card textures) warm up in the background so the archive is
 * butter by the time the curtain lifts.
 *
 * Contract: dispatches window "archive-ready" exactly once in every path
 * (skip-render, skip button, hard cap, natural finish, mode flip).
 * Shows once per session; skipped under reduced motion / boring mode.
 * Append ?boot=force to the URL to replay it.
 */

const SESSION_KEY = "archive-boot-done";
const READY_EVENT = "archive-ready";
/** Natural show: draw ~1.9s + hold 0.35s; exit fade 0.5s. Cap is a safety net. */
const NATURAL_MS = 2250;
const HARD_CAP_MS = 3200;
const EXIT_MS = 500;

type Phase = "pending" | "active" | "done";

/** Warm the expensive lazy assets while the greeting plays. */
function warmHeavyAssets(): void {
  if (detectPerfTier() !== "high") return;
  try {
    // 3D badge chunk (also triggers its useGLTF.preload of card.glb)
    void import("@/components/reactbits/Lanyard");
    for (const src of [
      "/assets/lanyard/badge-front.png",
      "/assets/lanyard/badge-back.png",
      "/assets/lanyard/strap.png",
    ]) {
      const img = new Image();
      img.src = src;
    }
  } catch {
    // warming is best-effort only
  }
}

export default function Preloader(): React.ReactElement | null {
  const [phase, setPhase] = useState<Phase>("pending");
  const isWeird = useIsWeird();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const helloRef = useRef<SVGPathElement | null>(null);
  const wRef = useRef<SVGPathElement | null>(null);
  const captionRef = useRef<HTMLParagraphElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const exitStartedRef = useRef(false);
  const finishedRef = useRef(false);
  const dispatchedRef = useRef(false);

  const fireReady = useCallback(() => {
    if (dispatchedRef.current) return;
    dispatchedRef.current = true;
    window.dispatchEvent(new Event(READY_EVENT));
  }, []);

  /** Terminal state: mark seen, unmount overlay. Ready fires from the done-effect. */
  const finishExit = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // private mode etc. — non-fatal
    }
    setPhase("done");
  }, []);

  /** Luxury exit: the word breathes up a touch as the curtain fades. */
  const beginExit = useCallback(() => {
    if (exitStartedRef.current || finishedRef.current) return;
    exitStartedRef.current = true;

    tlRef.current?.kill();
    tlRef.current = null;

    const root = rootRef.current;
    if (!root) {
      finishExit();
      return;
    }
    gsap.to(root.querySelector("[data-hellow-stage]"), {
      scale: 1.03,
      opacity: 0,
      duration: EXIT_MS / 1000,
      ease: "power2.inOut",
    });
    gsap.to(root, {
      opacity: 0,
      duration: EXIT_MS / 1000,
      ease: "power2.inOut",
      onComplete: finishExit,
    });
  }, [finishExit]);

  /* Decide before first paint: show, or skip straight to ready. */
  useLayoutEffect(() => {
    const force = window.location.search.includes("boot=force");
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }
    const boring =
      document.documentElement.getAttribute("data-mode") === "boring";

    if (!force && (reduced || seen || boring)) {
      finishedRef.current = true; // nothing to exit from
      setPhase("done");
      return;
    }
    setPhase("active");
  }, []);

  /* Done (any path) → dispatch ready once, after listeners have mounted. */
  useEffect(() => {
    if (phase !== "done") return;
    const t = window.setTimeout(fireReady, 0);
    return () => window.clearTimeout(t);
  }, [phase, fireReady]);

  /* Mode flipped to boring mid-boot → bail out instantly, no ceremony. */
  useEffect(() => {
    if (phase === "active" && !isWeird) finishExit();
  }, [phase, isWeird, finishExit]);

  /* The greeting: draw "hello" then the hazard "w", hold, exit. */
  useLayoutEffect(() => {
    if (phase !== "active") return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // put the dead time to work
    warmHeavyAssets();

    const capTimer = window.setTimeout(beginExit, HARD_CAP_MS - EXIT_MS);
    const naturalTimer = window.setTimeout(beginExit, NATURAL_MS);

    const ctx = gsap.context(() => {
      const hello = helloRef.current;
      const w = wRef.current;
      if (!hello || !w) return;

      const helloLength = hello.getTotalLength();
      const wLength = w.getTotalLength();
      gsap.set(hello, {
        strokeDasharray: helloLength,
        strokeDashoffset: helloLength,
      });
      gsap.set(w, { strokeDasharray: wLength, strokeDashoffset: wLength });
      gsap.set(captionRef.current, { opacity: 0, y: 8 });

      const tl = gsap.timeline();
      tl.to(hello, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.inOut",
      });
      tl.to(
        w,
        { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" },
        "-=0.06"
      );
      tl.to(
        captionRef.current,
        { opacity: 0.55, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.25"
      );
      tlRef.current = tl;
    }, rootRef);

    return () => {
      window.clearTimeout(capTimer);
      window.clearTimeout(naturalTimer);
      ctx.revert();
      tlRef.current = null;
      document.body.style.overflow = prevOverflow;
    };
  }, [phase, beginExit]);

  if (phase !== "active") return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-ink"
      aria-label="hellow — the archive is waking up"
    >
      <div
        data-hellow-stage
        className="flex w-full flex-col items-center px-8"
      >
        <svg
          viewBox="28 30 480 185"
          className="w-[min(540px,78vw)] overflow-visible"
          aria-hidden="true"
        >
          <path
            ref={helloRef}
            className="fill-none stroke-bone"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M 48 182 C 84 148, 112 88, 100 60 C 94 46, 80 52, 77 74 C 71 112, 73 158, 79 194 C 82 168, 92 138, 111 131 C 128 125, 136 150, 138 176 C 140 192, 147 197, 156 189 C 164 181, 171 167, 170 155 C 169 143, 157 142, 152 153 C 146 167, 149 187, 163 193 C 174 197, 185 190, 193 177 C 206 152, 224 92, 229 66 C 232 51, 222 47, 217 62 C 208 90, 206 152, 210 188 C 212 199, 222 199, 230 187 C 243 168, 261 100, 266 74 C 269 59, 259 55, 254 68 C 246 94, 244 152, 248 188 C 250 199, 260 199, 269 186 C 275 176, 284 158, 293 149 C 304 138, 321 136, 330 146 C 339 157, 337 176, 326 186 C 314 196, 297 194, 294 180 C 291 167, 300 152, 314 148 C 324 145, 333 146, 339 151"
          />
          <path
            ref={wRef}
            className="fill-none stroke-hazard"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M 339 151 C 348 160, 356 178, 361 191 C 364 199, 372 198, 376 187 C 381 172, 388 156, 396 149 C 403 144, 409 148, 412 159 C 415 172, 419 184, 424 190 C 428 197, 436 195, 441 184 C 448 167, 459 146, 472 137 C 482 130, 494 128, 500 119"
          />
        </svg>

        <p
          ref={captionRef}
          className="specimen-label mt-10 text-bone"
          style={{ opacity: 0 }}
        >
          THE SPECIMEN ARCHIVE — №13
        </p>
      </div>

      <button
        type="button"
        onClick={beginExit}
        data-cursor="INSPECT"
        className="absolute right-6 bottom-6 font-[family-name:var(--font-space-mono)] text-[11px] tracking-[0.2em] text-bone/50 uppercase hover:text-hazard md:right-10 md:bottom-8"
      >
        SKIP →
      </button>
    </div>
  );
}
