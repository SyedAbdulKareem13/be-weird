"use client";

/**
 * VIEW SURVEILLANCE — fullscreen CCTV overlay for the archive terminal.
 * Renders a looping muted clip inside a monitor chrome: camera label,
 * blinking REC dot, live timecode. Closes on ESC / click / CLOSE.
 */

import { useEffect, useRef, useState } from "react";
import type { FootageClip } from "@/data/media";

export default function SurveillanceFeed({
  clip,
  onClose,
}: {
  clip: FootageClip;
  onClose: () => void;
}) {
  const [timecode, setTimecode] = useState("00:00:00");
  const startRef = useRef(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => {
      const s = Math.floor((Date.now() - startRef.current) / 1000);
      const hh = String(Math.floor(s / 3600)).padStart(2, "0");
      const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      setTimecode(`${hh}:${mm}:${ss}`);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[146] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-[2px] md:p-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Surveillance footage of the specimen"
    >
      <div
        className="relative w-full max-w-[900px] border border-line-strong bg-ink shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* monitor chrome */}
        <div className="flex items-center justify-between border-b border-line px-4 py-2 font-[family-name:var(--font-space-mono)]">
          <span className="text-[11px] tracking-[0.2em] text-bone/70 uppercase">
            {clip.label}
          </span>
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[11px] tracking-[0.18em] text-hazard">
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 rounded-full bg-hazard"
                style={{ animation: "blink-caret 1.2s steps(1) infinite" }}
              />
              REC
            </span>
            <span
              suppressHydrationWarning
              className="text-[11px] tracking-[0.14em] text-bone/60"
            >
              {timecode}
            </span>
            <button
              type="button"
              onClick={onClose}
              data-cursor="INSPECT"
              className="text-[10px] font-bold tracking-[0.16em] text-bone/70 uppercase hover:text-hazard"
            >
              CLOSE
            </button>
          </span>
        </div>

        <video
          src={clip.video}
          poster={clip.poster}
          autoPlay
          muted
          loop
          playsInline
          className="block max-h-[70vh] w-full object-cover"
        />

        <p className="specimen-label border-t border-line px-4 py-2">
          SUBJECT OBSERVED IN NATURAL HABITAT. DO NOT TAP THE GLASS.
        </p>
      </div>
    </div>
  );
}
