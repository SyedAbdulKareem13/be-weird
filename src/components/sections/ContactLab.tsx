"use client";

import { useCallback, useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import WeirdOnly from "@/components/WeirdOnly";
import GlitchText from "@/components/reactbits/GlitchText";
import Magnet from "@/components/reactbits/Magnet";
import { contact, identity } from "@/data/content";
import { gsap, SCRAMBLE_CHARS } from "@/lib/gsap";
import { toast } from "@/lib/toast";

/**
 * SECTION 07 — CONTACT THE LAB.
 * Boring skeleton: plain h2 headline, a mailto link, four bordered chip links,
 * availability line. Weird layer: GlitchText headline, ScrambleText email
 * (hover churn → settle, click copies), Magnet-wrapped chips.
 */

/* GlitchText ships Tailwind classes for its clip-path animation
   (animate-glitch-after/before) whose keyframes aren't in the global theme,
   plus hardcoded red/cyan shadows and white text. This scoped block supplies
   the keyframes and re-tokens the shadows to ultraviolet (garnish only —
   hazard stays reserved for interactive). */
const CONTACT_CSS = `
@keyframes contact-glitch-clip {
  0% { clip-path: inset(20% 0 50% 0); }
  10% { clip-path: inset(15% 0 55% 0); }
  20% { clip-path: inset(30% 0 40% 0); }
  30% { clip-path: inset(10% 0 60% 0); }
  40% { clip-path: inset(25% 0 35% 0); }
  50% { clip-path: inset(20% 0 50% 0); }
  60% { clip-path: inset(15% 0 55% 0); }
  70% { clip-path: inset(30% 0 40% 0); }
  80% { clip-path: inset(40% 0 20% 0); }
  90% { clip-path: inset(15% 0 55% 0); }
  100% { clip-path: inset(30% 0 40% 0); }
}
#contact .contact-glitch [data-text] {
  --after-shadow: -6px 0 var(--ultraviolet) !important;
  --before-shadow: 6px 0 var(--ultraviolet) !important;
}
#contact .contact-glitch [data-text]::after {
  animation: contact-glitch-clip var(--after-duration) infinite linear alternate-reverse;
}
#contact .contact-glitch [data-text]::before {
  animation: contact-glitch-clip var(--before-duration) infinite linear alternate-reverse;
}
@media (prefers-reduced-motion: reduce) {
  #contact .contact-glitch [data-text]::after,
  #contact .contact-glitch [data-text]::before {
    animation: none;
  }
}
`;

const HEADLINE_CLASSES =
  "font-[family-name:var(--font-bricolage)] text-[clamp(2.5rem,8vw,7rem)] font-black uppercase leading-[0.95] tracking-tight";

/* Trailing-! (Tailwind v4 important) beats GlitchText's baked-in
   text-white / text-[clamp(2rem,10vw,8rem)] / white pseudo text / #120F17
   pseudo backgrounds. */
const GLITCH_CLASSES =
  "font-[family-name:var(--font-bricolage)] font-black uppercase tracking-tight leading-[0.95] " +
  "text-[clamp(2.5rem,8vw,7rem)]! text-bone! " +
  "after:text-bone! before:text-bone! after:bg-ink! before:bg-ink!";

const EMAIL_CLASSES =
  "block w-full break-all border-y border-line py-6 text-left " +
  "font-[family-name:var(--font-space-mono)] text-[clamp(1.2rem,4vw,3rem)] " +
  "leading-tight transition-colors hover:text-hazard md:py-8";

type ChipLink = {
  label: string;
  href: string;
  external?: boolean;
  download?: boolean;
};

const CHIPS: ChipLink[] = [
  { label: "GITHUB ↗", href: identity.github, external: true },
  { label: "LINKEDIN ↗", href: identity.linkedin, external: true },
  { label: "RESUME (PDF)", href: identity.resumePdf, download: true },
  { label: "EMAIL", href: `mailto:${identity.email}` },
];

/** Bordered mono chip; Magnet pull is weird-only, the anchor is the skeleton. */
function ContactChip({ chip }: { chip: ChipLink }) {
  const anchor = (
    <a
      href={chip.href}
      target={chip.external ? "_blank" : undefined}
      rel={chip.external ? "noreferrer" : undefined}
      download={chip.download ? true : undefined}
      data-cursor="INSPECT"
      className="inline-block border border-line-strong px-5 py-3 font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.14em] transition-colors hover:border-hazard hover:bg-hazard hover:text-ink"
    >
      {chip.label}
    </a>
  );

  return (
    <WeirdOnly fallback={anchor}>
      <Magnet padding={70} magnetStrength={4}>
        {anchor}
      </Magnet>
    </WeirdOnly>
  );
}

/**
 * Weird-mode email: hover/focus churns the characters (ScrambleText), leaving
 * settles them back to the real address, click copies. Mounted only inside
 * <WeirdOnly> — unmount (mode flip) runs the cleanup, which reverts the GSAP
 * context and restores the plain address, so the committed DOM state is
 * always the readable email.
 */
function ScrambleEmailButton({ onCopy }: { onCopy: () => void }) {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const ctxRef = useRef<ReturnType<typeof gsap.context> | null>(null);

  useEffect(() => {
    ctxRef.current = gsap.context(() => {});
    const el = textRef.current;
    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
      if (el) el.textContent = identity.email;
    };
  }, []);

  const churn = useCallback(() => {
    const el = textRef.current;
    const ctx = ctxRef.current;
    if (!el || !ctx) return;
    ctx.add(() => {
      gsap.killTweensOf(el);
      // revealDelay === duration → pure churn until the pointer leaves
      gsap.to(el, {
        duration: 12,
        ease: "none",
        scrambleText: {
          text: identity.email,
          chars: SCRAMBLE_CHARS,
          revealDelay: 12,
          speed: 0.5,
        },
      });
    });
  }, []);

  const settle = useCallback(() => {
    const el = textRef.current;
    const ctx = ctxRef.current;
    if (!el || !ctx) return;
    ctx.add(() => {
      gsap.killTweensOf(el);
      gsap.to(el, {
        duration: 0.7,
        ease: "none",
        scrambleText: {
          text: identity.email,
          chars: SCRAMBLE_CHARS,
          speed: 1.2,
        },
      });
    });
  }, []);

  return (
    <button
      type="button"
      onClick={onCopy}
      onPointerEnter={churn}
      onPointerLeave={settle}
      onFocus={churn}
      onBlur={settle}
      data-cursor="INSPECT"
      aria-label="Copy email address"
      className={`${EMAIL_CLASSES} cursor-pointer`}
    >
      <span aria-hidden="true" ref={textRef}>
        {identity.email}
      </span>
      {/* plain address, always present for assistive tech / find-in-page */}
      <span className="sr-only">{identity.email}</span>
    </button>
  );
}

