"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { animate, svg as animeSvg, utils as animeUtils } from "animejs";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { incidents, countUpStats } from "@/data/content";
import { useIsWeird } from "@/lib/mode-store";
import SectionHeader from "@/components/SectionHeader";
import WeirdOnly from "@/components/WeirdOnly";
import CountUp from "@/components/reactbits/CountUp";

/* ------------------------------------------------------------------ */
/* Spine geometry                                                      */
/* ------------------------------------------------------------------ */

const NODE_R = 5;
const KINK_H = 24; // vertical span of the zigzag above each node
const KINK_AMP = 8; // horizontal amplitude of the zigzag

type SpineNode = {
  y: number;
  /** fraction of total path length at which the spine reaches this node */
  t: number;
};

type SpineGeom = {
  d: string;
  x: number;
  width: number;
  height: number;
  nodes: SpineNode[];
};

/** Build a vertical path with a small zigzag kink ending at each node. */
function buildSpine(width: number, height: number, ys: number[]): SpineGeom {
  const x = Math.round(width / 2);
  const dist = (dx: number, dy: number) => Math.sqrt(dx * dx + dy * dy);

  let d = `M ${x} 0`;
  let len = 0;
  let prevY = 0;
  const nodes: SpineNode[] = [];
  const nodeLens: number[] = [];

  for (const rawY of ys) {
    const y = Math.max(rawY, prevY + KINK_H);
    const kinkTop = y - KINK_H;
    // straight drop to the top of the kink
    d += ` L ${x} ${kinkTop}`;
    len += Math.max(0, kinkTop - prevY);
    // zigzag: right, hard left, back to center at the node
    const y1 = kinkTop + KINK_H / 3;
    const y2 = kinkTop + (2 * KINK_H) / 3;
    d += ` L ${x + KINK_AMP} ${y1}`;
    len += dist(KINK_AMP, KINK_H / 3);
    d += ` L ${x - KINK_AMP} ${y2}`;
    len += dist(2 * KINK_AMP, KINK_H / 3);
    d += ` L ${x} ${y}`;
    len += dist(KINK_AMP, KINK_H / 3);
    nodeLens.push(len);
    nodes.push({ y, t: 0 });
    prevY = y;
  }

  // run out to the bottom of the container
  d += ` L ${x} ${height}`;
  len += Math.max(0, height - prevY);

  nodes.forEach((n, i) => {
    n.t = len > 0 ? nodeLens[i] / len : 1;
  });

  return { d, x, width, height, nodes };
}

