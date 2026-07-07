"use client";

/**
 * SECTION 04 — EXHIBITS + CLASSIFIED (the work).
 * Exhibits: side projects as archive files behind cut-here dashed borders.
 * Classified: enterprise work, descriptions under redaction bars that
 * decrypt on hover. Boring mode renders everything as plain readable cards.
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { gsap, ScrollTrigger, SCRAMBLE_CHARS } from "@/lib/gsap";
import WeirdOnly from "@/components/WeirdOnly";
import SectionHeader from "@/components/SectionHeader";
import ScrollVelocity from "@/components/reactbits/ScrollVelocity";
import GlareHover from "@/components/reactbits/GlareHover";
import DecryptedText from "@/components/reactbits/DecryptedText";
import {
  exhibits,
  classified,
  classifiedFootnote,
  type Exhibit,
  type ClassifiedFile,
} from "@/data/content";

const MONO = "font-[family-name:var(--font-space-mono)]";
const DISPLAY = "font-[family-name:var(--font-bricolage)]";

/** Shared GlareHover config — subtle bone glare sweep, no layout opinions. */
const GLARE_PROPS = {
  width: "100%",
  height: "100%",
  background: "transparent",
  borderRadius: "0px",
  borderColor: "transparent",
  glareColor: "#EFEAE3",
  glareOpacity: 0.12,
  glareAngle: -35,
  glareSize: 260,
  transitionDuration: 700,
} as const;

const SPRING = { type: "spring", stiffness: 300, damping: 24 } as const;

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

/**
 * Per-card entrance: clip-path wipe (alternating direction), once, on scroll.
 * Only mounted in weird mode, so the committed CSS state stays fully visible
 * everywhere else; ctx.revert() cleans up on unmount / mode flip.
 */
function useClipReveal(fromLeft: boolean) {
  const clipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = clipRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          clipPath: fromLeft ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)",
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.9,
          ease: "power3.inOut",
          clearProps: "clipPath",
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [fromLeft]);

  return clipRef;
}

/* ------------------------------------------------------------------ */
/* velocity headings (weird + desktop only)                            */
/* ------------------------------------------------------------------ */

/**
 * Giant outlined marquee that reacts to scroll velocity, with a gentle
 * skew kick on fast scrolls. Pauses (unmounts the rAF marquee) offscreen.
 */
