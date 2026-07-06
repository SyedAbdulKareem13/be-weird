/**
 * SPECIMEN ARCHIVE — single source of truth.
 * Content payload from the master brief (§6). Real facts only.
 */

export const identity = {
  name: "SYED ABDUL KAREEM",
  logoMark: "SYD/13",
  role: "FULL STACK DEVELOPER",
  archiveNo: "№13",
  company: "KEBS (Kaar Enterprise Business Suites)",
  location: "TAMIL NADU, IN",
  email: "syedazeeem.13@gmail.com",
  github: "https://github.com/SyedAbdulKareem13",
  githubHandle: "SyedAbdulKareem13",
  linkedin: "https://www.linkedin.com/in/syed-abdul-kareem-b33519200/",
  resumePdf: "/resume.pdf",
  heroSubline:
    "I build enterprise CRM platforms by day and weird internet things by night. This site is the evidence.",
};

export const heroLabels = {
  topLeft: "ARCHIVE ENTRY №13",
  topRight: "SUBJECT: FULL-STACK DEVELOPER",
  bottomLeft: "LOCATION: TAMIL NADU, IN",
  // bottomRight is the live IST clock, rendered client-side
};

export const tickerPhrases = ["BE WEIRD", "SHIP THINGS", "STAY CURIOUS"];

export const fieldNotes = {
  stamp: "OBSERVATION LOG",
  headline: "MOSTLY HARMLESS. OCCASIONALLY BRILLIANT.",
  manifesto:
    "Four years inside enterprise CRM taught me how software behaves at scale — 200-plus micro-frontends, config-driven UIs, systems that cannot go down. Nights taught me the opposite lesson: software should also make you feel something. This archive holds both. The classified files pay the bills. The exhibits keep me weird.",
  facts: [
    "EXP: 4+ YRS",
    "CURRENT HOST: KEBS, HYDERABAD",
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
      "SCSS/Tailwind",
      "GSAP",
      "three.js/R3F",
    ],
  },
  {
    label: "BACKEND",
    items: ["Node.js", "Express", "NestJS", "Socket.IO"],
  },
  {
    label: "DATA",
    items: ["MySQL", "MongoDB", "Prisma", "Supabase"],
  },
  {
    label: "INFRA+AI",
    items: ["Docker", "Jenkins", "AWS", "GenAI/LLM Integration"],
  },
];

export type Exhibit = {
  fileNo: string;
  title: string;
  description: string;
  stack: string[];
  clazz: string;
  status: string;
  repo: string;
};

export const exhibits: Exhibit[] = [
  {
    fileNo: "FILE №001",
    title: "MANZIL ONE",
    description:
      "Multi-tenant CRM & quotation platform: lead-to-quote pipeline, RFQs, live margin math, multi-step approvals.",
    stack: ["Next.js 15", "Prisma", "Supabase", "TypeScript"],
    clazz: "PLATFORM",
    status: "ACTIVE",
    repo: "https://github.com/SyedAbdulKareem13/manzilone",
  },
  {
    fileNo: "FILE №002",
    title: "SYNCWAVE",
    description:
      "Real-time synchronized listening: press play once, every device stays on the same beat via NTP-style clock sync.",
    stack: ["TypeScript", "Socket.IO", "Web Audio"],
    clazz: "REAL-TIME",
    status: "ACTIVE",
    repo: "https://github.com/SyedAbdulKareem13/syncwave-web",
  },
  {
    fileNo: "FILE №003",
    title: "UNIVERSE PORTFOLIO",
    description:
      "3D “Laws of the Universe” physics playground; a black hole swallows the whole site into THE END, then REVIVE restores it.",
    stack: ["three.js", "GSAP", "Lenis", "Matter.js"],
    clazz: "EXPERIMENT",
    status: "UNSTABLE (INTENTIONAL)",
    repo: "https://github.com/SyedAbdulKareem13/Universe-Portfolio",
  },
  {
    fileNo: "FILE №004",
    title: "SMART UMRAH",
    description:
      "Luxury Umrah-booking frontend; pixel-perfect recreation of the design handoff with every animation preserved.",
    stack: ["Next.js", "TypeScript"],
    clazz: "CRAFT",
    status: "SHIPPED",
    repo: "https://github.com/SyedAbdulKareem13/smart-umrah",
  },
  {
    fileNo: "FILE №005",
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
    title: "OPPORTUNITY V2",
    description:
      "Ground-up rebuild of the CRM's core module: config-driven forms/grids from MongoDB, Kanban, audit logs, per-tenant customization.",
  },
  {
    fileNo: "FILE №C-02",
    title: "AI OPPORTUNITY SEARCH",
    description:
      "GPT-backed natural-language → structured filter resolution with layered trust boundaries.",
  },
  {
    fileNo: "FILE №C-03",
    title: "MICRO-FRONTEND ARCHITECTURE",
    description:
      "200+ apps composed into one product; shared design system; independent deploys.",
  },
  {
    fileNo: "FILE №C-04",
    title: "WEBAUTHN FINGERPRINT LOGIN",
    description: "Passwordless biometric auth for the platform.",
  },
  {
    fileNo: "FILE №C-05",
    title: "EXIT APP & PAYMENT APP",
    description:
      "End-to-end ownership: 4 personas / 23 screens and 3 personas / 14 screens respectively.",
  },
  {
    fileNo: "FILE №C-06",
    title: "OKR MODULE",
    description: "Shipped as reusable internal npm packages.",
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
    year: "2021",
    title: "FIRST CONTACT",
    detail: "Joined KEBS. Specimen enters the enterprise habitat.",
  },
  {
    year: "2022–24",
    title: "ESCALATION",
    detail:
      "Owned Exit App: 4 personas / 23 screens. Payment App. Full CRM revamp.",
  },
  {
    year: "2024–NOW",
    title: "FULL OUTBREAK",
    detail:
      "Opportunity V2, AI search, 200+ micro-frontend architecture, WebAuthn login.",
  },
];

export const countUpStats = [
  { value: 4, suffix: "+", label: "YRS" },
  { value: 200, suffix: "+", label: "MICRO-FRONTENDS" },
  { value: 25, suffix: "-NODE", label: "DEMO INFRA" },
  { value: Infinity, suffix: "", label: "CURIOSITY" },
];

export const badge = {
  headline: "EVERY SPECIMEN GETS A BADGE.",
  subline: "Go on. Yank it.",
  cardLines: ["SYED ABDUL KAREEM", "FULL STACK DEVELOPER", "ARCHIVE №13"],
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
    "node",
    "mongodb",
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
