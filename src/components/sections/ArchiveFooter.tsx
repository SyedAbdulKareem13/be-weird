"use client";

/**
 * Footer — FallingText physics heap, colophon, and the giant half-cropped
 * BE WEIRD. watermark.
 */

import { footer } from "@/data/content";
import WeirdOnly from "@/components/WeirdOnly";
import FallingText from "@/components/reactbits/FallingText";

export default function ArchiveFooter() {
  return (
    <footer className="relative overflow-hidden">
      {/* falling words heap */}
      <div className="border-y border-line">
        <WeirdOnly
          fallback={
            <p className="specimen-label px-6 py-10 text-center tracking-[0.3em]">
              {footer.fallingWords.join(" · ")}
            </p>
          }
        >
          <div
            className="h-[240px] font-[family-name:var(--font-space-mono)]"
            data-cursor="DRAG"
          >
            <FallingText
              text={footer.fallingWords.join(" ")}
              highlightWords={["weird", "curious"]}
              trigger="scroll"
              backgroundColor="transparent"
              wireframes={false}
              gravity={0.6}
              mouseConstraintStiffness={0.9}
              fontSize="1.4rem"
            />
          </div>
        </WeirdOnly>
      </div>

      {/* colophon */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-8 md:px-12 lg:px-20">
        <p className="font-[family-name:var(--font-space-mono)] text-[11px] leading-relaxed tracking-wider uppercase opacity-60">
          {footer.colophon}
        </p>
        <a
          href={footer.sourceUrl}
          target="_blank"
          rel="noreferrer"
          data-cursor="INSPECT"
          className="font-[family-name:var(--font-space-mono)] text-[11px] tracking-wider text-hazard uppercase hover:underline"
        >
          [SOURCE ↗]
        </a>
      </div>

      {/* giant watermark, half-cropped by the viewport bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative h-[18vw] overflow-hidden"
      >
        <p className="text-stroke absolute inset-x-0 top-[12%] text-center font-[family-name:var(--font-bricolage)] text-[16vw] leading-none font-bold whitespace-nowrap uppercase opacity-70">
          BE WEIRD.
        </p>
      </div>
    </footer>
  );
}