function VelocityHeading({
  text,
  velocity,
}: {
  text: string;
  velocity: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // Pause the marquee's rAF loop when the heading is far offscreen.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setActive(entry.isIntersecting);
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Skew the whole band with scroll velocity, easing back to level.
  useEffect(() => {
    if (!active) return;
    const el = wrapRef.current;
    if (!el) return;
    let leveler: ReturnType<typeof gsap.to> | null = null;
    const ctx = gsap.context(() => {
      const proxy = { skew: 0 };
      const setter = gsap.quickSetter(el, "skewX", "deg");
      const clampSkew = gsap.utils.clamp(-6, 6);
      ScrollTrigger.create({
        onUpdate(self) {
          const target = clampSkew(self.getVelocity() / -350);
          if (Math.abs(target) > Math.abs(proxy.skew)) {
            proxy.skew = target;
            leveler = gsap.to(proxy, {
              skew: 0,
              duration: 0.7,
              ease: "power3.out",
              overwrite: true,
              onUpdate: () => setter(proxy.skew),
            });
          }
        },
      });
    }, el);
    return () => {
      leveler?.kill();
      gsap.set(el, { skewX: 0 });
      ctx.revert();
    };
  }, [active]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="-mx-6 mb-10 select-none md:-mx-12 md:mb-14 lg:-mx-20"
      style={{ minHeight: "calc(9.5vw + 1rem)", transformOrigin: "50% 50%" }}
    >
      {active ? (
        <ScrollVelocity
          texts={[text]}
          velocity={velocity}
          numCopies={6}
          className={`text-stroke ${DISPLAY} font-bold uppercase tracking-[-0.03em] text-[8vw] leading-[1.15]`}
          parallaxClassName="w-full py-2"
          scrollerClassName="items-baseline"
        />
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* exhibit cards                                                       */
/* ------------------------------------------------------------------ */

/** Card anatomy shared by boring and weird variants. */
function ExhibitBody({ exhibit }: { exhibit: Exhibit }) {
  return (
    <div className="w-full p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="specimen-label">{exhibit.fileNo}</span>
        <span className="specimen-label">
          CLASS: {exhibit.clazz} · STATUS: {exhibit.status}
        </span>
      </div>
      <h3
        className={`${DISPLAY} mt-4 text-2xl font-bold uppercase leading-[1.05] tracking-[-0.02em] md:text-3xl xl:text-4xl`}
      >
        {exhibit.title}
      </h3>
      <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed opacity-80">
        {exhibit.description}
      </p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {exhibit.stack.map((item) => (
          <li
            key={item}
            className={`${MONO} border border-line px-2 py-1 text-[0.625rem] uppercase tracking-[0.12em] opacity-80`}
          >
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <a
          href={exhibit.repo}
          target="_blank"
          rel="noreferrer"
          data-cursor="INSPECT"
          className={`${MONO} text-xs tracking-[0.16em] text-hazard underline-offset-4 hover:underline`}
        >
          VIEW EVIDENCE ↗
        </a>
      </div>
    </div>
  );
}

function BoringExhibitCard({
  exhibit,
  index,
}: {
  exhibit: Exhibit;
  index: number;
}) {
  return (
    <article
      className="cut-here bg-specimen"
      style={{ transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)` }}
    >
      <ExhibitBody exhibit={exhibit} />
    </article>
  );
}

function WeirdExhibitCard({
  exhibit,
  index,
}: {
  exhibit: Exhibit;
  index: number;
}) {
  const fromLeft = index % 2 === 0;
  const clipRef = useClipReveal(fromLeft);

  return (
    <motion.article
      data-cursor="INSPECT"
      className="cut-here bg-specimen"
      style={{ rotate: fromLeft ? -1 : 1 }}
      whileHover={{ rotate: 0, scale: 1.015 }}
      transition={SPRING}
    >
      <div ref={clipRef}>
        <GlareHover {...GLARE_PROPS}>
          <ExhibitBody exhibit={exhibit} />
        </GlareHover>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* classified cards                                                    */
/* ------------------------------------------------------------------ */

function ClassifiedStamp() {
  return (
    <span
      className="stamp absolute -right-2 -top-4 z-10"
      style={{ transform: "rotate(6deg)" }}
    >
      CLASSIFIED
    </span>
  );
}

function ClassifiedTitle({ file }: { file: ClassifiedFile }) {
  return (
    <>
      <span className="specimen-label">{file.fileNo}</span>
      <h4
        className={`${DISPLAY} mt-3 text-xl font-bold uppercase leading-[1.1] tracking-[-0.02em] md:text-2xl`}
      >
        {file.title}
      </h4>
    </>
  );
}

function BoringClassifiedCard({
  file,
  index,
}: {
  file: ClassifiedFile;
  index: number;
}) {
  return (
    <article
      className="cut-here relative bg-specimen"
      style={{ transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)` }}
    >
      <ClassifiedStamp />
      <div className="w-full p-6 md:p-8">
        <ClassifiedTitle file={file} />
        {/* boring mode: plain description — never hide content */}
        <p className="mt-3 text-sm leading-relaxed opacity-80">
          {file.description}
        </p>
      </div>
    </article>
  );
}

function WeirdClassifiedCard({
  file,
  index,
}: {
  file: ClassifiedFile;
  index: number;
}) {
  const fromLeft = index % 2 === 0;
  const clipRef = useClipReveal(fromLeft);
  // Bars off = declassified. Hover starts DecryptedText's own scramble;
  // keyboard focus reveals the plain text (no animation, still readable).
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.article
      data-cursor="INSPECT"
      className="cut-here relative bg-specimen"
      style={{ rotate: fromLeft ? -1 : 1 }}
      whileHover={{ rotate: 0, scale: 1.015 }}
      transition={SPRING}
    >
      <ClassifiedStamp />
      <div ref={clipRef}>
        <GlareHover {...GLARE_PROPS}>
          <div className="w-full p-6 md:p-8">
            <ClassifiedTitle file={file} />
            <div
              className="mt-3"
              tabIndex={0}
              onMouseEnter={() => setRevealed(true)}
              onMouseLeave={() => setRevealed(false)}
              onFocus={() => setRevealed(true)}
              onBlur={() => setRevealed(false)}
            >
              <DecryptedText
                text={file.description}
                animateOn="hover"
                speed={16}
                maxIterations={12}
                characters={SCRAMBLE_CHARS}
                parentClassName={`${MONO} text-xs leading-relaxed`}
                className={revealed ? "opacity-90" : "redaction"}
                encryptedClassName={revealed ? "text-ultraviolet" : "redaction"}
              />
            </div>
          </div>
        </GlareHover>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* static headings (boring / mobile)                                   */
/* ------------------------------------------------------------------ */

function StaticExhibitsHeading() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <SectionHeader index="04" name="EXHIBITS" />
    </div>
  );
}

function StaticClassifiedHeading() {
  return (
    <div className="mx-auto mb-10 max-w-[1400px]">
      <h3 className={`${MONO} text-sm uppercase tracking-[0.2em]`}>
        CLASSIFIED — FIELD WORK
      </h3>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* section                                                             */
/* ------------------------------------------------------------------ */

export default function Exhibits() {
  const isDesktop = useIsDesktop();

  return (
    <section
      id="exhibits"
      className="relative px-6 md:px-12 lg:px-20 py-24 md:py-36"
    >
      <h2 className="sr-only">Exhibits — independent projects</h2>

      {/* EXHIBITS header: velocity marquee in weird mode (desktop) */}
      <WeirdOnly fallback={<StaticExhibitsHeading />}>
        {isDesktop ? (
          <VelocityHeading text="EXHIBITS ✱" velocity={80} />
        ) : (
          <StaticExhibitsHeading />
        )}
      </WeirdOnly>

      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-8 lg:grid-cols-2">
          {exhibits.map((exhibit, i) => (
            <WeirdOnly
              key={exhibit.fileNo}
              fallback={<BoringExhibitCard exhibit={exhibit} index={i} />}
            >
              <WeirdExhibitCard exhibit={exhibit} index={i} />
            </WeirdOnly>
          ))}
        </div>

        <div
          aria-hidden="true"
          className="asterisk-divider my-20 text-sm md:my-28"
        >
          <span className="tracking-[0.35em]">✱ ✱ ✱</span>
        </div>
      </div>

      {/* CLASSIFIED header: opposite-direction marquee in weird mode */}
      <WeirdOnly fallback={<StaticClassifiedHeading />}>
        {isDesktop ? (
          <>
            <h3 className="sr-only">CLASSIFIED — FIELD WORK</h3>
            <VelocityHeading text="CLASSIFIED ✱" velocity={-80} />
          </>
        ) : (
          <StaticClassifiedHeading />
        )}
      </WeirdOnly>

      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {classified.map((file, i) => (
            <WeirdOnly
              key={file.fileNo}
              fallback={<BoringClassifiedCard file={file} index={i} />}
            >
              <WeirdClassifiedCard file={file} index={i} />
            </WeirdOnly>
          ))}
        </div>

        <p
          className={`${MONO} mt-10 text-xs uppercase tracking-[0.16em] opacity-60`}
        >
          {classifiedFootnote}
        </p>
      </div>
    </section>
  );
}
