/**
 * SPECIMEN ARCHIVE — single source of truth.
 * Content payload from the master brief (§6), updated July 2026 from the
 * current resume (Forward Deployed Engineer era). Real facts only.
 */

export const identity = {
  name: "SYED ABDUL KAREEM",
  logoMark: "SYD/13",
  role: "FORWARD DEPLOYED ENGINEER",
  archiveNo: "№13",
  company: "KEBS (Kaar Enterprise Business Suites)",
  location: "TAMIL NADU, IN",
  email: "syedazeeem.13@gmail.com",
  phone: "+91 9391245975",
  github: "https://github.com/SyedAbdulKareem13",
  githubHandle: "SyedAbdulKareem13",
  linkedin: "https://www.linkedin.com/in/syed-abdul-kareem-b33519200/",
  resumePdf: "/resume.pdf",
  heroSubline:
    "I build enterprise CRM platforms by day and weird internet things by night. This site is the evidence.",
};

export const heroLabels = {
  topLeft: "ARCHIVE ENTRY №13",
  topRight: "SUBJECT: FORWARD DEPLOYED ENGINEER",
  bottomLeft: "LOCATION: TAMIL NADU, IN",
  // bottomRight is the live IST clock, rendered client-side
};

export const tickerPhrases = ["BE WEIRD", "SHIP THINGS", "STAY CURIOUS"];

export const rotatingRoles = [
  "FORWARD DEPLOYED ENGINEER",
  "ANGULAR ALCHEMIST",
  "SPRING BOOT MECHANIC",
  "GEN-AI TINKERER",
  "RAG PLUMBER",
  "PIXEL WRANGLER",
  "SAAS ARCHITECT",
  "PROFESSIONAL WEIRDO",
];

export const fieldNotes = {
  stamp: "OBSERVATION LOG",
  headline: "MOSTLY HARMLESS. OCCASIONALLY BRILLIANT.",
  manifesto:
    "Four years inside enterprise CRM taught me how software behaves at scale — multi-tenant platforms, config-driven UIs, systems that cannot go down. I work both sides of the wire: Angular in the browser, and Java with Spring Boot in a microservices architecture behind it, talking over REST APIs and shipped through Docker and Jenkins. Lately the interesting half is KAIS — putting language models inside software that cannot afford to be wrong, which turns out to be less about prompts and more about boundaries: what the model is allowed to see, what it is allowed to compute, and who signs off on what it says. Nights taught me the opposite lesson: software should also make you feel something. This archive holds both. The classified files pay the bills. The exhibits keep me weird.",
  facts: [
    "EXP: 3.5+ YRS",
    "CURRENT HOST: KEBS · 4 PRODUCT LINES",
    "BACKEND: JAVA · SPRING BOOT · NODE",
    "DIET: 100G PROTEIN/DAY",
    "KNOWN WEAKNESS: SIDE PROJECTS",
  ],
};

export type SkillGroup = {
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "FRONTEND",
    items: [
      "Angular",
      "React",
      "Next.js",
      "TypeScript",
      "RxJS",
      "SCSS/Tailwind",
      "Micro-Frontends",
      "GSAP",
      "three.js/R3F",
    ],
  },
  {
    label: "BACKEND",
    items: [
      "Java",
      "Spring Boot",
      "Spring Data JPA",
      "Microservices",
      "REST APIs",
      "Node.js",
      "Express",
      "NestJS",
      "Socket.IO",
      "API Gateway",
      "JWT/Passport",
    ],
  },
  {
    label: "DATA",
    items: ["MongoDB", "MySQL", "AWS RDS", "Prisma", "Supabase"],
  },
  {
    label: "INFRA",
    items: ["Docker", "Jenkins", "AWS S3/EC2", "Azure Pipelines"],
  },
  {
    label: "GEN-AI",
    items: [
      "LLM Orchestration",
      "RAG",
      "Embeddings",
      "Vector Search",
      "MongoDB Atlas Vector Search",
      "Prompt Engineering",
      "Agentic Workflows",
      "LangChain",
    ],
  },
];

export type Exhibit = {
  fileNo: string;
  title: string;
  description: string;
  stack: string[];
  clazz: string;
  status: string;
  /** public repo — absent for enterprise work */
  repo?: string;
  live?: string;
  /** benched from all listings (data + dossier stay intact) */
  hidden?: boolean;
};

