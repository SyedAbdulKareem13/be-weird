"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { gsap, SplitText, SCRAMBLE_CHARS } from "@/lib/gsap";
import { fieldNotes } from "@/data/content";
import { useIsWeird } from "@/lib/mode-store";
import SectionHeader from "@/components/SectionHeader";
import WeirdOnly from "@/components/WeirdOnly";
import DecryptedText from "@/components/reactbits/DecryptedText";
import VariableProximity from "@/components/reactbits/VariableProximity";

/**
 * 02 — FIELD NOTES. The about/manifesto file of the specimen archive.
 * Boring mode = plain h2 + paragraph + chips (the full skeleton).
 * Weird mode = decrypt headline, SplitText line reveal, proximity-swelling
 * key phrase, anime.js chip stagger.
 */

/** Key phrase of the manifesto that swells near the cursor (weird only). */
const KEY_PHRASE = "make you feel something";

const phraseAt = fieldNotes.manifesto.indexOf(KEY_PHRASE);
const hasPhrase = phraseAt >= 0;
const manifestoBefore = hasPhrase
  ? fieldNotes.manifesto.slice(0, phraseAt)
  : fieldNotes.manifesto;
const manifestoAfter = hasPhrase
  ? fieldNotes.manifesto.slice(phraseAt + KEY_PHRASE.length)
  : "";

const HEADLINE_CLASS =
  "font-[family-name:var(--font-bricolage)] text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase leading-[0.95] tracking-tight";

/* ---------- barcode garnish (deterministic — SSR safe) ---------- */

const BAR_WIDTHS = [
  3, 1, 2, 1, 4, 1, 2, 2, 1, 3, 1, 4, 1, 2, 1, 1, 3, 2, 4, 1, 1, 2, 3, 1, 2,
  1, 4, 1, 1, 3,
];
const BAR_GAP = 2;

type Bar = { x: number; w: number; tall: boolean };

const BARCODE_BARS: Bar[] = (() => {
  let x = 0;
  return BAR_WIDTHS.map((w, i) => {
    const tall =
      i < 2 || i >= BAR_WIDTHS.length - 2 || i === 14 || i === 15;
    const bar = { x, w, tall };
    x += w + BAR_GAP;
    return bar;
  });
})();

const BARCODE_W = BARCODE_BARS.reduce((max, b) => Math.max(max, b.x + b.w), 0);

function BarcodeGarnish() {
  return (
    <div className="pointer-events-none absolute bottom-24 right-6 hidden select-none flex-col items-end gap-2 md:right-12 lg:right-20 lg:flex">
      <svg
        viewBox={`0 0 ${BARCODE_W} 48`}
        className="h-10 w-auto text-bone/70"
        aria-hidden="true"
        focusable="false"
      >
        {BARCODE_BARS.map((bar, i) => (
          <rect
            key={i}
            x={bar.x}
            y={0}
            width={bar.w}
            height={bar.tall ? 48 : 40}
            fill="currentColor"
          />
        ))}
      </svg>
      <p className="specimen-label">SYD-∞-13</p>
    </div>
  );
}

/* ---------- section ---------- */

