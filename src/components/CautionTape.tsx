"use client";

import WeirdOnly from "@/components/WeirdOnly";

/**
 * Thin caution-tape marquee strip between sections. Taxi-yellow moment —
 * use at most twice on the page (token rule: taxi is garnish).
 */
export default function CautionTape({
  text = "⚠ BE WEIRD ⚠ STAY CURIOUS ⚠ HANDLE WITH CARE",
}: {
  text?: string;
}) {
  const run = Array(6).fill(text).join(" ✱ ");
  return (
    <WeirdOnly fallback={<hr className="border-line" aria-hidden="true" />}>
      <div
        className="relative -rotate-1 overflow-hidden border-y-2 border-taxi/70 bg-ink py-1.5"
        aria-hidden="true"
      >
        <div
          className="flex w-max whitespace-nowrap font-[family-name:var(--font-space-mono)] text-[11px] font-bold uppercase tracking-[0.3em] text-taxi"
          style={{ animation: "marquee-x 40s linear infinite" }}
        >
          <span className="pr-8">{run}</span>
          <span className="pr-8">{run}</span>
        </div>
      </div>
    </WeirdOnly>
  );
}
