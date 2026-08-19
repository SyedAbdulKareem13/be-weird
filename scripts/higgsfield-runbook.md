# HIGGSFIELD ASSET RUNBOOK — Specimen Archive media

Generate with the Higgsfield MCP connector (any Claude surface where it's
connected), download, drop files at the paths below, then flip the matching
entry in `src/data/media.ts`. Every feature is dark until its entry exists —
nothing breaks with missing files.

Art direction for ALL assets: palette ink `#0E0C15` / bone `#EFEAE3` /
hazard-orange `#FF4D00` accents · archival/CCTV evidence aesthetic · film
grain · no readable text or logos · no identifiable faces.

---

## 1 · Evidence photos (images, 4:3, ≥1536px wide)

Model suggestion: Soul or Seedream (photorealistic still).
Save to `public/assets/evidence/<slug>.jpg`, then compress:
`npx sharp-cli -i <in> -o public/assets/evidence/<slug>.jpg resize 1536 -q 78`
(or hand me the raws — I'll compress with the sharp devDependency.)

### kebs-crm
> Archival evidence photograph, 4:3, brutalist enterprise control room at
> night: a wall of CRT monitors glowing with spreadsheet grids, a conveyor
> belt carrying paper quotations under a large mechanical approval-stamp arm
> frozen mid-press, one hazard-orange rotating warning beacon, ink-black
> concrete walls, bone-white paper, deep shadows, 35mm film grain, slightly
> damaged photo edges, cinematic, no people.

### syncwave
> Archival evidence photograph, 4:3, a dark room full of silhouetted people
> wearing headphones, every head tilted at the identical angle mid-nod,
> perfectly synchronized, lit only by a single phone screen glowing in the
> center, one tiny orange LED on each headphone, eerie stillness, 35mm film
> grain, damaged photo edges, no faces visible.

### universe-portfolio
> Cinematic astronomy photograph, 4:3, a small glowing website window in
> deep space being stretched and swallowed by a black hole, orange accretion
> ring, pixels spaghettifying into light streams, black-violet void, film
> grain, archival evidence aesthetic.

### jarvis
> Archival evidence photograph, 4:3, a 2010s desktop computer on a cluttered
> desk at night, webcam eye glowing faintly, green audio waveform on a CRT
> monitor, sticky notes on the bezel, one hazard-orange LED in the dark,
> retro tech, 35mm film grain, damaged photo edges, no people.

Then in `src/data/media.ts` add each:

```ts
"kebs-crm": {
  src: "/assets/evidence/kebs-crm.jpg",
  alt: "Reconstruction: a brutalist control room where paper quotations ride a conveyor through a mechanical approval stamp",
  caption: "EVIDENCE PHOTO — RECONSTRUCTION",
},
```

(alt/caption for the others: describe the scene plainly; caption stays
"EVIDENCE PHOTO — RECONSTRUCTION".)

## 2 · Surveillance loop (video, 16:9, 6–10s, seamless loop)

Model suggestion: Kling or Minimax Hailuo, static locked-off shot.
Save `public/assets/footage/surveillance.mp4` (+ first frame as
`surveillance-poster.jpg`). Target ≤2.5MB — 720p is plenty for CCTV.

> Static locked-off CCTV security footage, high corner angle of a dim office
> enclosure at night, a lone silhouetted figure typing at a desk lit only by
> monitor glow, occasional screen flicker, VHS grain and scanlines, nearly
> monochrome with a slight blue-violet tint, subtle analog noise, no camera
> movement, seamless loop, no readable text.

Flip in media.ts:
```ts
export const surveillanceFeed: FootageClip = {
  video: "/assets/footage/surveillance.mp4",
  poster: "/assets/footage/surveillance-poster.jpg",
  label: "CAM 03 — ENCLOSURE",
};
```
→ "VIEW SURVEILLANCE" appears in the ARCHIVE TERMINAL protocols.

## 3 · Escape footage (video, 16:9, 4–6s, seamless loop)

Same models. Save `public/assets/footage/escape.mp4` (+ poster). ≤1.5MB.

> Static locked-off CCTV footage of an empty laboratory containment
> enclosure, glass door bent open outward, a few papers drifting to the
> floor, one fluorescent tube flickering, a hazard-orange warning light
> blinking slowly, VHS grain, near-monochrome, no people, eerie, no camera
> movement, seamless loop.

Flip in media.ts:
```ts
export const escapeFootage: FootageClip = {
  video: "/assets/footage/escape.mp4",
  poster: "/assets/footage/escape-poster.jpg",
  label: "CAM 07 — CONTAINMENT",
};
```
→ the 404 page plays it at 25% opacity behind "THIS SPECIMEN ESCAPED."