export default function FieldNotes() {
  const isWeird = useIsWeird();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // SSR + first client render are boring — same gate WeirdOnly uses.
  const weird = mounted && isWeird;

  const manifestoRef = useRef<HTMLElement | null>(null);
  const factsRef = useRef<HTMLUListElement | null>(null);

  /* THE moment: manifesto lines rise out of masks on scroll (weird only). */
  useEffect(() => {
    if (!weird) return;
    const el = manifestoRef.current;
    if (!el) return;

    let split: SplitText | null = null;
    let cancelled = false;
    const ctx = gsap.context(() => {}, el);

    // Split after fonts load so line breaks are measured correctly.
    document.fonts.ready.then(() => {
      if (cancelled || !manifestoRef.current) return;
      ctx.add(() => {
        split = new SplitText(el, {
          type: "lines",
          mask: "lines",
          linesClass: "fn-line",
          // Leave screen-reader text (VariableProximity's sr-only) intact.
          ignore: ".sr-only",
        });
        gsap.from(split.lines, {
          yPercent: 100,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            once: true,
          },
          onComplete: () => {
            // Un-split once revealed so the proximity phrase can swell
            // without being clipped by the line masks.
            split?.revert();
            split = null;
          },
        });
      });
    });

    return () => {
      cancelled = true;
      ctx.revert();
      try {
        split?.revert();
      } catch {
        // node already detached — nothing to restore
      }
    };
  }, [weird]);

  /* Facts chips stagger in on view (weird only). */
  useEffect(() => {
    if (!weird) return;
    const list = factsRef.current;
    if (!list) return;
    const chips = Array.from(
      list.querySelectorAll<HTMLElement>("[data-fn-chip]"),
    );
    if (chips.length === 0) return;

    let anim: ReturnType<typeof animate> | null = null;

    // Hide imperatively (not in CSS) so chips stay visible if this never runs.
    for (const chip of chips) {
      chip.style.opacity = "0";
      chip.style.transform = "translateY(12px)";
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          anim = animate(chips, {
            opacity: [0, 1],
            translateY: [12, 0],
            duration: 500,
            delay: stagger(70),
            ease: "outCubic",
          });
        }
      },
      { threshold: 0.3 },
    );
    io.observe(list);

    return () => {
      io.disconnect();
      anim?.cancel();
      for (const chip of chips) {
        chip.style.opacity = "";
        chip.style.transform = "";
      }
    };
  }, [weird]);

  return (
    <section
      id="field-notes"
      className="relative px-6 py-24 md:px-12 md:py-36 lg:px-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader index="02" name="FIELD NOTES" stamp={fieldNotes.stamp} />

        <h2 className={HEADLINE_CLASS}>
          <WeirdOnly fallback={<span>{fieldNotes.headline}</span>}>
            <DecryptedText
              text={fieldNotes.headline}
              animateOn="view"
              sequential
              revealDirection="start"
              speed={28}
              characters={SCRAMBLE_CHARS}
              parentClassName="block"
              encryptedClassName="text-ultraviolet"
            />
          </WeirdOnly>
        </h2>

        {/* key swaps the whole node on mode flip so React never reconciles
            inside a SplitText-rearranged DOM */}
        <p
          key={weird ? "manifesto-weird" : "manifesto-boring"}
          ref={(el) => {
            manifestoRef.current = el;
          }}
          className="mt-10 max-w-4xl text-2xl leading-relaxed text-bone/90 md:mt-14 md:text-3xl"
        >
          {weird && hasPhrase ? (
            <>
              {manifestoBefore}
              <span data-cursor="INSPECT">
                <VariableProximity
                  label={KEY_PHRASE}
                  containerRef={manifestoRef}
                  radius={120}
                  falloff="linear"
                  fromFontVariationSettings="'wght' 420, 'wdth' 100"
                  toFontVariationSettings="'wght' 850, 'wdth' 130"
                  style={{ fontFamily: "var(--font-flex), sans-serif" }}
                />
              </span>
              {manifestoAfter}
            </>
          ) : (
            fieldNotes.manifesto
          )}
        </p>

        <ul
          ref={factsRef}
          aria-label="SPECIMEN FACTS"
          className="mt-12 flex max-w-4xl flex-wrap items-center gap-x-3 gap-y-3 font-[family-name:var(--font-space-mono)] text-[0.6875rem] uppercase tracking-[0.14em] md:mt-16"
        >
          {fieldNotes.facts.map((fact, i) => (
            <li key={fact} className="flex items-center gap-x-3">
              <span
                data-fn-chip
                className="inline-block border border-line bg-specimen px-3 py-1.5 text-bone/85"
              >
                {fact}
              </span>
              {i < fieldNotes.facts.length - 1 ? (
                <span aria-hidden="true" className="text-hazard">
                  ✱
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <BarcodeGarnish />
    </section>
  );
}
