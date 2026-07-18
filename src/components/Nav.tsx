"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { gsap, SCRAMBLE_CHARS } from "@/lib/gsap";
import { useIsWeird } from "@/lib/mode-store";
import { identity } from "@/data/content";
import BoringLever from "@/components/BoringLever";
import FileReadProgress from "@/components/FileReadProgress";

/**
 * Archive chrome: fixed top bar with logo mark, section index, IST clock and
 * THE LEVER. Below lg the index collapses into a full-screen MENU overlay.
 */

type NavSection = {
  index: string;
  name: string;
  id: string;
};

const NAV_SECTIONS: NavSection[] = [
  { index: "01", name: "SPECIMEN", id: "specimen" },
  { index: "02", name: "FIELD NOTES", id: "field-notes" },
  { index: "03", name: "INSTRUMENTS", id: "instruments" },
  { index: "04", name: "EXHIBITS", id: "exhibits" },
  { index: "05", name: "INCIDENTS", id: "incidents" },
  { index: "06", name: "THE BADGE", id: "badge" },
  { index: "07", name: "CONTACT", id: "contact" },
];

export default function Nav(): React.JSX.Element {
  const isWeird = useIsWeird();
  const [menuOpen, setMenuOpen] = useState(false);
  // on sub-routes (case files) anchor links must route home first
  const pathname = usePathname();
  const anchorPrefix = pathname === "/" ? "" : "/";

  const listRef = useRef<HTMLUListElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  /* ---------- IST clock ---------- */
  const istFormat = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    []
  );
  const [time, setTime] = useState<string>(() => istFormat.format(new Date()));

  useEffect(() => {
    const tick = window.setInterval(
      () => setTime(istFormat.format(new Date())),
      1000
    );
    return () => window.clearInterval(tick);
  }, [istFormat]);

  /* ---------- hover scramble (weird only) ---------- */
  const scramble = (
    e: React.MouseEvent<HTMLAnchorElement> | React.FocusEvent<HTMLAnchorElement>
  ) => {
    if (!isWeird) return;
    const label = e.currentTarget.querySelector<HTMLElement>("[data-scramble]");
    if (!label) return;
    const original = label.dataset.original ?? label.textContent ?? "";
    gsap.killTweensOf(label);
    gsap.to(label, {
      duration: 0.4,
      ease: "none",
      scrambleText: { text: original, chars: SCRAMBLE_CHARS, speed: 1 },
    });
  };

  // Kill any in-flight scrambles on unmount so labels never strand mid-noise.
  useEffect(() => {
    const list = listRef.current;
    return () => {
      if (list) gsap.killTweensOf(list.querySelectorAll("[data-scramble]"));
    };
  }, []);

  /* ---------- mobile menu ---------- */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    firstLinkRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const [logoLeft, logoRight] = identity.logoMark.split("/");

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-line bg-ink/90 [[data-mode=boring]_&]:bg-bone/95">
        <div className="flex items-center justify-between gap-4 px-6 py-4 font-[family-name:var(--font-space-mono)]">
          {/* logo mark */}
          <a
            href={`${anchorPrefix}#specimen`}
            data-cursor="INSPECT"
            aria-label={`${identity.logoMark} — back to top`}
            className="text-sm font-bold tracking-[0.1em] transition-colors hover:text-hazard"
          >
            {logoLeft}
            <span className="text-hazard">/</span>
            {logoRight}
          </a>

          {/* section index — desktop; archive-only, hidden in boring mode */}
          <nav
            aria-label="Archive sections"
            data-weird-nav
            className="hidden lg:block"
          >
            <ul ref={listRef} className="flex items-center gap-5 xl:gap-6">
              {NAV_SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`${anchorPrefix}#${s.id}`}
                    data-cursor="INSPECT"
                    onMouseEnter={scramble}
                    onFocus={scramble}
                    className="flex items-baseline gap-1.5 text-[10px] uppercase tracking-[0.12em] transition-colors hover:text-hazard"
                  >
                    <span aria-hidden="true" className="hidden opacity-50 xl:inline">
                      {s.index}
                    </span>
                    <span data-scramble data-original={s.name}>
                      {s.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* progress + sound + clock + lever + menu */}
          <div className="flex items-center gap-4">
            <span className="hidden xl:block">
              <FileReadProgress />
            </span>
            <span
              suppressHydrationWarning
              className="hidden whitespace-nowrap text-[11px] tracking-[0.14em] opacity-70 xl:block"
            >
              {time} IST
            </span>
            <button
              type="button"
              data-cursor="INSPECT"
              data-weird-nav
              onClick={() =>
                window.dispatchEvent(new Event("archive-open-terminal"))
              }
              aria-label="Open archive terminal"
              title="Archive terminal (Ctrl+K)"
              className="border border-line px-2 py-1 text-[11px] font-bold tracking-[0.1em] transition-colors hover:border-hazard hover:text-hazard"
            >
              &gt;_
            </button>

            <div className="origin-right scale-[0.8] md:scale-100">
              <BoringLever />
            </div>

            <button
              ref={menuButtonRef}
              type="button"
              data-cursor="INSPECT"
              data-weird-nav
              aria-expanded={menuOpen}
              aria-controls="archive-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="text-[11px] font-bold uppercase tracking-[0.16em] transition-colors hover:text-hazard lg:hidden"
            >
              MENU
            </button>
          </div>
        </div>
      </header>

      {/* full-screen index — mobile/tablet */}
      {menuOpen && (
        <motion.div
          id="archive-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Section index"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[120] bg-ink text-bone lg:hidden"
        >
          <div className="flex h-full flex-col px-6 py-4">
            <div className="flex items-center justify-between font-[family-name:var(--font-space-mono)]">
              <span className="specimen-label">INDEX OF SECTIONS</span>
              <button
                type="button"
                data-cursor="INSPECT"
                onClick={() => setMenuOpen(false)}
                className="text-[11px] font-bold uppercase tracking-[0.16em] transition-colors hover:text-hazard"
              >
                CLOSE
              </button>
            </div>

            <nav
              aria-label="Archive sections"
              className="mt-10 flex-1 overflow-y-auto"
            >
              <ul className="flex flex-col">
                {NAV_SECTIONS.map((s, i) => (
                  <li key={s.id}>
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={`${anchorPrefix}#${s.id}`}
                      data-cursor="INSPECT"
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-baseline gap-4 border-b border-line py-4"
                    >
                      <span className="font-[family-name:var(--font-space-mono)] text-[11px] text-hazard">
                        {s.index}
                      </span>
                      <span className="font-[family-name:var(--font-bricolage)] text-4xl font-bold uppercase leading-none tracking-tight transition-colors group-hover:text-hazard sm:text-5xl">
                        {s.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* the lever's caption lives here on mobile — the bar is too
                narrow to carry it next to the switch */}
            <p className="specimen-label border-t border-line py-4 text-taxi">
              IN CASE OF RECRUITER — PULL THE STRIPED LEVER ABOVE ↗
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}