export default function ContactLab() {
  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(identity.email);
      toast(contact.toast);
    } catch {
      // clipboard API blocked (permissions/insecure context) — legacy path
      const ta = document.createElement("textarea");
      ta.value = identity.email;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        if (document.execCommand("copy")) toast(contact.toast);
      } catch {
        // both paths failed — the address is on screen either way
      }
      document.body.removeChild(ta);
    }
  }, []);

  return (
    <section
      id="contact"
      className="relative px-6 md:px-12 lg:px-20 py-24 md:py-36"
    >
      <style>{CONTACT_CSS}</style>

      <div className="mx-auto max-w-[1400px]">
        <SectionHeader index="07" name="CONTACT THE LAB" stamp="OPEN CHANNEL" />

        <WeirdOnly
          fallback={<h2 className={HEADLINE_CLASSES}>{contact.headline}</h2>}
        >
          <h2 className="sr-only">{contact.headline}</h2>
          <div aria-hidden="true" className="contact-glitch">
            <GlitchText speed={0.6} className={GLITCH_CLASSES}>
              {contact.headline}
            </GlitchText>
          </div>
        </WeirdOnly>

        <div className="mt-10 md:mt-14">
          <WeirdOnly
            fallback={
              <a
                href={`mailto:${identity.email}`}
                data-cursor="INSPECT"
                className={EMAIL_CLASSES}
              >
                {identity.email}
              </a>
            }
          >
            <ScrambleEmailButton onCopy={copyEmail} />
          </WeirdOnly>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 md:gap-4">
          {CHIPS.map((chip) => (
            <ContactChip key={chip.label} chip={chip} />
          ))}
        </div>

        <p className="mt-8 font-[family-name:var(--font-space-mono)] text-[0.6875rem] uppercase tracking-[0.14em] opacity-70">
          {contact.availability}
        </p>
      </div>
    </section>
  );
}
