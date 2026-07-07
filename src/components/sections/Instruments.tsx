"use client";

/**
 * SECTION 03 — INSTRUMENTS (lab equipment / skills).
 * Boring skeleton: labeled skill groups with bordered mono chips over a faint
 * static grid. Weird enhancement: MagnetLines field behind, anime.js chip
 * entrance staggered from center, peelable SVG stickers scattered on the edges.
 */

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { skillGroups } from "@/data/content";
import { useIsWeird } from "@/lib/mode-store";
import WeirdOnly from "@/components/WeirdOnly";
import SectionHeader from "@/components/SectionHeader";
import MagnetLines from "@/components/reactbits/MagnetLines";
import StickerPeel from "@/components/reactbits/StickerPeel";

/* ----------------------------------------------------------------------- */
/* Inline SVG sticker generator — data URIs so StickerPeel gets an imageSrc. */
/* Weird-only decoration, so archive colors are baked in (no token swap).    */
/* ----------------------------------------------------------------------- */

function stickerDataUri(
  text: string,
  sub: string,
  bg: string,
  fg: string
): string {
  const w = 220;
  const h = 88;
  // SVGs loaded via <img> can't reach page webfonts — generic monospace only.
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="14" fill="${bg}"/>` +
    `<rect x="11" y="11" width="${w - 22}" height="${h - 22}" rx="9" fill="none" stroke="${fg}" stroke-width="2" stroke-dasharray="7 5"/>` +
    `<text x="${w / 2}" y="${h / 2 - 6}" text-anchor="middle" dominant-baseline="central" font-family="monospace" font-size="21" font-weight="700" letter-spacing="3" fill="${fg}">${text}</text>` +
    `<text x="${w / 2}" y="${h - 24}" text-anchor="middle" font-family="monospace" font-size="9" letter-spacing="2.5" fill="${fg}" opacity="0.72">${sub}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

type StickerSpec = {
  id: string;
  src: string;
  /** positional classes on StickerPeel's absolute root */
  className: string;
  rotate: number;
  width: number;
};

const INK = "#101322"; // specimen surface
const BONE = "#EFEAE3";
const HAZARD = "#FF4D00";
const ULTRAVIOLET = "#6E4BFF";

const STICKERS: StickerSpec[] = [
  {
    id: "angular",
    src: stickerDataUri("ANGULAR", "DAY JOB", ULTRAVIOLET, BONE),
    className: "left-[2%] top-[10%]",
    rotate: -7,
    width: 138,
  },
  {
    id: "nodejs",
    src: stickerDataUri("NODE.JS", "NON-BLOCKING", INK, HAZARD),
    className: "right-[3%] top-[24%]",
    rotate: 6,
    width: 146,
  },
  {
    id: "genai",
    src: stickerDataUri("GEN-AI", "SUPERVISED", ULTRAVIOLET, BONE),
    className: "left-[4%] bottom-[10%]",
    rotate: 5,
    width: 128,
  },
  {
    id: "docker",
    src: stickerDataUri("DOCKER", "SHIPS ANYWHERE", INK, HAZARD),
    className: "right-[5%] bottom-[18%]",
    rotate: -5,
    width: 142,
  },
];

/* ----------------------------------------------------------------------- */

/** Boring-mode / SSR background: faint static grid, no motion. */
const staticGrid = (
  <div
    className="absolute inset-0 opacity-60"
    style={{
      backgroundImage:
        "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
      backgroundSize: "88px 88px",
    }}
  />
);

export default function Instruments(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isWeird = useIsWeird();

  const [inView, setInView] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  /* Track viewport size — MagnetLines density + sticker layer gating. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* One observer: mounts MagnetLines only while visible (its pointermove
     handler thrashes layout otherwise) and gates the entrance animation. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Entrance (weird only, plays once): chips rise + settle, staggered from
     center. anime.js sets from-values only when it actually runs, so the
     committed CSS state stays fully visible (rule 2). */
  const playedRef = useRef(false);
  useEffect(() => {
    if (!isWeird || !inView || playedRef.current) return;
    const root = sectionRef.current;
    if (!root) return;
    const chips = root.querySelectorAll<HTMLElement>(".instrument-chip");
    if (!chips.length) return;
    playedRef.current = true;

    const anim = animate(chips, {
      opacity: [0, 1],
      translateY: [24, 0],
      rotate: [-4, 0],
      delay: stagger(28, { from: "center" }),
      ease: "outQuad",
      duration: 520,
    });

    return () => {
      // Cancel mid-flight and strip inline styles → chips readable again.
      anim.revert();
    };
  }, [isWeird, inView]);

  return (
    <section
      ref={sectionRef}
      id="instruments"
      className="relative overflow-hidden px-6 md:px-12 lg:px-20 py-24 md:py-36"
    >
      {/* Full-bleed background — decorative only. MagnetLines listens on the
          window pointer, so the layer stays pointer-events-none. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <WeirdOnly fallback={staticGrid}>
          {inView ? (
            <MagnetLines
              rows={isDesktop ? 8 : 10}
              columns={isDesktop ? 12 : 7}
              containerSize="100%"
              lineColor="rgba(239,234,227,0.14)"
              lineWidth="2px"
              lineHeight="2.4vmin"
              baseAngle={-10}
              className="h-full w-full"
            />
          ) : null}
        </WeirdOnly>
      </div>

      {/* Foreground content — complete and readable in both modes. */}
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <SectionHeader index="03" name="INSTRUMENTS" stamp="LAB EQUIPMENT" />

        <div className="border-y border-line">
          {skillGroups.map((group, gi) => (
            <div
              key={group.label}
              className="border-t border-line py-8 first:border-t-0 md:grid md:grid-cols-[220px_1fr] md:items-start md:gap-8"
            >
              <h3 className="specimen-label mb-4 md:mb-0 md:pt-1.5">
                <span className="text-ultraviolet">
                  GRP-{String(gi + 1).padStart(2, "0")}
                </span>{" "}
                {group.label}{" "}
                <span className="opacity-50">
                  / {String(group.items.length).padStart(2, "0")}
                </span>
              </h3>
              <ul className="flex flex-wrap gap-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    data-cursor="INSPECT"
                    className="instrument-chip border border-line-strong bg-specimen px-3 py-1.5 text-sm font-[family-name:var(--font-space-mono)] transition-colors duration-150 hover:border-hazard hover:text-hazard"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="specimen-label mt-8 opacity-60">
          ALL EQUIPMENT FIELD-TESTED. HANDLE WITH CURIOSITY.
        </p>
      </div>

      {/* Peelable stickers — weird mode, desktop only. The layer spans the
          section so it doubles as each sticker's Draggable bounds; it stays
          pointer-events-none while stickers opt back in. */}
      <WeirdOnly>
        {isDesktop ? (
          <div
            aria-hidden="true"
            data-cursor="DRAG"
            className="pointer-events-none absolute inset-0 z-20"
          >
            {STICKERS.map((s) => (
              <StickerPeel
                key={s.id}
                imageSrc={s.src}
                rotate={s.rotate}
                width={s.width}
                peelBackHoverPct={26}
                peelBackActivePct={38}
                shadowIntensity={0.5}
                lightingIntensity={0.08}
                className={`pointer-events-auto ${s.className}`}
              />
            ))}
          </div>
        ) : null}
      </WeirdOnly>
    </section>
  );
}
