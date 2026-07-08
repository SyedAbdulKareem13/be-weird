"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsWeird, useModeStore } from "@/lib/mode-store";
import { TOAST_EVENT, toast, type ArchiveToast } from "@/lib/toast";
import { play } from "@/lib/sound";
import { calmToast } from "@/data/content";
import WeirdOnly from "@/components/WeirdOnly";
import ClickSpark from "@/components/reactbits/ClickSpark";
import Noise from "@/components/reactbits/Noise";

/* ------------------------------------------------------------------ */
/* Console easter egg — module-level guard so StrictMode / remounts    */
/* never print it twice.                                               */
/* ------------------------------------------------------------------ */

let consoleStamped = false;

const BANNER = `
██████╗ ███████╗    ██╗    ██╗███████╗██╗██████╗ ██████╗
██╔══██╗██╔════╝    ██║    ██║██╔════╝██║██╔══██╗██╔══██╗
██████╔╝█████╗      ██║ █╗ ██║█████╗  ██║██████╔╝██║  ██║
██╔══██╗██╔══╝      ██║███╗██║██╔══╝  ██║██╔══██╗██║  ██║
██████╔╝███████╗    ╚███╔███╔╝███████╗██║██║  ██║██████╔╝
╚═════╝ ╚══════╝     ╚══╝╚══╝ ╚══════╝╚═╝╚═╝  ╚═╝╚═════╝
`;

function stampConsole(): void {
  if (consoleStamped) return;
  consoleStamped = true;
  // eslint-disable-next-line no-console
  console.log(
    `%c${BANNER}`,
    "color:#FF4D00;font-family:monospace;font-size:10px;line-height:1.1;"
  );
  // eslint-disable-next-line no-console
  console.log(
    "%cRecruiter? The lever is in the nav. → github.com/SyedAbdulKareem13",
    "color:#FF4D00;font-family:monospace;font-size:12px;font-weight:bold;"
  );
}

/* ------------------------------------------------------------------ */
/* Toaster — listens for the archive-toast CustomEvent, stacks max 3   */
/* bottom-center chips.                                                */
/* ------------------------------------------------------------------ */

const TOAST_TTL_MS = 2800;
const TOAST_MAX = 3;

function Toaster(): React.ReactElement {
  const [toasts, setToasts] = useState<ArchiveToast[]>([]);
  const timeoutsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const timeouts = timeoutsRef.current;

    const onToast = (event: Event) => {
      const { detail } = event as CustomEvent<ArchiveToast>;
      if (!detail || typeof detail.message !== "string") return;

      setToasts((prev) => [...prev, detail].slice(-TOAST_MAX));

      const timeoutId = window.setTimeout(() => {
        timeouts.delete(timeoutId);
        setToasts((prev) => prev.filter((t) => t.id !== detail.id));
      }, TOAST_TTL_MS);
      timeouts.add(timeoutId);
    };

    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      timeouts.forEach((id) => window.clearTimeout(id));
      timeouts.clear();
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[120] flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-4"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 520, damping: 34 }}
            className="border border-line-strong bg-specimen px-4 py-2 text-center font-[family-name:var(--font-space-mono)] text-[11px] uppercase tracking-[0.14em] text-bone"
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ArchiveChrome — global shell: Lenis smooth scroll, click sparks,    */
/* film grain, toaster, auto-calm notice, console stamp.               */
/* ------------------------------------------------------------------ */

export default function ArchiveChrome({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  const isWeird = useIsWeird();
  const autoCalmed = useModeStore((s) => s.autoCalmed);
  const syncFromDom = useModeStore((s) => s.syncFromDom);

  /* Reconcile the store with the pre-hydration DOM verdict on mount, so a
     reduced-motion client (SSR assumes weird) can't strand a stale mode. */
  useEffect(() => {
    syncFromDom();
  }, [syncFromDom]);

  /* Lenis smooth scroll — weird mode only, wired into GSAP's ticker so
     ScrollTrigger scenes and the scroll position never disagree. */
  useEffect(() => {
    if (!isWeird) return;

    const lenis = new Lenis({ autoRaf: false });

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    /* Delegated anchor handler so in-page links ride the smooth scroll. */
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const target = event.target as Element | null;
      const anchor = target?.closest?.('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (href === "#") {
        event.preventDefault();
        lenis.scrollTo(0);
        return;
      }

      let el: HTMLElement | null = null;
      try {
        el = document.getElementById(decodeURIComponent(href.slice(1)));
      } catch {
        el = document.getElementById(href.slice(1));
      }
      if (!el) return;

      event.preventDefault();
      lenis.scrollTo(el);
      window.history.pushState(null, "", href);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(onTick);
      gsap.ticker.lagSmoothing(500, 33); // restore GSAP default for boring mode
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, [isWeird]);

  /* Console easter egg — once per page load. */
  useEffect(() => {
    stampConsole();
  }, []);

  /* Sound hooks for the lanyard toy — the impulse lands ~250ms after yank. */
  useEffect(() => {
    const onYank = () => window.setTimeout(() => play("snap"), 250);
    const onFlip = () => play("snap");
    window.addEventListener("archive-yank", onYank);
    window.addEventListener("archive-flip", onFlip);
    return () => {
      window.removeEventListener("archive-yank", onYank);
      window.removeEventListener("archive-flip", onFlip);
    };
  }, []);

  /* Auto-calm notice: the <head> script may have downgraded to boring
     mode via prefers-reduced-motion; tell the researcher once, gently. */
  useEffect(() => {
    if (!autoCalmed) return;
    const timeoutId = window.setTimeout(() => toast(calmToast), 900);
    return () => window.clearTimeout(timeoutId);
    // Mount-time verdict only — toggling the lever later clears autoCalmed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <WeirdOnly fallback={children}>
        <ClickSpark
          sparkColor="#FF4D00"
          sparkSize={9}
          sparkRadius={18}
          sparkCount={8}
          duration={420}
        >
          {children}
        </ClickSpark>
      </WeirdOnly>

      <WeirdOnly>
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[100]"
        >
          <Noise patternAlpha={13} patternRefreshInterval={6} />
        </div>
      </WeirdOnly>

      <Toaster />
    </>
  );
}