/** Layout-space top offset (ignores transforms, unlike gBCR). */
function layoutTop(el: HTMLElement, ancestor: HTMLElement): number {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Incidents() {
  const isWeird = useIsWeird();
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const spineColRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);

  const [spine, setSpine] = useState<SpineGeom | null>(null);

  /* ---- measure chip positions → spine path -------------------------- */
  const measure = useCallback(() => {
    const wrap = timelineRef.current;
    const col = spineColRef.current;
    if (!wrap || !col) return;
    const chips = Array.from(
      wrap.querySelectorAll<HTMLElement>("[data-incident-chip]")
    );
    const ys = chips.map(
      (chip) => layoutTop(chip, wrap) + chip.offsetHeight / 2
    );
    const geom = buildSpine(col.offsetWidth, wrap.offsetHeight, ys);
    setSpine((prev) =>
      prev && prev.d === geom.d && prev.height === geom.height ? prev : geom
    );
  }, []);

  useLayoutEffect(() => {
    measure();
    const wrap = timelineRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [measure]);

  /* ---- weird: scrub-draw the spine + pop nodes ----------------------- */
  useEffect(() => {
    if (!isWeird || !spine) return;
    const pathEl = pathRef.current;
    const wrap = timelineRef.current;
    if (!pathEl || !wrap) return;

    const nodeEls = nodeRefs.current.filter(
      (el): el is SVGCircleElement => el !== null
    );
    const [drawable] = animeSvg.createDrawable(pathEl); // starts at draw "0 0"
    nodeEls.forEach((el) => el.setAttribute("r", "0"));
    const popped: boolean[] = new Array(nodeEls.length).fill(false);

    const applyProgress = (p: number) => {
      drawable.setAttribute("draw", `0 ${p}`);
      spine.nodes.forEach((n, i) => {
        const el = nodeEls[i];
        if (!el) return;
        if (p >= n.t && !popped[i]) {
          popped[i] = true;
          animeUtils.remove(el);
          animate(el, { r: [0, NODE_R], duration: 500, ease: "outBack(2.2)" });
        } else if (p < n.t && popped[i]) {
          popped[i] = false;
          animeUtils.remove(el);
          animate(el, { r: 0, duration: 200, ease: "outQuad" });
        }
      });
    };

    let st: ScrollTrigger | undefined;
    const ctx = gsap.context(() => {
      st = ScrollTrigger.create({
        trigger: wrap,
        start: "top 75%",
        end: "bottom 60%",
        scrub: 0.6,
        onUpdate: (self) => applyProgress(self.progress),
      });
    }, sectionRef);
    // sync to wherever the page already is (mode toggles mid-scroll)
    if (st) applyProgress(st.progress);

    return () => {
      ctx.revert();
      animeUtils.remove(nodeEls);
      // restore the pristine fully-drawn committed state
      pathEl.removeAttribute("stroke-dasharray");
      pathEl.removeAttribute("stroke-dashoffset");
      pathEl.removeAttribute("pathLength");
      pathEl.style.strokeLinecap = "";
      nodeEls.forEach((el) => el.setAttribute("r", `${NODE_R}`));
    };
  }, [isWeird, spine]);

  /* ---- weird: entries fade/rise on scroll ---------------------------- */
  useEffect(() => {
    if (!isWeird) return;
    const ctx = gsap.context(() => {
      gsap
        .utils.toArray<HTMLElement>("[data-incident-entry]")
        .forEach((entry) => {
          gsap.from(entry, {
            y: 44,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: entry, start: "top 85%" },
          });
        });
    }, sectionRef);
    return () => ctx.revert();
  }, [isWeird]);

  /* ------------------------------------------------------------------ */

  return (
    <section
      id="incidents"
      ref={sectionRef}
      className="relative px-6 md:px-12 lg:px-20 py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          index="05"
          name="TIMELINE OF INCIDENTS"
          stamp="CHAIN OF CUSTODY"
        />

        {/* ---- timeline: spine column + entries ---- */}
        <div ref={timelineRef} className="relative flex">
          {/* spine column */}
          <div
            ref={spineColRef}
            aria-hidden="true"
            className="relative w-10 shrink-0 md:w-16"
          >
            {spine ? (
              <svg
                aria-hidden="true"
                className="absolute left-0 top-0"
                width={spine.width}
                height={spine.height}
                viewBox={`0 0 ${spine.width} ${spine.height}`}
                fill="none"
              >
                <path
                  ref={pathRef}
                  d={spine.d}
                  stroke="var(--hazard)"
                  strokeWidth="2"
                />
                {spine.nodes.map((n, i) => (
                  <circle
                    key={i}
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    cx={spine.x}
                    cy={n.y}
                    r={NODE_R}
                    fill="var(--ink)"
                    stroke="var(--hazard)"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            ) : (
              // pre-measure / SSR fallback: plain vertical line
              <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line-strong" />
            )}
          </div>

          {/* entries */}
          <ol className="min-w-0 flex-1 list-none">
            {incidents.map((incident) => (
              <li key={incident.year}>
                <article
                  data-incident-entry
                  data-cursor="INSPECT"
                  className="border-b border-line py-10 last:border-b-0 md:py-16"
                >
                  <span
                    data-incident-chip
                    className="inline-block border border-hazard px-2.5 py-1 font-[family-name:var(--font-space-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-hazard"
                  >
                    {incident.year}
                  </span>
                  <h3 className="mt-5 font-[family-name:var(--font-bricolage)] text-3xl font-bold uppercase tracking-tight md:text-5xl">
                    {incident.title}
                  </h3>
                  <p className="mt-4 max-w-2xl opacity-80">{incident.detail}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>

        {/* ---- stats row ---- */}
        <div className="mt-16 md:mt-24">
          <p className="specimen-label mb-4">CUMULATIVE EXPOSURE READINGS</p>
          <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
            {countUpStats.map((stat) => (
              <div key={stat.label} className="bg-ink px-5 py-8 md:py-10">
                <p className="font-[family-name:var(--font-bricolage)] text-4xl font-bold tracking-tight md:text-6xl">
                  {Number.isFinite(stat.value) ? (
                    <>
                      <WeirdOnly fallback={<span>{stat.value}</span>}>
                        <CountUp to={stat.value} duration={1.8} />
                      </WeirdOnly>
                      <span className="opacity-60">{stat.suffix}</span>
                    </>
                  ) : (
                    <WeirdOnly fallback={<span className="text-taxi">∞</span>}>
                      <span
                        className="text-taxi"
                        style={{
                          textShadow:
                            "0 0 18px color-mix(in srgb, var(--taxi) 50%, transparent)",
                        }}
                      >
                        ∞
                      </span>
                    </WeirdOnly>
                  )}
                </p>
                <p className="specimen-label mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
