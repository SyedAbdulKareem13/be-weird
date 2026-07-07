"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { animate, stagger, type JSAnimation } from "animejs";
import { gsap, SCRAMBLE_CHARS } from "@/lib/gsap";
import { bootLog } from "@/data/content";
import { useIsWeird } from "@/lib/mode-store";

/**
 * PRELOADER — the archive boot sequence.
 *
 * Shows once per browser session. Boot log lines scramble in (GSAP
 * ScrambleText — DecryptedText was considered but exposes no completion
 * callback, so lines can't be sequenced with it), then the overlay dissolves
 * as a grid of ink blocks scaling away (anime.js stagger from center).
 *
 * Contract: dispatches window "archive-ready" exactly once in every path
 * (skip-render, skip button, hard cap, natural finish, mode flip).
 */

const SESSION_KEY = "archive-boot-done";
const READY_EVENT = "archive-ready";
/** Everything — including the 0.6s block wipe — is gone by 2.5s. */
const HARD_CAP_MS = 2500;
const EXIT_MS = 600;

type Phase = "pending" | "active" | "done";
type GridDims = { cols: number; rows: number };

export default function Preloader(): React.ReactElement | null {
  const [phase, setPhase] = useState<Phase>("pending");
  const [grid, setGrid] = useState<GridDims>({ cols: 12, rows: 8 });
  const isWeird = useIsWeird();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const blockLayerRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const exitAnimsRef = useRef<JSAnimation[]>([]);
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

  /** Pixel-block wipe out. Safe to call from anywhere, runs once. */
  const beginExit = useCallback(() => {
    if (exitStartedRef.current || finishedRef.current) return;
    exitStartedRef.current = true;

    tlRef.current?.kill();
    tlRef.current = null;

    // Blocks take over as the backdrop so the page shows through the gaps.
    if (rootRef.current) rootRef.current.style.backgroundColor = "transparent";

    if (contentRef.current) {
      exitAnimsRef.current.push(
        animate(contentRef.current, {
          opacity: 0,
          duration: 160,
          ease: "outQuad",
        })
      );
    }

    const blocks = blockLayerRef.current
      ? (Array.from(blockLayerRef.current.children) as HTMLElement[])
      : [];
    if (blocks.length === 0) {
      finishExit();
      return;
    }

    exitAnimsRef.current.push(
      animate(blocks, {
        scale: [1, 0],
        duration: EXIT_MS - 220,
        ease: "inQuad",
        delay: stagger(26, { grid: [grid.cols, grid.rows], from: "center" }),
        onComplete: finishExit,
      })
    );
  }, [grid.cols, grid.rows, finishExit]);

  /* Decide before first paint: show, or skip straight to ready. */
  useLayoutEffect(() => {
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

    if (reduced || seen || boring) {
      finishedRef.current = true; // nothing to exit from
      setPhase("done");
      return;
    }
    setGrid(
      window.innerWidth < 768 ? { cols: 6, rows: 10 } : { cols: 12, rows: 8 }
    );
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

  /* Boot sequence: scramble lines in, then wipe. Hard-capped. */
  useLayoutEffect(() => {
    if (phase !== "active") return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const capTimer = window.setTimeout(beginExit, HARD_CAP_MS - EXIT_MS);

    const ctx = gsap.context(() => {
      const lines = Array.from(
        rootRef.current?.querySelectorAll<HTMLElement>("[data-boot-line]") ??
          []
      );
      gsap.set(lines, { opacity: 0 });

      const tl = gsap.timeline({ onComplete: beginExit });
      lines.forEach((el, i) => {
        const isLast = i === lines.length - 1;
        tl.set(el, { opacity: 1 }, i === 0 ? 0.1 : "+=0.06");
        tl.to(
          el,
          {
            duration: isLast ? 0.45 : 0.28,
            ease: "none",
            scrambleText: {
              text: bootLog[i] ?? "",
              chars: SCRAMBLE_CHARS,
              speed: 0.6,
            },
          },
          "<"
        );
      });
      tl.to({}, { duration: 0.2 }); // beat on the welcome line
      tlRef.current = tl;
    }, rootRef);

    return () => {
      window.clearTimeout(capTimer);
      ctx.revert();
      tlRef.current = null;
      for (const anim of exitAnimsRef.current) anim.cancel();
      exitAnimsRef.current = [];
      document.body.style.overflow = prevOverflow;
    };
  }, [phase, beginExit]);

  if (phase !== "active") return null;

  const blockCount = grid.cols * grid.rows;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[150] bg-ink"
      aria-label="BOOT SEQUENCE"
    >
      {/* pixel-wipe layer — becomes the backdrop during exit */}
      <div
        ref={blockLayerRef}
        aria-hidden="true"
        className="absolute inset-0 z-0 grid"
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
          gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
        }}
      >
        {Array.from({ length: blockCount }, (_, i) => (
          <div key={i} className="bg-ink" />
        ))}
      </div>

      <div ref={contentRef} className="absolute inset-0 z-10">
        <div className="flex h-full items-center px-6 md:px-12 lg:px-20">
          <div className="mx-auto w-full max-w-[640px]">
            <p className="specimen-label mb-6 text-bone/40">
              BOOT SEQUENCE // 001
            </p>
            <div className="space-y-2">
              {bootLog.map((line, i) => {
                const isLast = i === bootLog.length - 1;
                return isLast ? (
                  <p
                    key={line}
                    data-boot-line
                    className="mt-6 font-[family-name:var(--font-bricolage)] text-3xl font-bold uppercase tracking-tight text-hazard md:text-5xl"
                  >
                    {line}
                  </p>
                ) : (
                  <p
                    key={line}
                    data-boot-line
                    className="font-[family-name:var(--font-space-mono)] text-xs text-bone/70 md:text-sm"
                  >
                    {line}
                  </p>
                );
              })}
            </div>
            <span
              aria-hidden="true"
              className="mt-3 inline-block h-4 w-2 bg-bone/60"
              style={{ animation: "blink-caret 0.9s step-end infinite" }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={beginExit}
          data-cursor="INSPECT"
          className="absolute bottom-6 right-6 font-[family-name:var(--font-space-mono)] text-[11px] uppercase tracking-[0.2em] text-bone/50 hover:text-hazard md:bottom-8 md:right-10"
        >
          SKIP →
        </button>
      </div>
    </div>
  );
}
