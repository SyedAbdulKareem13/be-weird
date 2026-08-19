"use client";

/**
 * 404 — THIS SPECIMEN ESCAPED. Weird sites deserve weird 404s.
 */

import Link from "next/link";
import WeirdOnly from "@/components/WeirdOnly";
import FuzzyText from "@/components/reactbits/FuzzyText";
import { escapeFootage } from "@/data/media";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center gap-8 overflow-hidden bg-ink px-6 text-center">
      {/* recovered containment footage — lights up once the asset lands */}
      {escapeFootage ? (
        <WeirdOnly>
          <div aria-hidden="true" className="absolute inset-0">
            <video
              src={escapeFootage.video}
              poster={escapeFootage.poster}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover opacity-25"
            />
            <span className="specimen-label absolute top-24 left-6 text-hazard">
              {escapeFootage.label} · REC ●
            </span>
          </div>
        </WeirdOnly>
      ) : null}

      <p className="specimen-label relative">FILE №404 · STATUS: MISSING</p>

      <WeirdOnly
        fallback={
          <h1 className="font-[family-name:var(--font-bricolage)] text-[clamp(6rem,22vw,14rem)] leading-none font-bold">
            404
          </h1>
        }
      >
        <FuzzyText
          fontSize="clamp(6rem, 22vw, 14rem)"
          fontWeight={900}
          fontFamily="var(--font-bricolage)"
          color="#EFEAE3"
          baseIntensity={0.18}
          hoverIntensity={0.5}
          enableHover
        >
          404
        </FuzzyText>
      </WeirdOnly>

      <h2 className="font-[family-name:var(--font-bricolage)] text-2xl font-bold tracking-wide uppercase md:text-4xl">
        THIS SPECIMEN ESCAPED.
      </h2>

      <p className="max-w-md text-sm opacity-70">
        The file you requested chewed through its restraints and left the
        archive. It was last seen heading toward the homepage.
      </p>

      <Link
        href="/"
        data-cursor="INSPECT"
        className="border border-hazard px-6 py-3 font-[family-name:var(--font-space-mono)] text-sm tracking-[0.2em] text-hazard uppercase transition-colors hover:bg-hazard hover:text-ink"
      >
        ← BACK TO THE ARCHIVE
      </Link>
    </main>
  );
}
