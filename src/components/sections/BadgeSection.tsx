"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { badge, identity } from "@/data/content";
import { useIsWeird } from "@/lib/mode-store";
import { usePerfTier } from "@/lib/perf";

/**
 * SECTION 06 — THE BADGE.
 * A physics lanyard toy (React Bits Lanyard: rapier + meshline). The 3D scene
 * is heavy, so it only mounts when: weird mode AND viewport >= 768px AND the
 * section is within ~1.5 viewports. Everywhere else (boring mode, mobile,
 * SSR, loading) the StaticBadge fallback renders — a real <img> with real alt
 * text, so the content exists in the DOM in both modes.
 */

// No loading fallback here — BadgeSection keeps a StaticBadge underlay
// visible until the scene reports onReady, covering chunk + asset loading.
const Lanyard = dynamic(() => import("@/components/reactbits/Lanyard"), {
  ssr: false,
});

/** Local styles: fallback swing keyframe + height override for the Lanyard
 *  root (its own wrapper is h-screen; we confine it to the 70svh stage). */
const BADGE_CSS = `
@keyframes badge-static-swing {
  0%, 100% { transform: rotate(2deg); }
  50% { transform: rotate(-2deg); }
}
html[data-mode="weird"] .badge-swing {
  animation: badge-static-swing 5s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  html[data-mode="weird"] .badge-swing { animation: none; }
}
#badge .badge-lanyard-mount > div {
  height: 100% !important;
}
`;

