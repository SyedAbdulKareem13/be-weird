"use client";

/**
 * Single GSAP entry point — import gsap + plugins from here only, so
 * registration happens exactly once. All Club plugins are free since 3.13.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Draggable } from "gsap/Draggable";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, Draggable);
}

export { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin, Draggable };

/** Charset used by every scramble/decrypt moment — archive flavored. */
export const SCRAMBLE_CHARS = "█▓▒░#%&@$№∆01";
