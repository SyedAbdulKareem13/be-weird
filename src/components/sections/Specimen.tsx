"use client";

/**
 * 01 — SPECIMEN (hero). TextPressure owns the viewport; BE WEIRD particle
 * typography hovers behind it; corner labels frame the specimen; CurvedLoop
 * caution ticker runs along the bottom edge.
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useIsWeird } from "@/lib/mode-store";
import { identity, heroLabels, tickerPhrases } from "@/data/content";
import WeirdOnly from "@/components/WeirdOnly";
import ParticleTypography from "@/components/fx/ParticleTypography";
import TextPressure from "@/components/reactbits/TextPressure";
import CurvedLoop from "@/components/reactbits/CurvedLoop";
import Magnet from "@/components/reactbits/Magnet";

function ISTClock() {
  const [time, setTime] = useState("--:-- IST");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(`${fmt.format(new Date())} IST`);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time}</span>;
}

export default function Specimen() {
  const isWeird = useIsWeird();
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Reveal the subline + CTA after the preloader announces "archive-ready".
  // Committed state is visible; we only hide inside the gated effect, with a
  // 3s failsafe in case the event was missed.
  useEffect(() => {
    if (!isWeird) return;
    const targets = [sublineRef.current, ctaRef.current].filter(Boolean);
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: 24 });
      let played = false;
      const reveal = () => {
        if (played) return;
        played = true;
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.15,
        });
      };
      window.addEventListener("archive-ready", reveal, { once: true });
      const failsafe = setTimeout(reveal, 3000);
      return () => {
        clearTimeout(failsafe);
        window.removeEventListener("archive-ready", reveal);
      };
    });
    return () => ctx.revert();
  }, [isWeird]);

  const tickerText = `⚠ ${tickerPhrases.join(" ⚠ ")} `;

  return (
    <section
      id="specimen"
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-6 pt-24 md:px-12 lg:px-20"
    >
      {/* top corner labels */}
      <p className="specimen-label absolute top-20 left-6 md:left-12 lg:left-20">
        {heroLabels.topLeft}
      </p>
      <p className="specimen-label absolute top-20 right-6 hidden text-right md:right-12 md:block lg:right-20">
        {heroLabels.topRight}
      </p>
      <span className="stamp absolute top-28 right-8 hidden rotate-6 md:inline-block lg:right-24">
        58% ORGANIC CODE
      </span>

      {/* everything below lives in flow — no layer can overlap another */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center">
        {/* particle BE WEIRD, its own band above the name */}
        <WeirdOnly>
          <div className="pointer-events-none h-[20vh] min-h-[140px] w-full">
            <ParticleTypography text="BE WEIRD" className="h-full w-full" />
          </div>
        </WeirdOnly>

        {/* the name — pressure type owns its band */}
        <div className="relative mt-2 h-[13vw] max-h-[300px] min-h-[100px] w-full md:mt-4">
          <WeirdOnly
            fallback={
              <h1 className="font-[family-name:var(--font-bricolage)] text-[clamp(2.5rem,9vw,7rem)] leading-none font-bold uppercase">
                {identity.name}
              </h1>
            }
          >
            <TextPressure
              text={identity.name}
              fontFamily="var(--font-flex)"
              fontUrl=""
              width
              weight
              italic
              flex
              alpha={false}
              stroke={false}
              scale={false}
              textColor="var(--bone)"
              minFontSize={30}
            />
          </WeirdOnly>
        </div>

        {/* subline + CTA */}
        <div className="mt-10 flex flex-col items-start gap-8 md:mt-12 md:flex-row md:items-end md:justify-between">
          <p
            ref={sublineRef}
            className="max-w-xl text-lg leading-relaxed opacity-90 md:text-xl"
          >
            {identity.heroSubline}
          </p>
          <div ref={ctaRef}>
            <Magnet padding={60} magnetStrength={3}>
              <a
                href="#field-notes"
                data-cursor="INSPECT"
                className="inline-block border border-hazard px-6 py-3 font-[family-name:var(--font-space-mono)] text-sm tracking-[0.2em] text-hazard uppercase transition-colors hover:bg-hazard hover:text-ink"
              >
                OPEN THE FILE ↓
              </a>
            </Magnet>
          </div>
        </div>
      </div>

      {/* bottom labels row, always clear of the ticker below */}
      <div className="mx-auto mt-10 flex w-full max-w-[1400px] items-end justify-between pb-3">
        <p className="specimen-label">{heroLabels.bottomLeft}</p>
        <p className="specimen-label text-right">
          <ISTClock />
        </p>
      </div>

      {/* caution ticker — last flow element, full-bleed */}
      <div className="-mx-6 md:-mx-12 lg:-mx-20">
        <WeirdOnly fallback={<hr className="border-line" />}>
          <div aria-hidden="true" className="text-hazard/80">
            <CurvedLoop
              marqueeText={tickerText}
              speed={1.5}
              curveAmount={26}
              direction="left"
              interactive
              className="fill-current"
            />
          </div>
        </WeirdOnly>
      </div>
    </section>
  );
}
