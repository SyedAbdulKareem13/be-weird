"use client";

/**
 * SPECIMEN INTERROGATION — scripted Q&A terminal. Zero backend: canned
 * answers, keyword matching for free text, deadpan throughout.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { play } from "@/lib/sound";

type QA = { q: string; a: string; keywords: string[] };

const TRANSCRIPT: QA[] = [
  {
    q: "What does the specimen actually do?",
    a: "Forward Deployed Engineer at KEBS. Owns four product lines end to end — CRM, People Allocation, Timesheet, Integrations. Takes requirements on client calls, ships them, stays through go-live. The weird stuff happens after hours.",
    keywords: ["do", "job", "work", "role", "kebs"],
  },
  {
    q: "Is the specimen any good?",
    a: "Intern to Forward Deployed Engineer in 3.5 years. Complex features in 4–5 days with zero regressions. The libraries it built are now standard across the platform. Draw your own conclusions, researcher.",
    keywords: ["good", "skill", "senior", "experience", "years"],
  },
  {
    q: "Angular or React?",
    a: "Both. Angular pays the bills at enterprise scale. React/Next.js builds the weird internet things. The specimen refuses to join the war.",
    keywords: ["angular", "react", "next", "framework", "vue"],
  },
  {
    q: "Does it do AI?",
    a: "GPT-backed natural-language search in a production CRM, LangChain, prompt engineering, and this very archive was built pair-programming with an AI. 58% organic, remember.",
    keywords: ["ai", "gpt", "llm", "langchain", "ml", "openai"],
  },
  {
    q: "Can we hire the specimen?",
    a: "STATUS: OPEN TO INTERESTING PROBLEMS. Coordinates: syedazeeem.13@gmail.com. Handle with curiosity.",
    keywords: ["hire", "job", "available", "contact", "email", "recruit", "salary"],
  },
  {
    q: "Does the specimen do weekends?",
    a: "[REDACTED]",
    keywords: ["weekend", "overtime", "hours", "sleep"],
  },
];

const FALLBACK =
  "THE ARCHIVE DECLINES TO ANSWER. TRY A SUGGESTED QUESTION, RESEARCHER.";

type Line = { kind: "q" | "a"; text: string; typed: boolean };

export default function Interrogate({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [lines, setLines] = useState<Line[]>([]);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setLines([]);
      setInput("");
      setBusy(false);
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
    return () => {
      if (typingTimer.current !== null) window.clearInterval(typingTimer.current);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const scrollToEnd = () => {
    window.requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  const ask = useCallback(
    (question: string, answer: string) => {
      if (busy) return;
      setBusy(true);
      setLines((prev) => [
        ...prev,
        { kind: "q", text: question, typed: true },
      ]);
      scrollToEnd();

      window.setTimeout(() => {
        setLines((prev) => [...prev, { kind: "a", text: "", typed: false }]);
        let i = 0;
        typingTimer.current = window.setInterval(() => {
          i += 1;
          if (i % 4 === 0) play("tick");
          setLines((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            next[next.length - 1] = {
              ...last,
              text: answer.slice(0, i),
              typed: i >= answer.length,
            };
            return next;
          });
          scrollToEnd();
          if (i >= answer.length) {
            if (typingTimer.current !== null)
              window.clearInterval(typingTimer.current);
            typingTimer.current = null;
            setBusy(false);
          }
        }, 12);
      }, 500);
    },
    [busy]
  );

  const submitFreeText = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const lower = text.toLowerCase();
    const match = TRANSCRIPT.find((qa) =>
      qa.keywords.some((k) => lower.includes(k))
    );
    ask(text, match ? match.a : FALLBACK);
  };

  if (!open) return null;

  return (
    <>
      <button
        aria-label="Close interrogation"
        className="fixed inset-0 z-[141] bg-ink/70 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Specimen interrogation"
        className="fixed top-[12vh] left-1/2 z-[142] w-[min(640px,94vw)] -translate-x-1/2 border border-line-strong bg-specimen font-[family-name:var(--font-space-mono)] text-bone shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="text-[11px] tracking-[0.22em] opacity-70">
            SPECIMEN INTERROGATION — SESSION №13
          </span>
          <span className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="inline-block h-3.5 w-2 bg-hazard"
              style={{ animation: "blink-caret 1.1s steps(1) infinite" }}
            />
            <button
              type="button"
              onClick={onClose}
              data-cursor="INSPECT"
              className="text-[10px] font-bold tracking-[0.16em] hover:text-hazard"
            >
              CLOSE
            </button>
          </span>
        </div>

        {/* transcript */}
        <div
          ref={scrollRef}
          className="max-h-[46vh] min-h-[120px] space-y-3 overflow-y-auto px-4 py-4 text-xs leading-relaxed"
        >
          {lines.length === 0 ? (
            <p className="opacity-50">
              &gt; SUBJECT IS COOPERATIVE. ASK YOUR QUESTIONS.
            </p>
          ) : null}
          {lines.map((line, i) => (
            <p
              key={i}
              className={
                line.kind === "q" ? "text-bone/80" : "text-hazard"
              }
            >
              {line.kind === "q" ? "Q: " : "A: "}
              {line.text}
              {!line.typed ? (
                <span aria-hidden="true" className="opacity-80">
                  ▌
                </span>
              ) : null}
            </p>
          ))}
        </div>

        {/* suggested questions */}
        <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
          {TRANSCRIPT.map((qa) => (
            <button
              key={qa.q}
              type="button"
              disabled={busy}
              data-cursor="INSPECT"
              onClick={() => ask(qa.q, qa.a)}
              className="border border-line px-2.5 py-1 text-[10px] tracking-[0.08em] uppercase opacity-80 transition-colors hover:border-hazard hover:text-hazard disabled:opacity-40"
            >
              {qa.q}
            </button>
          ))}
        </div>

        {/* free text */}
        <form
          onSubmit={submitFreeText}
          className="flex items-center gap-2 border-t border-line px-4 py-3"
        >
          <span aria-hidden="true" className="text-hazard">
            &gt;
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="TYPE YOUR OWN QUESTION…"
            aria-label="Ask the specimen a question"
            className="w-full bg-transparent text-xs tracking-wider uppercase outline-none placeholder:opacity-40"
          />
        </form>
      </div>
    </>
  );
}
