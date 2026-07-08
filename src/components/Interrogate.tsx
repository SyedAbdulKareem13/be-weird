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

type QA = { q: string; a: string; keywords: string[] };

const TRANSCRIPT: QA[] = [
  {
    q: "What does the specimen actually do?",
    a: "Forward Deployed Engineer at KEBS. Owns four product lines end to end — CRM, People Allocation, Timesheet, Integrations. Takes requirements on client calls, ships them, stays through go-live. The weird stuff happens after hours.",
    keywords: ["do", "does", "job", "work", "role", "kebs", "day"],
  },
  {
    q: "What is a Forward Deployed Engineer?",
    a: "The engineer they send TO the client. Sits between enterprise customers and the codebase: takes requirements on the call, designs the solution, builds it across Angular and Node, and stays through UAT and go-live. Half diplomat, half compiler.",
    keywords: ["forward", "deployed", "fde", "title", "engineer"],
  },
  {
    q: "Is the specimen any good?",
    a: "Intern to Forward Deployed Engineer in 3.5 years. Complex features in 4–5 days with zero regressions. The libraries it built are now standard across the platform. Draw your own conclusions, researcher.",
    keywords: ["good", "skill", "skilled", "senior", "experience", "years", "best"],
  },
  {
    q: "What's the hardest bug it ever fixed?",
    a: "A one-second UI freeze on the heaviest CRM list view. Traced it to 3,800+ repeated HTML-sanitizer calls inside a single request handler. Replaced innerHTML bindings with real templates, added virtual scrolling. The list now scrolls like it owes someone money.",
    keywords: ["bug", "hardest", "fix", "fixed", "debug", "freeze", "performance"],
  },
  {
    q: "Angular or React?",
    a: "Both. Angular pays the bills at enterprise scale. React/Next.js builds the weird internet things. The specimen refuses to join the war.",
    keywords: ["angular", "react", "next", "framework", "vue", "svelte"],
  },
  {
    q: "What's in the toolbox?",
    a: "By day: Angular, RxJS, Node, Express, MongoDB, MySQL, Docker, Jenkins, AWS. By night: Next.js, TypeScript, Supabase, Prisma, GSAP, three.js. At all hours: an unhealthy attachment to the terminal.",
    keywords: ["stack", "tech", "tools", "toolbox", "technologies", "typescript", "node"],
  },
  {
    q: "Does it do AI?",
    a: "GPT-backed natural-language search in a production CRM, LangChain, prompt engineering, and this very archive was built pair-programming with an AI. 58% organic, remember.",
    keywords: ["ai", "gpt", "llm", "langchain", "ml", "openai", "artificial"],
  },
  {
    q: "Tell me about Manzil One.",
    a: "A multi-tenant CRM & quotation SaaS built solo — the lead-to-cash pipeline it ships at work, rebuilt from a blank folder. 11-stage pipeline, live margin math, four-step approval chains. Full dossier: /exhibits/manzil-one. Yes, that's a real link.",
    keywords: ["manzil", "crm", "saas", "project", "projects", "syncwave", "side"],
  },
  {
    q: "Why 'BE WEIRD'?",
    a: "Four years of enterprise software taught the specimen how systems behave. Nights taught it that software should also make you feel something. Normal is a settings default. This archive is the counter-argument.",
    keywords: ["weird", "why", "name", "theme", "philosophy"],
  },
  {
    q: "What happens if I pull the lever?",
    a: "The entire archive calms down into a clean, recruiter-grade CV. Serif type, navy accents, zero physics. Pull it again and the weird comes back. Fully reversible. Mostly.",
    keywords: ["lever", "pull", "boring", "mode", "recruiter"],
  },
  {
    q: "Who built this archive?",
    a: "The specimen, pair-programming with an AI it refuses to name. Next.js 16, GSAP, anime.js, Motion, a real physics engine for the badge, and synthesized WebAudio for the clunks. 58% organic code, stamped and certified.",
    keywords: ["built", "made", "site", "portfolio", "archive", "this"],
  },
  {
    q: "Where is the specimen located?",
    a: "Tamil Nadu, India. Operates on IST (UTC+5:30), collaborates across whatever timezone the interesting problem lives in.",
    keywords: ["where", "located", "location", "remote", "timezone", "india"],
  },
  {
    q: "What does the specimen eat?",
    a: "100 grams of protein a day, logged with the same rigor as its commit history. The caffeine intake is classified under a separate file.",
    keywords: ["eat", "food", "diet", "protein", "coffee", "caffeine"],
  },
  {
    q: "Is the specimen dangerous?",
    a: "MOSTLY HARMLESS. OCCASIONALLY BRILLIANT. The archive stands by both claims. Known attack vectors: scope creep, untested code, and the phrase 'quick call'.",
    keywords: ["dangerous", "harmless", "safe", "threat"],
  },
  {
    q: "Can we hire the specimen?",
    a: "STATUS: OPEN TO INTERESTING PROBLEMS. Coordinates: syedazeeem.13@gmail.com. Handle with curiosity.",
    keywords: ["hire", "hiring", "available", "contact", "email", "recruit", "salary", "opportunity"],
  },
  {
    q: "Does the specimen do weekends?",
    a: "[REDACTED]",
    keywords: ["weekend", "weekends", "overtime", "sleep", "dream", "rest"],
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
  // ↑↓ moves this highlight through the suggested questions, ↵ asks it
  const [highlight, setHighlight] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setLines([]);
      setInput("");
      setBusy(false);
      setHighlight(-1);
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
    return () => {
      if (typingTimer.current !== null) window.clearInterval(typingTimer.current);
    };
  }, [open]);

  // keep the highlighted question in view inside the chip strip
  useEffect(() => {
    if (highlight < 0) return;
    chipsRef.current
      ?.querySelectorAll("button")
      [highlight]?.scrollIntoView({ block: "nearest" });
  }, [highlight]);

  // The session renders inside the ARCHIVE TERMINAL's dialog. Keys typed
  // here must never drive the cmdk list underneath — contain everything and
  // handle Escape / arrow navigation locally.
  const containKeys = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % TRANSCRIPT.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h <= 0 ? TRANSCRIPT.length - 1 : h - 1));
      return;
    }
    // Enter with an empty input asks the highlighted question; with text it
    // falls through to the form submit (free-text matcher)
    if (e.key === "Enter" && !input.trim() && highlight >= 0 && !busy) {
      e.preventDefault();
      const qa = TRANSCRIPT[highlight];
      ask(qa.q, qa.a);
    }
  };

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
    // whole-word matching, best match wins — "do" must be the word "do",
    // and a question hitting 3 keywords beats one hitting 1
    const words = new Set(text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
    let best: QA | null = null;
    let bestScore = 0;
    for (const qa of TRANSCRIPT) {
      const score = qa.keywords.filter((k) => words.has(k)).length;
      if (score > bestScore) {
        bestScore = score;
        best = qa;
      }
    }
    ask(text, best ? best.a : FALLBACK);
  };

  if (!open) return null;

  return (
    <div onKeyDown={containKeys}>
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
          data-lenis-prevent
          className="max-h-[38vh] min-h-[120px] space-y-3 overflow-y-auto overscroll-contain px-4 py-4 text-xs leading-relaxed"
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

        {/* suggested questions — ↑↓ highlights, ↵ asks */}
        <div
          ref={chipsRef}
          data-lenis-prevent
          className="flex max-h-[22vh] flex-wrap gap-2 overflow-y-auto overscroll-contain border-t border-line px-4 py-3"
        >
          {TRANSCRIPT.map((qa, index) => (
            <button
              key={qa.q}
              type="button"
              disabled={busy}
              data-cursor="INSPECT"
              onClick={() => ask(qa.q, qa.a)}
              onMouseEnter={() => setHighlight(index)}
              className={`border px-2.5 py-1 text-[10px] tracking-[0.08em] uppercase transition-colors disabled:opacity-40 ${
                index === highlight
                  ? "border-hazard bg-hazard font-bold text-ink"
                  : "border-line opacity-80 hover:border-hazard hover:text-hazard"
              }`}
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

        {/* explicit keyboard affordances */}
        <div className="flex items-center gap-4 border-t border-line px-4 py-2 text-[10px] tracking-[0.18em] uppercase opacity-50">
          <span>↑↓ QUESTIONS</span>
          <span>↵ ASK</span>
          <span>ESC EXIT</span>
        </div>
      </div>
    </div>
  );
}
