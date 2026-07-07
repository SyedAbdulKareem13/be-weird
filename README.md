# BE WEIRD — THE SPECIMEN ARCHIVE

> **The specimen archive of one (1) weird developer.**
> Everything is labeled, stamped, barcoded, and slightly wrong on purpose.
> Enterprise work is `[REDACTED]`. Side projects are `EXHIBITS`. You are the researcher.

**Live:** https://be-weird-syed.vercel.app

The portfolio of **Syed Abdul Kareem** — full-stack developer. Enterprise CRM
platforms by day, weird internet things by night. This site is the evidence.

## The one signature risk

A physical **BORING MODE lever** in the nav, styled like an emergency switch:

> *IN CASE OF RECRUITER — PULL.*

Pulling it strips every effect and renders the entire site as a calm, clean,
perfectly readable one-page resume. Pulling it again restores full weirdness
with a glitch transition. It doubles as the accessibility strategy —
`prefers-reduced-motion` flips it automatically.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Effects | React Bits (TS-TW variants) |
| React animation | Motion (motion.dev) |
| Timeline / SVG / stagger | anime.js v4 |
| Scroll scenes + text | GSAP + ScrollTrigger + SplitText + ScrambleText |
| Smooth scroll | Lenis |
| 3D | three · @react-three/fiber · drei · rapier · meshline (Lanyard only, lazy chunk) |
| State | Zustand (mode / konami) |
| Palette | cmdk (`Ctrl+K` → ARCHIVE TERMINAL) |

## Effect ledger

TextPressure · custom canvas particle typography · MagnetLines · physics
Lanyard (drag it, or `Ctrl+K → yank the lanyard`) · DecryptedText · GSAP
SplitText scroll lines · ScrambledText email · ScrollVelocity headers ·
CurvedLoop ticker · StickerPeel stickers · VariableProximity · GlareHover ·
CountUp · FallingText footer physics · GlitchText · FuzzyText 404 · Noise
grain · ClickSpark · pixel-wipe preloader · anime.js staggers + SVG spine
drawing · Motion springs · Lenis · custom crosshair cursor · the BORING lever.

Also: a Konami code. And a self-destruct command that doesn't.

## Local setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

Badge/QR textures are pre-generated (`node scripts/generate-badge.mjs`,
outputs committed).

## Design system

Deep violet-black `#0E0C15` · aged bone `#EFEAE3` · safety-orange `#FF4D00`
(the only accent allowed on interactive elements) · ultraviolet `#6E4BFF`
stamps · taxi `#FFD400` caution tape (max 2 per viewport). Type: Bricolage
Grotesque (display) · Archivo (body) · Space Mono (specimen labels) · Roboto
Flex (hero pressure type).

---

`SYD-∞-13 · HANDLE WITH CURIOSITY`