export const exhibits: Exhibit[] = [
  {
    fileNo: "FILE №000",
    title: "KEBS CRM",
    description:
      "The multi-tenant enterprise CRM + PSA platform I build at KEBS — the suite rebuilt end to end as V2 (Accounts, Opportunity, Quote, Contacts, Leads, Campaign), crowned by a Quote Builder that computes revenue, cost and margin live and walks every deal through a multi-level approval chain to Quote-to-Cash.",
    stack: ["Angular", "RxJS", "Node.js", "MongoDB", "MySQL", "Docker · Jenkins"],
    clazz: "ENTERPRISE",
    status: "IN PRODUCTION",
  },
  {
    fileNo: "FILE №001",
    title: "LEADS",
    description:
      "The Leads Management System at KEBS, built end to end on Java and Spring Boot in a microservices architecture — capture, tracking, qualification and conversion into Opportunity and Quote-to-Cash — with the Angular console on top of its REST APIs.",
    stack: [
      "Java",
      "Spring Boot",
      "Microservices",
      "REST APIs",
      "MySQL",
      "Angular",
      "Docker · Jenkins",
    ],
    clazz: "ENTERPRISE",
    status: "IN PRODUCTION",
  },
  {
    fileNo: "FILE №002",
    title: "KAIS",
    description:
      "The AI layer across the KEBS suite — natural-language CRM search that retires the filter stack, generated pipeline summaries, permission-safe document summarisation, semantic search that finds a word buried on page seven of ten, and the KAIS agents that draft quotations off rate cards and recommend people allocations inside the rules.",
    stack: [
      "LLM Orchestration",
      "RAG",
      "Embeddings",
      "MongoDB Atlas Vector Search",
      "Node.js",
      "Angular",
      "MongoDB",
    ],
    clazz: "GEN-AI",
    status: "IN PRODUCTION",
  },
  {
    fileNo: "FILE №003",
    title: "MANZIL ONE",
    description:
      "Production-ready multi-tenant CRM SaaS for consulting, staffing and project businesses: lead-to-quote pipeline, RFQs, live margin math, AI-powered workflows.",
    stack: ["Next.js 15", "Prisma", "Supabase", "TypeScript", "AI"],
    clazz: "PLATFORM",
    status: "ACTIVE",
    repo: "https://github.com/SyedAbdulKareem13/manzilone",
    live: "https://manzilone.vercel.app",
    hidden: true,
  },
  {
    fileNo: "FILE №004",
    title: "SYNCWAVE",
    description:
      "Silent disco on the web: a host picks a track, every device in the room hears the exact same moment of the song in perfect sync — NTP-style clock magic.",
    stack: ["TypeScript", "Supabase Realtime", "Web Audio"],
    clazz: "REAL-TIME",
    status: "ACTIVE",
    repo: "https://github.com/SyedAbdulKareem13/syncwave-web",
    live: "https://syncwave-web-kappa.vercel.app",
  },
  {
    fileNo: "FILE №005",
    title: "UNIVERSE PORTFOLIO",
    description:
      "3D “Laws of the Universe” physics playground; a black hole swallows the whole site into THE END, then REVIVE restores it.",
    stack: ["three.js", "GSAP", "Lenis", "Matter.js"],
    clazz: "EXPERIMENT",
    status: "UNSTABLE (INTENTIONAL)",
    repo: "https://github.com/SyedAbdulKareem13/Universe-Portfolio",
    live: "https://universe-portfolio-orcin.vercel.app",
  },
  {
    fileNo: "FILE №006",
    title: "SMART UMRAH",
    description:
      "Luxury Umrah-booking frontend; pixel-perfect recreation of the design handoff with every animation preserved.",
    stack: ["Next.js", "TypeScript"],
    clazz: "CRAFT",
    status: "SHIPPED",
    repo: "https://github.com/SyedAbdulKareem13/smart-umrah",
    live: "https://smart-umrah.vercel.app",
    hidden: true,
  },
  {
    fileNo: "FILE №007",
    title: "JARVIS",
    description:
      "Python desktop voice assistant: speech control, web automation, email/WhatsApp, OpenCV face recognition.",
    stack: ["Python", "OpenCV", "Speech"],
    clazz: "ROBOT BUTLER",
    status: "LISTENING",
    repo: "https://github.com/SyedAbdulKareem13/Jarvis",
  },
];

