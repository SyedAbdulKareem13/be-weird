/**
 * BORING MODE — the professional document.
 * Rendered instead of the archive when the lever is pulled (or when
 * prefers-reduced-motion calms the site automatically). Consulting-grade:
 * serif masthead, navy accents, hairline rules, generous whitespace,
 * zero gimmicks. Server-safe — no hooks, no effects.
 */

import {
  identity,
  boringResume,
  exhibits,
  skillGroups,
} from "@/data/content";
import PrintButton from "@/components/PrintButton";

const NAVY = "text-[#1F4FD8]";
const RULE = "border-t border-[#16150F]/15";
const SERIF = "font-[family-name:var(--font-serif)]";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-baseline gap-4">
      <h2
        className={`${NAVY} shrink-0 text-[0.6875rem] font-semibold tracking-[0.22em] uppercase`}
      >
        {children}
      </h2>
      <div className={`${RULE} w-full translate-y-[-0.2em]`} />
    </div>
  );
}

export default function BoringResume() {
  return (
    <div
      data-boring-page
      className="px-6 pt-28 pb-20 text-[#16150F] md:pt-32"
    >
      <div className="mx-auto w-full max-w-[860px]">
        {/* masthead */}
        <header>
          <p className="text-[0.6875rem] font-medium tracking-[0.22em] text-[#16150F]/55 uppercase">
            Curriculum Vitae
          </p>
          <h1
            className={`${SERIF} mt-3 text-4xl leading-[1.05] font-semibold tracking-[-0.01em] md:text-5xl`}
          >
            {boringResume.name}
          </h1>
          <p className={`${NAVY} mt-3 text-base font-medium md:text-lg`}>
            {boringResume.headline}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-[#16150F]/70">
            <span>Hyderabad, India</span>
            <a
              href={`mailto:${identity.email}`}
              className={`${NAVY} underline-offset-4 hover:underline`}
            >
              {identity.email}
            </a>
            <span>{identity.phone}</span>
            <a
              href={identity.linkedin}
              target="_blank"
              rel="noreferrer"
              className={`${NAVY} underline-offset-4 hover:underline`}
            >
              LinkedIn ↗
            </a>
            <a
              href={identity.github}
              target="_blank"
              rel="noreferrer"
              className={`${NAVY} underline-offset-4 hover:underline`}
            >
              GitHub ↗
            </a>
            <a
              href={identity.resumePdf}
              download
              className={`${NAVY} underline-offset-4 hover:underline`}
            >
              Résumé (PDF) ↓
            </a>
            <PrintButton />
          </div>
        </header>

        {/* summary */}
        <section className="mt-14">
          <SectionLabel>Summary</SectionLabel>
          <p className="max-w-[68ch] text-[0.9375rem] leading-[1.75] text-[#16150F]/85">
            {boringResume.summary}
          </p>
        </section>

        {/* experience */}
        <section className="mt-14">
          <SectionLabel>Experience</SectionLabel>
          <div className="space-y-10">
            {boringResume.roles.map((role) => (
              <article key={`${role.title}-${role.period}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className={`${SERIF} text-xl font-semibold`}>
                    {role.title}
                  </h3>
                  <p className="text-[0.8125rem] font-medium tracking-[0.06em] whitespace-nowrap text-[#16150F]/55">
                    {role.period}
                  </p>
                </div>
                <p className={`${NAVY} mt-0.5 text-[0.875rem] font-medium`}>
                  {role.org}
                </p>
                <ul className="mt-3 space-y-2">
                  {role.bullets.map((bullet) => (
                    <li
                      key={bullet.slice(0, 32)}
                      className="flex gap-3 text-[0.9375rem] leading-[1.7] text-[#16150F]/85"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.62em] h-[5px] w-[5px] shrink-0 bg-[#1F4FD8]"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* projects */}
        <section className="mt-14">
          <SectionLabel>Selected Projects</SectionLabel>
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {exhibits.filter((e) => !e.hidden).map((project) => (
              <article key={project.title}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className={`${SERIF} text-lg font-semibold`}>
                    {toTitleCase(project.title)}
                  </h3>
                  <span className="flex gap-3 text-[0.8125rem] font-medium">
                    {project.live ? (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className={`${NAVY} underline-offset-4 hover:underline`}
                      >
                        Live ↗
                      </a>
                    ) : null}
                    {project.repo ? (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        className={`${NAVY} underline-offset-4 hover:underline`}
                      >
                        GitHub ↗
                      </a>
                    ) : (
                      <span className="text-[#16150F]/45">Proprietary</span>
                    )}
                  </span>
                </div>
                <p className="mt-2 text-[0.875rem] leading-[1.65] text-[#16150F]/75">
                  {project.description}
                </p>
                <p className="mt-2 text-[0.75rem] tracking-[0.04em] text-[#16150F]/50">
                  {project.stack.join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* skills */}
        <section className="mt-14">
          <SectionLabel>Skills</SectionLabel>
          <dl className="space-y-3">
            {skillGroups.map((group) => (
              <div
                key={group.label}
                className="grid gap-1 md:grid-cols-[140px_1fr] md:gap-6"
              >
                <dt className="text-[0.75rem] font-semibold tracking-[0.14em] text-[#16150F]/55 uppercase">
                  {group.label}
                </dt>
                <dd className="text-[0.9375rem] leading-[1.7] text-[#16150F]/85">
                  {group.items.join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* education */}
        <section className="mt-14">
          <SectionLabel>Education</SectionLabel>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <div>
              <h3 className={`${SERIF} text-lg font-semibold`}>
                {boringResume.education.school}
              </h3>
              <p className="mt-0.5 text-[0.875rem] text-[#16150F]/70">
                {boringResume.education.degree}
              </p>
            </div>
            <p className="text-[0.8125rem] font-medium text-[#16150F]/55">
              {boringResume.education.period}
            </p>
          </div>
        </section>

        {/* footer */}
        <footer className={`${RULE} mt-16 pt-6`}>
          <div className="flex flex-wrap items-baseline justify-between gap-4 text-[0.75rem] text-[#16150F]/50">
            <p>© 2026 Syed Abdul Kareem</p>
            <p className="italic">{boringResume.footnote}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

const ACRONYMS = new Set(["KEBS", "CRM", "PSA", "AI"]);

function toTitleCase(value: string): string {
  return value
    .split(" ")
    .map((word) =>
      ACRONYMS.has(word.toUpperCase())
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}
