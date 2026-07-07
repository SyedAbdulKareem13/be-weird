"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { badge, identity } from "@/data/content";
import { useIsWeird } from "@/lib/mode-store";

/**
 * SECTION 06 — THE BADGE.
 * A physics lanyard toy (React Bits Lanyard: rapier + meshline). The 3D scene
 * is heavy, so it only mounts when: weird mode AND viewport >= 768px AND the
 * section is within ~1.5 viewports. Everywhere else (boring mode, mobile,
 * SSR, loading) the StaticBadge fallback renders — a real <img> with real alt
 * text, so the content exists in the DOM in both modes.
 */

const Lanyard = dynamic(() => import("@/components/reactbits/Lanyard"), {
  ssr: false,
  loading: () => <StaticBadge />,
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
function StaticBadge() {
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/lanyard/badge-front.png"
          alt="Specimen badge: SYED ABDUL KAREEM, full stack developer, archive №13, QR code to GitHub"
          className="w-[260px] rotate-[-3deg] border border-line-strong shadow-2xl md:w-[300px]"
        />
      </div>
    </div>
  );
}

export default function BadgeSection() {
  const isWeird = useIsWeird();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [near, setNear] = useState<boolean>(false);

  // viewport >= 768px, kept live so shrinking the window drops the 3D scene
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // mount the heavy chunk only once the section is within ~1.5 viewports
  useEffect(() => {
    if (near) return;
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  const showLanyard = isWeird && isDesktop && near;

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
            <div
              aria-hidden="true"
              className="badge-lanyard-mount absolute inset-0"
            >
              <Lanyard
                frontImage="/assets/lanyard/badge-front.png"
                backImage="/assets/lanyard/badge-back.png"
                lanyardImage="/assets/lanyard/strap.png"
                imageFit="cover"
                transparent
                position={[0, 0, 24]}
                fov={22}
              />
            </div>
          ) : (
            <StaticBadge />
          )}
        </div>

        {/* card contents as real text + real link, present in both modes */}
        <div className="mt-6 flex flex-col items-center gap-2 text-center">
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