export type ClassifiedFile = {
  fileNo: string;
  title: string;
  /** rendered under redaction bars; decrypts on hover */
  description: string;
};

export const classified: ClassifiedFile[] = [
  {
    fileNo: "FILE №C-01",
    title: "CRM V2 SUITE",
    description:
      "Ground-up rebuild of the entire CRM: Accounts V2, Opportunity V2, Quote V2, Contacts V2, Leads V2, Campaign V2 — config-driven forms and grids from MongoDB, Kanban, audit logs, per-tenant customization.",
  },
  {
    fileNo: "FILE №C-02",
    title: "QUOTE BUILDER (Q2C)",
    description:
      "Enterprise deal management wired into CRM, ERP and Projects: live Revenue/Cost/GM% math in RxJS, multi-level approvals, milestone billing, price masking, projection reports.",
  },
  {
    fileNo: "FILE №C-03",
    title: "INTEGRATION SYSTEMS",
    description:
      "The layer that keeps CRM, People Allocation and Timesheet in sync — a closed deal flows into staffing and time tracking without anyone re-entering data.",
  },
  {
    fileNo: "FILE №C-04",
    title: "KAIS · THE AI LAYER",
    description:
      "The assistant layer running across the suite. One rule holds all of it together: the model proposes, the platform decides — no direct database access, no arithmetic, and no permission it did not already have.",
  },
  {
    fileNo: "FILE №C-05",
    title: "DOCUMENT MANAGER",
    description:
      "Platform-wide plugin: AWS S3 storage with MongoDB versioning, AES encryption, signed URLs, role-based access, Gotenberg previews for PDF and Office.",
  },
  {
    fileNo: "FILE №C-06",
    title: "THE 3,800-CALL FREEZE",
    description:
      "Traced a one-second UI freeze on the heaviest CRM list to 3,800+ repeated sanitizer calls in one handler; replaced innerHTML with real templates and virtual scrolling.",
  },
  {
    fileNo: "FILE №C-07",
    title: "CRM AI SEARCH",
    description:
      "Ask instead of filter: “enterprise deals in Chennai that stalled after the quote went out” becomes a validated filter object built against the tenant's own field config, then executed by the existing query layer with every permission intact.",
  },
  {
    fileNo: "FILE №C-08",
    title: "PIPELINE SUMMARY",
    description:
      "The pipeline in a paragraph — what moved, what stalled, what is at risk and whose desk it sits on. The platform computes every number; the model only narrates the ones it is handed.",
  },
  {
    fileNo: "FILE №C-09",
    title: "SAFE SUMMARISATION",
    description:
      "Document summaries that cannot leak: access checked before a page is ever read, tenant isolation on the retrieval path, sensitive fields redacted pre-prompt, and nothing retained after the answer.",
  },
  {
    fileNo: "FILE №C-10",
    title: "SEMANTIC DOC SEARCH",
    description:
      "Page-level embeddings in MongoDB Atlas Vector Search: one word buried on page seven of a ten-page contract surfaces the document and the page, ranked beside the keyword hits rather than instead of them.",
  },
  {
    fileNo: "FILE №C-11",
    title: "KAIS QUOTATION AGENT",
    description:
      "Rate cards, anonymised history from every past quote, and the opportunity's own service type, duration and estimate go in; a drafted quotation comes out. The Quote Builder still does the money math, and a human still signs.",
  },
  {
    fileNo: "FILE №C-12",
    title: "KAIS ALLOCATION AGENT",
    description:
      "Staffing recommendations where the rules are hard constraints, not suggestions: skills, availability, cost band, location and utilisation filter the field deterministically, then the model ranks who fits and says why.",
  },
];

export const classifiedFootnote = "Names withheld. Impact wasn't.";

export type Incident = {
  year: string;
  title: string;
  detail: string;
};

