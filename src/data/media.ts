/**
 * GENERATED MEDIA MANIFEST — Higgsfield assets land here.
 *
 * Every consumer renders NOTHING when an entry is absent, so this file is
 * the single switch: drop the file in /public/assets/… , add the entry,
 * and the feature lights up. Generation prompts + specs live in
 * scripts/higgsfield-runbook.md.
 */

export type EvidencePhoto = {
  src: string;
  alt: string;
  caption: string;
};

/** Keyed by case-study slug. */
export const evidencePhotos: Record<string, EvidencePhoto> = {
  // "kebs-crm": {
  //   src: "/assets/evidence/kebs-crm.jpg",
  //   alt: "Reconstruction: a brutalist control room where paper quotations ride a conveyor through a mechanical approval stamp",
  //   caption: "EVIDENCE PHOTO — RECONSTRUCTION",
  // },
};

export type FootageClip = {
  video: string;
  poster?: string;
  label: string;
};

/** Terminal protocol: VIEW SURVEILLANCE (appears only when set). */
export const surveillanceFeed: FootageClip | null = null;
// export const surveillanceFeed: FootageClip = {
//   video: "/assets/footage/surveillance.mp4",
//   poster: "/assets/footage/surveillance-poster.jpg",
//   label: "CAM 03 — ENCLOSURE",
// };

/** 404 background loop (appears only when set). */
export const escapeFootage: FootageClip | null = null;
// export const escapeFootage: FootageClip = {
//   video: "/assets/footage/escape.mp4",
//   poster: "/assets/footage/escape-poster.jpg",
//   label: "CAM 07 — CONTAINMENT",
// };
