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
import { calmToast } from "@/data/content";
import WeirdOnly from "@/components/WeirdOnly";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { usePerfTier } from "@/lib/perf";

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

const MONO_STYLE = "color:#FF4D00;font-family:monospace;font-size:12px;";
const DIM_STYLE = "color:#8b8b8b;font-family:monospace;font-size:11px;";

/* The console is part of the archive: a banner plus a working command set.
   Anyone weird enough to open DevTools gets tools. */
function stampConsole(): void {
  if (consoleStamped) return;
  consoleStamped = true;

  /* eslint-disable no-console */
  console.log(
    `%c${BANNER}`,
    "color:#FF4D00;font-family:monospace;font-size:10px;line-height:1.1;"
  );
  console.log(
    "%cRecruiter? The lever is in the nav. → github.com/SyedAbdulKareem13",
    MONO_STYLE + "font-weight:bold;"
  );
  console.log(
    "%cYou opened the console. Excellent instincts, researcher.\n" +
      "The archive exposes a console API:\n\n" +
      "%c  hire()    %c→ the specimen's coordinates\n" +
      "%c  yank()    %c→ pull the badge (scroll down first)\n" +
      "%c  flip()    %c→ flip the badge\n" +
      "%c  boring()  %c→ pull the emergency lever\n" +
      "%c  weird()   %c→ you'll see",
    DIM_STYLE,
    MONO_STYLE, DIM_STYLE,
    MONO_STYLE, DIM_STYLE,
    MONO_STYLE, DIM_STYLE,
    MONO_STYLE, DIM_STYLE,
    MONO_STYLE, DIM_STYLE
  );

  const g = window as unknown as Record<string, unknown>;
  g.hire = () => {
    console.log(
      "%cSTATUS: OPEN TO INTERESTING PROBLEMS\n" +
        "EMAIL:  syedazeeem.13@gmail.com\n" +
        "GITHUB: github.com/SyedAbdulKareem13\n" +
        "HANDLE WITH CURIOSITY.",
      MONO_STYLE
    );
    return "COORDINATES TRANSMITTED.";
  };
  g.yank = () => {
    window.dispatchEvent(new Event("archive-yank"));
    return "YANKED. (THE BADGE IS IN SECTION 06.)";
  };
  g.flip = () => {
    window.dispatchEvent(new Event("archive-flip"));
    return "FLIPPED.";
  };
  g.boring = () => {
    useModeStore.getState().setMode("boring");
    return "CALM ENGAGED. THE LEVER BRINGS IT BACK.";
  };
  g.weird = () => {
    useModeStore.getState().setMode("weird");
    document.documentElement.dataset.konami = "1";
    window.setTimeout(() => {
      delete document.documentElement.dataset.konami;
    }, 4000);
    return "MAXIMUM WEIRD (4 SECONDS). YOU WERE WARNED.";
  };
  /* eslint-enable no-console */
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
  const perfTier = usePerfTier();

  /* Reconcile the store with the pre-hydration DOM verdict on mount, so a
     reduced-motion client (SSR assumes weird) can't strand a stale mode. */
  useEffect(() => {
    syncFromDom();
  }, [syncFromDom]);

  /* Lenis smooth scroll — weird mode + capable devices only. On weak hardware
     native scroll is smoother than JS-driven smooth scroll, so we skip it and
     ScrollTrigger falls back to the native scroller. */
  useEffect(() => {
    if (!isWeird || perfTier === "low") return;

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
  }, [isWeird, perfTier]);

  /* Console easter egg — once per page load. */
  useEffect(() => {
    stampConsole();
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

      {/* Film grain — a GPU-composited CSS overlay instead of a per-frame
          1024×1024 canvas. Same look, ~zero main-thread cost. */}
      <WeirdOnly>
        <div aria-hidden="true" className="grain-overlay" />
      </WeirdOnly>

      <Toaster />
    </>
  );
}