export const incidents: Incident[] = [
  {
    year: "2022",
    title: "FIRST CONTACT",
    detail:
      "Joined KEBS as an intern. Shipped the Payment app frontend — 3 personas, 14 screens — live within two sprints, in month one.",
  },
  {
    year: "2023",
    title: "ESCALATION",
    detail:
      "Junior developer. Built the Leads system end to end on Java and Spring Boot microservices, the Exit app (4 personas / 23 screens / 25+ APIs), and the Dockerized demo environments sales still runs on.",
  },
  {
    year: "2024–25",
    title: "FULL OUTBREAK",
    detail:
      "Senior developer. Owned the CRM frontend for ~30 sprints and rebuilt it as CRM V2 — Accounts, Opportunity, Quote, Contacts, Leads, Campaign. Quote Builder, Document Manager, the 3,800-call freeze fix.",
  },
  {
    year: "2026–NOW",
    title: "AI ERA",
    detail:
      "Forward Deployed Engineer. Four product lines owned end to end — CRM, People Allocation, Timesheet, Integrations — and KAIS, the AI layer across them: natural-language search, semantic document retrieval, and the agents that draft quotations and staff projects. Client calls to production rollouts, fixes shipped the same week.",
  },
];

export const countUpStats = [
  { value: 4, suffix: "", label: "PRODUCT LINES OWNED" },
  { value: 10, suffix: "+", label: "PROJECTS WORKED ON" },
  { value: 5, suffix: "+", label: "SHARED MODULES & OPEN LIBS" },
  { value: Infinity, suffix: "", label: "CURIOSITY" },
];

export const badge = {
  headline: "EVERY SPECIMEN GETS A BADGE.",
  subline: "Go on. Yank it.",
  cardLines: ["SYED ABDUL KAREEM", "FORWARD DEPLOYED ENGINEER", "ARCHIVE №13"],
  qrTarget: "https://github.com/SyedAbdulKareem13",
};

export const contact = {
  headline: "LET'S MAKE SOMETHING WEIRD",
  availability: "STATUS: OPEN TO INTERESTING PROBLEMS · TZ: IST (UTC+5:30)",
  toast: "COORDINATES COPIED",
};

export const footer = {
  fallingWords: [
    "angular",
    "react",
    "java",
    "spring boot",
    "node",
    "mongodb",
    "rag",
    "embeddings",
    "weird",
    "curious",
    "caffeine",
  ],
  colophon:
    "BUILT WITH NEXT.JS 16 · REACT BITS · GSAP · ANIME.JS · MOTION · AN UNREASONABLE AMOUNT OF ENTHUSIASM — HANDCRAFTED IN TAMIL NADU · © 2026 SYED ABDUL KAREEM",
  sourceUrl: "https://github.com/SyedAbdulKareem13/be-weird",
};

export const bootLog = [
  "> locating specimen…",
  "> calibrating weirdness…",
  "> 98%… 99%…",
  "WELCOME TO THE ARCHIVE",
];

export const calmToast =
  "We calmed it down for you. The lever brings the weird back.";

/* ============================================================
   BORING MODE — the professional document.
   Rendered by BoringResume when the lever is pulled.
   ============================================================ */

export type ResumeRole = {
  title: string;
  org: string;
  period: string;
  bullets: string[];
};