/** Fallback for mobile + boring mode + while the 3D chunk loads. */
function StaticBadge({ flipped = false }: { flipped?: boolean }) {
  return (
    <div className="flex h-full w-full flex-col items-center overflow-hidden">
      <div
        className="badge-swing flex flex-col items-center"
        style={{ transformOrigin: "50% 0%" }}
      >
        {/* thin CSS strap the badge hangs from */}
        <div
          aria-hidden="true"
          className="h-20 w-[2px] bg-gradient-to-b from-bone/50 to-hazard md:h-28"
        />
        {/* two-faced card that flips in CSS 3D */}
        <div style={{ perspective: "1200px" }}>
          <div
            className="relative transition-transform duration-700 [transform-style:preserve-3d]"
            style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/lanyard/badge-front.png"
              alt="Specimen badge: SYED ABDUL KAREEM, forward deployed engineer, archive №13, QR code to GitHub"
              className="w-[280px] rotate-[-3deg] border border-line-strong shadow-2xl [backface-visibility:hidden] md:w-[320px]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/lanyard/badge-back.png"
              alt="Badge reverse: SYD/13, stamped APPROVED-ISH, if found return to the internet"
              className="absolute inset-0 h-full w-full rotate-[3deg] border border-line-strong shadow-2xl [backface-visibility:hidden]"
              style={{ transform: "rotateY(180deg)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BadgeSection() {
  const isWeird = useIsWeird();
  const perfTier = usePerfTier();
  // true once the 3D scene's assets have resolved and it is actually drawing
  const [sceneReady, setSceneReady] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [near, setNear] = useState<boolean>(false);
  const [staticFlipped, setStaticFlipped] = useState<boolean>(false);

  // viewport >= 768px, kept live so shrinking the window drops the 3D scene
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Mount the heavy chunk once the section is within ~1 viewport, and track
  // live visibility so we can PAUSE the render loop when scrolled away (the
  // 3D physics runs continuously otherwise, burning CPU/GPU across the whole
  // page). Keep it mounted once loaded — re-initialising rapier is costlier
  // than a paused canvas.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const near = entries.some((entry) => entry.isIntersecting);
        setVisible(near);
        if (near) setNear(true);
      },
      { rootMargin: "60% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 3D on capable viewports — the Lanyard self-tunes below 768px (lower DPR,
  // coarser physics timestep). Weak devices skip rapier entirely and keep the
  // static (still flippable) badge, so the page never chugs on the toy.
  const showLanyard = isWeird && near && perfTier === "high";

  // WebGL contexts can be reclaimed by the browser under GPU pressure; when
  // that happens the canvas freezes empty. Remount the scene (max 3 times).
  const [glGeneration, setGlGeneration] = useState<number>(0);
  useEffect(() => {
    if (!showLanyard) return;
    const el = sectionRef.current;
    if (!el) return;
    const onLost = (event: Event) => {
      event.preventDefault();
      window.setTimeout(() => {
        setGlGeneration((generation) =>
          generation < 3 ? generation + 1 : generation
        );
      }, 500);
    };
    // capture: the event fires on the canvas, which mounts later
    el.addEventListener("webglcontextlost", onLost, true);
    return () => el.removeEventListener("webglcontextlost", onLost, true);
  }, [showLanyard]);

  return (
    <section
      id="badge"
      ref={sectionRef}
      className="relative min-h-[100svh] px-6 py-24 md:px-12 md:py-36 lg:px-20"
    >
      <style>{BADGE_CSS}</style>

      <div className="mx-auto flex max-w-[1400px] flex-col">
        <header className="text-center">
          <h2 className="font-[family-name:var(--font-bricolage)] text-[clamp(2.4rem,7vw,6rem)] font-bold uppercase leading-[0.95] tracking-tight">
            {badge.headline}
          </h2>
          <p className="mt-4 font-[family-name:var(--font-space-mono)] text-xs tracking-[0.14em] opacity-70 md:text-sm">
            {badge.subline}
          </p>
        </header>

        {/* the stage — Lanyard also listens for the "archive-yank" window
            event fired by the command palette; wiring lives inside it */}
        <div
          data-cursor="YANK"
          className="relative mt-6 h-[70svh] min-h-[480px]"
        >
          {showLanyard ? (
            <>
              {/* underlay: never show a blank stage — the static badge holds
                  the fort until the GLB/textures are genuinely rendering */}
              {!sceneReady && (
                <div className="absolute inset-0">
                  <StaticBadge flipped={staticFlipped} />
                </div>
              )}
              <div
                aria-hidden="true"
                className="badge-lanyard-mount absolute inset-0 [touch-action:pan-y]"
              >
                <Lanyard
                  key={glGeneration}
                  active={visible}
                  onReady={() => setSceneReady(true)}
                  frontImage="/assets/lanyard/badge-front.png"
                  backImage="/assets/lanyard/badge-back.png"
                  lanyardImage="/assets/lanyard/strap.png"
                  imageFit="cover"
                  transparent
                  position={isDesktop ? [0, 0, 13] : [0, 0, 15]}
                  fov={isDesktop ? 24 : 26}
                />
              </div>
            </>
          ) : (
            <StaticBadge flipped={staticFlipped} />
          )}
        </div>

        {/* card contents as real text + real link, present in both modes */}
        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <button
            type="button"
            data-cursor="INSPECT"
            onClick={() => {
              if (showLanyard) {
                window.dispatchEvent(new Event("archive-flip"));
              } else {
                setStaticFlipped((f) => !f);
              }
            }}
            className="border border-hazard px-5 py-2.5 font-[family-name:var(--font-space-mono)] text-xs tracking-[0.2em] text-hazard uppercase transition-colors hover:bg-hazard hover:text-ink"
          >
            FLIP THE CARD ⟲
          </button>
          <p className="specimen-label">{badge.cardLines.join(" · ")}</p>
          <a
            href={badge.qrTarget}
            target="_blank"
            rel="noreferrer"
            data-cursor="INSPECT"
            className="font-[family-name:var(--font-space-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-hazard underline underline-offset-4"
          >
            QR RESOLVES TO: GITHUB/{identity.githubHandle}
          </a>
        </div>
      </div>

      <p className="specimen-label pointer-events-none absolute bottom-8 left-6 md:left-12 lg:left-20">
        EXHIBIT: PHYSICS · RAPIER ENGINE · DRAG TO SWING
      </p>
    </section>
  );
}
