"use client";

/**
 * ⌘K / Ctrl-K — the ARCHIVE TERMINAL. Navigation + protocols (toggle boring
 * mode, yank the lanyard, barrel roll, self destruct, copy email).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Command } from "cmdk";
import { animate, utils } from "animejs";
import { useModeStore } from "@/lib/mode-store";
import { toast } from "@/lib/toast";
import { play } from "@/lib/sound";
import { identity } from "@/data/content";
import LetterGlitch from "@/components/reactbits/LetterGlitch";
import Interrogate from "@/components/Interrogate";

const SECTIONS: { id: string; label: string }[] = [
  { id: "specimen", label: "01 SPECIMEN" },
  { id: "field-notes", label: "02 FIELD NOTES" },
  { id: "instruments", label: "03 INSTRUMENTS" },
  { id: "exhibits", label: "04 EXHIBITS" },
  { id: "incidents", label: "05 INCIDENTS" },
  { id: "badge", label: "06 THE BADGE" },
  { id: "contact", label: "07 CONTACT" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [destructing, setDestructing] = useState(false);
  const [interrogating, setInterrogating] = useState(false);
  const { mode, toggleMode } = useModeStore();
  const inputRef = useRef<HTMLInputElement>(null);
  // read inside same-tick event handlers (Radix Escape vs our Escape)
  const interrogatingRef = useRef(false);
  interrogatingRef.current = interrogating;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) play("boot");
          return !o;
        });
      }
      // Ctrl+Shift+I — you tried to inspect the specimen; the specimen
      // inspects you instead. Opens the terminal with an interrogation
      // session on top. (F12 still opens the real DevTools.)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        play("boot");
        setOpen(true);
        setInterrogating(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Guaranteed keyboard control: focus the query input whenever the terminal
  // is topmost (on open, and again when an interrogation session ends).
  // Several attempts — Radix's own focus restoration runs async and can
  // land focus on <body> after the session subtree unmounts.
  useEffect(() => {
    if (!open || interrogating) return;
    const focusInput = () => {
      const input = inputRef.current;
      if (input && document.activeElement !== input) input.focus();
    };
    const raf = window.requestAnimationFrame(focusInput);
    const t1 = window.setTimeout(focusInput, 80);
    const t2 = window.setTimeout(focusInput, 220);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [open, interrogating]);

  // Arrows must scroll the terminal, never the page behind it.
  useEffect(() => {
    if (!open && !interrogating) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, interrogating]);

  const jump = useCallback((id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const barrelRoll = useCallback(() => {
    setOpen(false);
    if (mode === "boring") {
      toast("BARREL ROLLS ARE A WEIRD-MODE PRIVILEGE");
      return;
    }
    const body = document.body;
    body.style.transformOrigin = "50% 50vh";
    animate(body, {
      rotate: [0, 360],
      duration: 1200,
      ease: "inOutQuad",
      onComplete: () => {
        utils.remove(body);
        body.style.transform = "";
        body.style.transformOrigin = "";
      },
    });
  }, [mode]);

  const selfDestruct = useCallback(() => {
    setOpen(false);
    setDestructing(true);
    window.setTimeout(() => {
      setDestructing(false);
      toast("JK. THE ARCHIVE IS IMMORTAL.");
    }, 3000);
  }, []);

  const copyEmail = useCallback(async () => {
    setOpen(false);
    try {
      await navigator.clipboard.writeText(identity.email);
      toast("COORDINATES COPIED");
    } catch {
      toast("CLIPBOARD DENIED. TYPE IT LIKE IT'S 1999.");
    }
  }, []);

  const yank = useCallback(() => {
    setOpen(false);
    document.getElementById("badge")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => window.dispatchEvent(new Event("archive-yank")), 900);
  }, []);

  const flip = useCallback(() => {
    setOpen(false);
    document.getElementById("badge")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => window.dispatchEvent(new Event("archive-flip")), 900);
  }, []);

  return (
    <>
      <Command.Dialog
        open={open}
        onOpenChange={(next) => {
          // while an interrogation session is on top, Escape/outside-click
          // must close the session (handled in Interrogate), not the terminal
          if (!next && interrogatingRef.current) return;
          setOpen(next);
        }}
        loop
        label="Archive terminal"
        className="fixed top-[18vh] left-1/2 z-[140] w-[min(560px,92vw)] -translate-x-1/2 border border-line-strong bg-specimen font-[family-name:var(--font-space-mono)] text-bone shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="text-[11px] tracking-[0.25em] opacity-70">
            ARCHIVE TERMINAL v1.3
          </span>
          <span
            aria-hidden="true"
            className="inline-block h-3.5 w-2 bg-hazard"
            style={{ animation: "blink-caret 1.1s steps(1) infinite" }}
          />
        </div>
        <Command.Input
          ref={inputRef}
          placeholder="> QUERY THE ARCHIVE…"
          className="w-full border-b border-line bg-transparent px-4 py-3 text-sm tracking-wider uppercase outline-none placeholder:opacity-40"
        />
        <Command.List className="max-h-[320px] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-xs tracking-widest opacity-50">
            NO SUCH FILE IN THE ARCHIVE.
          </Command.Empty>

          <Command.Group
            heading="NAVIGATION"
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-[0.3em] [&_[cmdk-group-heading]]:text-ultraviolet"
          >
            {SECTIONS.map((s) => (
              <Command.Item
                key={s.id}
                onSelect={() => jump(s.id)}
                className="cursor-pointer px-3 py-2 text-xs tracking-[0.2em] uppercase data-[selected=true]:bg-hazard data-[selected=true]:text-ink"
              >
                {s.label}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group
            heading="PROTOCOLS"
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-[0.3em] [&_[cmdk-group-heading]]:text-ultraviolet"
          >
            <Command.Item
              onSelect={() => {
                setOpen(false);
                toggleMode();
              }}
              className="cursor-pointer px-3 py-2 text-xs tracking-[0.2em] uppercase data-[selected=true]:bg-hazard data-[selected=true]:text-ink"
            >
              TOGGLE BORING MODE {mode === "boring" ? "[CURRENTLY: BORING]" : "[CURRENTLY: WEIRD]"}
            </Command.Item>
            <Command.Item
              onSelect={yank}
              className="cursor-pointer px-3 py-2 text-xs tracking-[0.2em] uppercase data-[selected=true]:bg-hazard data-[selected=true]:text-ink"
            >
              YANK THE LANYARD
            </Command.Item>
            <Command.Item
              onSelect={flip}
              className="cursor-pointer px-3 py-2 text-xs tracking-[0.2em] uppercase data-[selected=true]:bg-hazard data-[selected=true]:text-ink"
            >
              FLIP THE BADGE
            </Command.Item>
            <Command.Item
              onSelect={barrelRoll}
              className="cursor-pointer px-3 py-2 text-xs tracking-[0.2em] uppercase data-[selected=true]:bg-hazard data-[selected=true]:text-ink"
            >
              DO A BARREL ROLL
            </Command.Item>
            <Command.Item
              onSelect={() => {
                // terminal stays open underneath — closing the session
                // drops the researcher back into the terminal
                play("boot");
                setInterrogating(true);
              }}
              className="cursor-pointer px-3 py-2 text-xs tracking-[0.2em] uppercase data-[selected=true]:bg-hazard data-[selected=true]:text-ink"
            >
              INTERROGATE THE SPECIMEN
            </Command.Item>
            <Command.Item
              onSelect={selfDestruct}
              className="cursor-pointer px-3 py-2 text-xs tracking-[0.2em] uppercase data-[selected=true]:bg-hazard data-[selected=true]:text-ink"
            >
              SELF DESTRUCT
            </Command.Item>
            <Command.Item
              onSelect={copyEmail}
              className="cursor-pointer px-3 py-2 text-xs tracking-[0.2em] uppercase data-[selected=true]:bg-hazard data-[selected=true]:text-ink"
            >
              COPY EMAIL
            </Command.Item>
          </Command.Group>
        </Command.List>

        {/* explicit keyboard affordances */}
        <div className="flex items-center gap-4 border-t border-line px-4 py-2 text-[10px] tracking-[0.18em] uppercase opacity-50">
          <span>↑↓ NAVIGATE</span>
          <span>↵ EXECUTE</span>
          <span>ESC EXIT</span>
        </div>

        {/* rendered inside the dialog so it lives within the focus trap */}
        <Interrogate
          open={interrogating}
          onClose={() => setInterrogating(false)}
        />
      </Command.Dialog>

      {open && (
        <button
          aria-label="Close archive terminal"
          className="fixed inset-0 z-[139] bg-ink/60 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}

      {destructing && (
        <div className="fixed inset-0 z-[145]" aria-hidden="true">
          <LetterGlitch
            glitchColors={["#FF4D00", "#6E4BFF", "#EFEAE3"]}
            glitchSpeed={30}
            centerVignette
            outerVignette
            smooth
            characters="█▓▒░#%&@$№∆SELFDESTRUCT013"
          />
        </div>
      )}
    </>
  );
}