export const boringResume = {
  name: "Syed Abdul Kareem",
  headline:
    "Forward Deployed Engineer · Full Stack · Java & Spring Boot Microservices · Generative AI · SaaS, CRM & Q2C",
  summary:
    "Full-stack developer with 3.5+ years at KEBS, a multi-tenant CRM and PSA platform, promoted from intern to Forward Deployed Engineer. I own end-to-end delivery for four product lines — CRM, People Allocation, Timesheet, and Integration Systems — sitting between enterprise clients and the codebase: requirements on client calls, solution design, build across Angular, Java/Spring Boot and Node.js, and staying through UAT and go-live. On the backend I work in Java with Spring Boot in a microservices architecture — designing service boundaries, building the REST APIs the front ends consume, working against MySQL and MongoDB, and shipping the services as Docker containers through Jenkins pipelines. I also build the platform's AI layer, KAIS: natural-language search that compiles to validated filters, retrieval-augmented document search over page-level embeddings in MongoDB Atlas Vector Search, and assistant agents for quotation drafting and people allocation — all designed so the model proposes and the platform decides. Known for shipping complex features in days without regressions, and for building the shared libraries and tooling the rest of the team now runs on.",
  roles: [
    {
      title: "Forward Deployed Engineer",
      org: "KEBS — Kaar Enterprise Business Suites",
      period: "Jan 2026 — Present",
      bullets: [
        "Own four product lines end to end — CRM, People Allocation, Timesheet, and Integration Systems — from requirement calls through design, build, UAT, and production rollout.",
        "Built and maintain the integration layer that keeps CRM, People Allocation, and Timesheet in sync: a closed deal flows into resource allocation and time tracking without re-entry.",
        "Run tenant-specific rollouts on the platform's MongoDB configuration engine using idempotent migration scripts that are safe to re-run in any environment.",
        "Built KAIS, the suite's AI layer: natural-language CRM search that compiles a prompt into a validated filter object against each tenant's field config, generated pipeline summaries narrated over platform-computed figures, and permission-safe document summarisation.",
        "Implemented semantic document search with page-level chunking and embeddings indexed in MongoDB Atlas Vector Search, so a term appearing once inside a long document surfaces both the document and the page, ranked alongside keyword results.",
        "Shipped the KAIS quotation agent — rate cards, anonymised historical quotes, and opportunity context (service type, duration, estimate) drafted into a quotation the Quote Builder prices and a human approves — and the allocation agent, which ranks staffing options inside deterministic rule constraints.",
        "Act as the technical face of the product for client teams — demos, architecture walkthroughs, and same-week turnaround on UAT feedback.",
      ],
    },
    {
      title: "Senior Software Developer",
      org: "KEBS",
      period: "Jul 2024 — Dec 2025",
      bullets: [
        "Owned the CRM suite frontend for ~30 sprints and rebuilt it as CRM V2: Accounts, Opportunity, Quote, Contacts, Leads, and Campaign modules.",
        "Architected the Quote Builder (deal management) integrated with CRM, ERP, and Projects — dynamic reactive forms, automated Revenue/Cost/GM% computation, multi-level approvals, milestone billing, and data masking.",
        "Built the platform-wide Document Manager: AWS S3 with MongoDB versioning, AES encryption, signed URLs, role-based access, and Gotenberg previews.",
        "Traced a one-second UI freeze to 3,800+ repeated sanitizer calls in a single handler; replaced innerHTML bindings with Angular templates and virtual scrolling.",
        "Published shared Angular libraries (@kebs-lib/ui, @kebs-lib/forms) now standard across the product.",
      ],
    },
    {
      title: "Junior Software Developer",
      org: "KEBS",
      period: "Jun 2023 — Jun 2024",
      bullets: [
        "Built the Leads Management System end to end on Java and Spring Boot in a microservices architecture — capture, tracking, conversion into CRM and Quote-to-Cash — exposing the REST APIs behind the Angular console and cutting data retrieval time ~40% with debounced search and smart caching.",
        "Delivered the Exit application (HR separation workflows) full stack: 4 personas, 23 screens, 25+ APIs, across 10 sprints.",
        "Set up the multi-tenant demo environment on Docker and Jenkins so sales can spin up isolated, pre-seeded client demos in minutes.",
        "Shipped reporting across the product: Azure DevOps-backed product dashboard, project insight charts, and a real-time CRM activity dashboard.",
      ],
    },
    {
      title: "Software Engineer Intern",
      org: "KEBS",
      period: "Dec 2022 — May 2023",
      bullets: [
        "Shipped production code from the first month: built the Payment application frontend (3 personas, 14 screens) and took it live within two sprints.",
        "Converted to a full-time developer role in six months.",
      ],
    },
    {
      title: "Machine Learning Engineer Intern",
      org: "Ericsson",
      period: "Jul 2022 — Sep 2022",
      bullets: [
        "Cleaned and validated large telecom datasets, applied statistical techniques to surface patterns, and presented findings that fed the analytics team's decisions.",
      ],
    },
  ] satisfies ResumeRole[],
  education: {
    school: "Puducherry Technological University",
    degree: "B.Tech, Information Technology",
    period: "2019 — 2023",
  },
  footnote:
    "This is the calm version. The lever in the top-right corner brings back the weird.",
};
