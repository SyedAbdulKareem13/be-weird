import Link from "next/link";
import type { CaseStudy } from "@/data/case-studies";

const MONO = "font-[family-name:var(--font-space-mono)]";
const DISPLAY = "font-[family-name:var(--font-bricolage)]";

/**
 * Long-form case file. Pure typography — token classes swap automatically in
 * boring mode, so the same page reads as archive dossier or clean document.
 */
export default function DossierPage({ study }: { study: CaseStudy }) {
  return (
    <article className="px-6 pt-28 pb-24 md:px-12 lg:px-20">
      <div className="mx-auto w-full max-w-[900px]">
        <Link
          href="/#exhibits"
          data-cursor="INSPECT"
          className={`${MONO} text-xs tracking-[0.16em] text-hazard uppercase underline-offset-4 hover:underline`}
        >
          ← RETURN TO THE ARCHIVE
        </Link>

        {/* file header */}
        <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-4">
          <span className="specimen-label">{study.fileNo}</span>
          <span className="specimen-label">
            CLASS: {study.classification} · STATUS: {study.status}
          </span>
        </div>

        <h1
          className={`${DISPLAY} mt-8 text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-bold tracking-[-0.02em] uppercase`}
        >
          {study.title}
        </h1>

        <p className="mt-6 max-w-[70ch] text-lg leading-relaxed opacity-90 md:text-xl">
          {study.oneLiner}
        </p>

        {/* actions */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {study.live ? (
            <a
              href={study.live}
              target="_blank"
              rel="noreferrer"
              data-cursor="INSPECT"
              className={`${MONO} inline-block border border-hazard bg-hazard px-5 py-2.5 text-xs font-bold tracking-[0.16em] text-ink uppercase transition-colors hover:bg-transparent hover:text-hazard`}
            >
              OPEN LIVE ↗
            </a>
          ) : null}
          <a
            href={study.repo}
            target="_blank"
            rel="noreferrer"
            data-cursor="INSPECT"
            className={`${MONO} text-xs tracking-[0.16em] text-hazard uppercase underline-offset-4 hover:underline`}
          >
            VIEW SOURCE ↗
          </a>
        </div>

        <div className="asterisk-divider mt-12 text-sm">✱ ✱ ✱</div>

        {/* sections */}
        <div className="mt-12 space-y-14">
          {study.sections.map((section) => (
            <section key={section.heading}>
              <h2
                className={`${MONO} text-xs font-bold tracking-[0.24em] text-hazard uppercase`}
              >
                {section.heading}
              </h2>
              <div className="mt-5 max-w-[72ch] space-y-5">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-[1.0325rem] leading-[1.8] opacity-90"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* stack */}
        <div className="mt-14 border-t border-line pt-8">
          <p className="specimen-label mb-4">EQUIPMENT USED</p>
          <ul className="flex flex-wrap gap-2">
            {study.stack.map((item) => (
              <li
                key={item}
                className={`${MONO} border border-line-strong bg-specimen px-3 py-1.5 text-[0.6875rem] tracking-[0.12em] uppercase`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* verdict */}
        <div className="mt-14 flex justify-center">
          <span className="stamp !rotate-[-2deg] text-xs">{study.verdict}</span>
        </div>
      </div>
    </article>
  );
}
