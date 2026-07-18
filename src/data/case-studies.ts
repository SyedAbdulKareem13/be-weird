/**
 * CASE FILES — long-form dossiers behind each exhibit.
 * Every claim here is grounded in the repo READMEs and real build history.
 */

export type CaseStudy = {
  slug: string;
  title: string;
  fileNo: string;
  classification: string;
  status: string;
  oneLiner: string;
  live?: string;
  /** public repo — absent for enterprise work */
  repo?: string;
  stack: string[];
  sections: { heading: string; body: string[] }[];
  verdict: string;
  /** kept out of the sitemap while its exhibit is benched */
  unlisted?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "kebs-crm",
    title: "KEBS CRM",
    fileNo: "CASE FILE №000",
    classification: "ENTERPRISE",
    status: "IN PRODUCTION",
    oneLiner:
      "The multi-tenant CRM + PSA platform I build for a living — a suite I rebuilt end to end as V2, with a Quote Builder at its heart that turns raw deals into priced, approved, auditable quotations.",
    stack: [
      "Angular",
      "RxJS",
      "Node.js",
      "Express",
      "MongoDB",
      "MySQL",
      "Docker · Jenkins",
      "AWS",
    ],
    sections: [
      {
        heading: "THE PLATFORM",
        body: [
          "KEBS is a multi-tenant enterprise CRM and PSA platform serving consulting and services businesses — the kind of software that cannot go down, cannot leak a tenant's data into another's, and cannot ask a client to change how they work. Forms, grids, pipelines and permissions are configuration driven from MongoDB, so every tenant effectively runs their own shape of the product on one codebase.",
          "I owned the CRM suite frontend for roughly thirty sprints and rebuilt it module by module as the V2 generation: Accounts V2, Opportunity V2, Quote V2, Contacts V2, Leads V2 and Campaign V2 — config-driven forms and grids, Kanban views, audit logs, and per-tenant customization throughout.",
        ],
      },
      {
        heading: "THE QUOTE MACHINE",
        body: [
          "The crown of the suite is the Quote Builder — enterprise deal management wired into CRM, ERP and Projects. Quote configurations are dynamic reactive forms (Angular FormGroups) generated from tenant config, and the money math is live: revenue, cost and gross-margin percentage recompute through RxJS observable streams as the deal is shaped, not after a save button.",
          "Around that core sit the things real sales teams actually fight about: field-level configuration controls, milestone billing and lumpsum setups, data masking so sensitive pricing stays on a need-to-know basis, multi-level approval workflows with full audit history, change-request handling after a quote has gone out, Quote-to-Cash integration so a won deal flows straight into project delivery, and projection reports so finance can see what's coming before it lands.",
        ],
      },
      {
        heading: "KEPT IN SYNC",
        body: [
          "As Forward Deployed Engineer I now own four product lines end to end — CRM, People Allocation, Timesheet and Integration Systems. The integration layer is the quiet hero: a closed deal flows into resource allocation and time tracking without anyone re-entering data. Tenant-specific rollouts run on idempotent MongoDB migration scripts that are safe to re-run in any environment — boring on purpose, because rollout day is the wrong day for surprises.",
        ],
      },
      {
        heading: "FIELD RECORD",
        body: [
          "Highlights from the file: traced a one-second freeze on the heaviest CRM list view to 3,800+ repeated HTML-sanitizer calls in a single handler and replaced innerHTML bindings with real templates plus virtual scrolling. Published the shared Angular libraries (@kebs-lib/ui, @kebs-lib/forms) that now run across the whole product. Built the platform-wide Document Manager — S3 storage, MongoDB versioning, AES encryption, signed URLs, Gotenberg previews. And I sit on the client calls: requirements in, UAT feedback turned into fixes the same week, often the same day.",
          "No public repo for this one — it's production enterprise software. Names withheld. Impact wasn't.",
        ],
      },
    ],
    verdict: "VERDICT: THE BILLS ARE PAID. PROFESSIONALLY.",
  },
  {
    slug: "manzil-one",
    title: "MANZIL ONE",
    fileNo: "CASE FILE №001",
    classification: "PLATFORM",
    status: "ACTIVE",
    oneLiner:
      "A production-grade, multi-tenant CRM & quotation SaaS — the lead-to-cash pipeline I build at work all day, rebuilt from a blank folder to prove I understand every layer of it.",
    live: "https://manzilone.vercel.app",
    repo: "https://github.com/SyedAbdulKareem13/manzilone",
    stack: [
      "Next.js 15",
      "TypeScript",
      "Prisma",
      "PostgreSQL (Supabase)",
      "Auth.js v5",
      "Framer Motion",
      "Recharts",
    ],
    sections: [
      {
        heading: "THE PROBLEM",
        body: [
          "I spend my days inside an enterprise CRM platform serving consulting and staffing businesses. Those companies live and die by one pipeline: capture a lead, qualify it into an opportunity, price the work, get the quote approved, win the deal. Most CRM tools treat pricing as an afterthought — the quote lives in a spreadsheet, the approval lives in email, and the audit trail lives nowhere.",
          "Manzil One is my answer built from scratch: one system that owns the entire lead-to-quotation flow, designed for manpower, licensing and project-based businesses where the quote IS the product.",
        ],
      },
      {
        heading: "THE BUILD",
        body: [
          "Next.js 15 App Router with server components for fast first paints, Prisma over Postgres with every table multi-tenanted by organizationId from day one, and Auth.js v5 running three providers — Google OAuth, credentials, and email/SMS OTP — behind middleware-guarded routes.",
          "The core is the quoting machinery. An 11-stage pipeline Kanban (drag-and-drop with layout-animated cards) feeds RFQs that support five line types — manpower, non-manpower, software licenses, hardware, services. The quotation builder pulls those lines, applies rate cards (designation × experience × grade × location), and computes markup, discount, tax and margin live as you type. A Position Determination Engine rolls up headcount × duration × monthly rate into cost, revenue and margin per position and across the fleet.",
          "Quotes then enter a four-step approval chain — Sales Exec → Sales Manager → Business Head → Finance — with comments, rejections and a full step-history audit trail, exactly like the enterprise workflows I ship at KEBS.",
        ],
      },
      {
        heading: "DECISIONS THAT MATTERED",
        body: [
          "Multi-tenancy went into the schema on day one rather than being retrofitted — every query is scoped, which is the single decision that separates a demo from a SaaS. Approval chains are modeled as data, not hard-coded steps, so an admin can reshape the chain without a deploy. Quotations are version-controlled instead of mutated, because in real deals the question is always “what changed between v2 and v3?”",
          "The whole thing is seeded with realistic demo data and role-based demo logins, because a CRM you can't click through in thirty seconds is a CRM nobody evaluates.",
        ],
      },
      {
        heading: "OUTCOME",
        body: [
          "Live on Vercel with Supabase Postgres behind it. Auth, pipeline, RFQs, rate cards, quotation math, approvals, reports and an admin console all work end to end. The roadmap (pgvector-backed AI search, S3 uploads, multi-currency snapshots) is scoped in the README — the foundations for each are already in the schema.",
        ],
      },
    ],
    verdict: "VERDICT: THE DAY JOB, WEAPONIZED.",
    unlisted: true,
  },
  {
    slug: "syncwave",
    title: "SYNCWAVE",
    fileNo: "CASE FILE №002",
    classification: "REAL-TIME",
    status: "ACTIVE",
    oneLiner:
      "Silent disco on the web — every device in the room plays the exact same moment of the same song, held in sync by clock math instead of audio streaming.",
    live: "https://syncwave-web-kappa.vercel.app",
    repo: "https://github.com/SyedAbdulKareem13/syncwave-web",
    stack: [
      "Next.js 14",
      "TypeScript",
      "Supabase Realtime",
      "Web Audio",
      "Framer Motion",
      "Playwright",
    ],
    sections: [
      {
        heading: "THE PROBLEM",
        body: [
          "“Press play at the same time” does not work. Every device has a slightly different clock, every network has a different delay, and streaming one audio feed to everyone murders both bandwidth and quality. I wanted a room where a host presses play once and every phone in it lands on the same beat.",
        ],
      },
      {
        heading: "THE SYNC ENGINE",
        body: [
          "SyncWave never streams audio between peers. Each client plays its own copy of the track; the room only broadcasts a tiny playback state — track, playing/paused, position, server timestamp.",
          "Alignment comes from three moves. First, NTP-style clock sync: each client pings a lightweight /api/time endpoint, measures round-trip time, and keeps a median, RTT-filtered offset between its clock and the server's. Second, the state-only model above. Third — the part that actually kills the race condition — future-start scheduling: the host never says “play now,” it says “play at server-time T.” Every client converts T into its own local clock using its measured offset and starts precisely then. The result is sample-accurate, drift-free playback.",
        ],
      },
      {
        heading: "DECISIONS THAT MATTERED",
        body: [
          "Both hard dependencies are behind interfaces. Transport is pluggable — Supabase Realtime for real cross-device rooms, BroadcastChannel for local multi-tab development with zero keys. Playback is pluggable too: HTML5 audio, YouTube, and local files all sit behind one PlaybackAdapter. That's what made the engine testable: a Playwright end-to-end suite covers sync, presence, chat, queue and the time API.",
          "On top of the engine: live rooms with presence, a shared queue, real-time chat and floating reactions — wrapped in a Spider-Verse comic UI because a silent disco should not look like a dashboard.",
        ],
      },
      {
        heading: "OUTCOME",
        body: [
          "Live — open it in two tabs (or two phones) and press play. The README's roadmap points at persistent rooms, host hand-off, and native streaming-SDK adapters.",
        ],
      },
    ],
    verdict: "VERDICT: A LOT OF CLOCK MATH. WORTH IT.",
  },
  {
    slug: "universe-portfolio",
    title: "UNIVERSE PORTFOLIO",
    fileNo: "CASE FILE №003",
    classification: "EXPERIMENT",
    status: "UNSTABLE (INTENTIONAL)",
    oneLiner:
      "A portfolio with a physics playground that bends gravity on the actual letters of the page — up to and including a black hole that swallows the entire site.",
    live: "https://universe-portfolio-orcin.vercel.app",
    repo: "https://github.com/SyedAbdulKareem13/Universe-Portfolio",
    stack: ["three.js + GLSL", "GSAP + ScrollTrigger", "Matter.js", "Lenis", "Zero build step"],
    sections: [
      {
        heading: "THE PREMISE",
        body: [
          "A portfolio should be its own demo. This one opens as a cinematic, scroll-driven site — GLSL fresnel sphere hero, camera flying through six stations, custom cursor, grain and vignette — and stays perfectly readable if you never touch the weird part.",
          "The weird part is a draggable HUD called Laws of the Universe. It puts real 2D rigid-body physics (Matter.js) on the DOM letters of my name and the skill chips, then hands you the dials: Earth, Moon, Mars and Jupiter gravity presets, Zero-G drift, bullet-time Slow-Mo, a time control that freezes, rewinds and fast-forwards through a rolling transform buffer, and a Big Bang that impulse-explodes everything from the center.",
        ],
      },
      {
        heading: "THE BLACK HOLE",
        body: [
          "Tap the black hole once and a singularity forms that spaghettifies and swallows nearby bodies. Tap it again and it escalates: the whole site spirals, blurs and collapses behind a closing iris, an Einstein-ring flash, then a film-style THE END card. One REVIVE button (or Esc) plays the single master GSAP timeline in reverse for a pixel-perfect restore.",
          "The engineering rule that keeps it from feeling like a gimmick: every law change is eased over 0.6–1.2 s and driven by forces, never teleports — nothing ever snaps. And prefers-reduced-motion is honored everywhere; the collapse becomes a gentle fade.",
        ],
      },
      {
        heading: "DECISIONS THAT MATTERED",
        body: [
          "Zero build step, deliberately. Static HTML/CSS/JS with CDN three.js, GSAP, Matter.js and Lenis — the exact engine the animation design was tuned against, so nothing was lost porting to a framework. All content lives in one data.js so the site is editable without touching the engine.",
        ],
      },
      {
        heading: "OUTCOME",
        body: [
          "Live. It is the predecessor of the archive you are reading — the site that taught me people remember software that pushes back.",
        ],
      },
    ],
    verdict: "VERDICT: DO NOT TAP THE BLACK HOLE TWICE. TAP IT TWICE.",
  },
  {
    slug: "smart-umrah",
    title: "SMART UMRAH",
    fileNo: "CASE FILE №004",
    classification: "CRAFT",
    status: "SHIPPED",
    oneLiner:
      "A pixel-perfect, motion-perfect rebuild of a luxury design handoff — every reveal, parallax and calligraphy stroke preserved on a production Next.js stack.",
    live: "https://smart-umrah.vercel.app",
    repo: "https://github.com/SyedAbdulKareem13/smart-umrah",
    stack: ["Next.js 14", "TypeScript (strict)", "Lenis", "IntersectionObserver", "Vercel"],
    sections: [
      {
        heading: "THE BRIEF",
        body: [
          "A faith-forward marketing site for India's first tech-enabled Umrah platform, delivered as a static design prototype. The job: rebuild it on a real stack without losing a single frame of the motion design. “Close enough” was explicitly not the bar — this was an exercise in fidelity.",
        ],
      },
      {
        heading: "THE BUILD",
        body: [
          "Four routes on Next.js 14 App Router in strict TypeScript. The prototype's animation logic was ported 1:1 into a shared engine (lib/motion.ts): Lenis smooth scroll with the same duration, easing and wheel multipliers (plus a native-scroll fallback), IntersectionObserver-driven reveals — fades, slide-ins, clip wipes — honoring per-element delays and staggers, parallax on the hero and imagery, magnetic CTAs, hover sheens, and gold-gradient drift on the gilded headings.",
          "The signature moment is typographic: the hero Talbiyah calligraphy draws itself on via a masked reveal, picks up velocity-driven blur and skew while you scroll, and the verse calligraphy draws on scroll. Six font families are in play, including Amiri Quran, Gulzar and Noto Nastaliq Urdu for the Arabic and Urdu scripts.",
        ],
      },
      {
        heading: "DECISIONS THAT MATTERED",
        body: [
          "Fidelity over reinterpretation: where a framework idiom would have changed the feel, the prototype's approach won. And though the site is static today, it sits on App Router + TypeScript specifically so API routes, server components and a database drop in without a rewrite when the backend arrives.",
        ],
      },
      {
        heading: "OUTCOME",
        body: [
          "Shipped and live. Put the handoff and the build side by side — that diff is the deliverable.",
        ],
      },
    ],
    verdict: "VERDICT: PIXELS RESPECTED. ALL OF THEM.",
    unlisted: true,
  },
  {
    slug: "jarvis",
    title: "JARVIS",
    fileNo: "CASE FILE №005",
    classification: "ROBOT BUTLER",
    status: "LISTENING",
    oneLiner:
      "A Python voice assistant from 2021 — my first hands-on project in speech, automation and computer vision, kept in the archive as the origin specimen.",
    repo: "https://github.com/SyedAbdulKareem13/Jarvis",
    stack: ["Python", "SpeechRecognition", "pyttsx3", "OpenCV", "pywhatkit"],
    sections: [
      {
        heading: "THE ORIGIN",
        body: [
          "Before the enterprise CRMs and the clock math, there was a laptop that talked back. JARVIS listens through the microphone, runs commands through Google's speech recognition, and answers out loud with pyttsx3.",
        ],
      },
      {
        heading: "WHAT IT DOES",
        body: [
          "Wikipedia lookups, time and jokes; web automation that opens and drives Google, YouTube and WhatsApp Web; email over Gmail SMTP and scheduled WhatsApp messages; voice-set alarms, timers and a delayed PC shutdown. The computer-vision half does webcam motion detection and an OpenCV Haar-cascade + LBPH face-recognition trainer.",
        ],
      },
      {
        heading: "WHY IT STAYS IN THE ARCHIVE",
        body: [
          "It is intentionally simple — two standalone scripts, no framework — and stays here unedited as a record of where the journey started. The lineage continued: my machine still boots via a clap-triggered successor. Every archive needs its first specimen.",
        ],
      },
    ],
    verdict: "VERDICT: STILL LISTENING. PROBABLY JUDGING.",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
