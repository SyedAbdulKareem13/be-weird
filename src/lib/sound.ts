"use client";

/**
 * Synthesized WebAudio sound design — no audio files, no deps.
 * Autoplay-safe: the AudioContext is created on the first user gesture.
 * play() silently no-ops when muted, in boring mode, or under
 * prefers-reduced-motion. Subtle by design (master gain ~0.14).
 */

import { useSyncExternalStore } from "react";

export type SoundName = "clunk" | "snap" | "tick" | "zap" | "boot";

const STORAGE_KEY = "archive-sound";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    muted = localStorage.getItem(STORAGE_KEY) === "off";
  } catch {
    // private mode — default unmuted
  }

  const unlock = () => {
    if (ctx) return;
    try {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = 0.14;
      master.connect(ctx.destination);
    } catch {
      ctx = null;
    }
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

function emit() {
  listeners.forEach((l) => l());
}

export function useSoundMuted(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => muted,
    () => false
  );
}

export function toggleSoundMuted(): void {
  muted = !muted;
  try {
    localStorage.setItem(STORAGE_KEY, muted ? "off" : "on");
  } catch {
    // non-fatal
  }
  emit();
}

function blocked(): boolean {
  if (muted || !ctx || !master) return true;
  if (document.documentElement.getAttribute("data-mode") === "boring")
    return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return true;
  return false;
}

/** White-noise buffer, lazily built once. */
let noiseBuffer: AudioBuffer | null = null;
function getNoise(ac: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const buffer = ac.createBuffer(1, ac.sampleRate * 0.2, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buffer;
  return buffer;
}

function env(ac: AudioContext, peak: number, duration: number): GainNode {
  const gain = ac.createGain();
  const now = ac.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peak, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  return gain;
}

export function play(name: SoundName): void {
  if (typeof window === "undefined" || blocked()) return;
  const ac = ctx as AudioContext;
  const out = master as GainNode;
  if (ac.state === "suspended") void ac.resume();
  const now = ac.currentTime;

  try {
    switch (name) {
      case "clunk": {
        // mechanical lever: low pitch drop + noise thud
        const osc = ac.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.12);
        const g = env(ac, 1, 0.14);
        osc.connect(g).connect(out);
        osc.start(now);
        osc.stop(now + 0.15);

        const noise = ac.createBufferSource();
        noise.buffer = getNoise(ac);
        const lp = ac.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 300;
        const ng = env(ac, 0.5, 0.06);
        noise.connect(lp).connect(ng).connect(out);
        noise.start(now);
        noise.stop(now + 0.08);
        break;
      }
      case "snap": {
        // card flip: bandpassed noise crack
        const noise = ac.createBufferSource();
        noise.buffer = getNoise(ac);
        const bp = ac.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 2000;
        bp.Q.value = 1.2;
        const g = env(ac, 0.8, 0.06);
        noise.connect(bp).connect(g).connect(out);
        noise.start(now);
        noise.stop(now + 0.08);
        break;
      }
      case "tick": {
        const osc = ac.createOscillator();
        osc.type = "square";
        osc.frequency.value = 1200;
        const g = env(ac, 0.16, 0.018);
        osc.connect(g).connect(out);
        osc.start(now);
        osc.stop(now + 0.025);
        break;
      }
      case "zap": {
        const osc = ac.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
        const lp = ac.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 2400;
        const g = env(ac, 0.5, 0.16);
        osc.connect(lp).connect(g).connect(out);
        osc.start(now);
        osc.stop(now + 0.18);
        break;
      }
      case "boot": {
        [440, 660].forEach((freq, i) => {
          const osc = ac.createOscillator();
          osc.type = "sine";
          osc.frequency.value = freq;
          const start = now + i * 0.09;
          const g = ac.createGain();
          g.gain.setValueAtTime(0, start);
          g.gain.linearRampToValueAtTime(0.4, start + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);
          osc.connect(g).connect(out);
          osc.start(start);
          osc.stop(start + 0.1);
        });
        break;
      }
    }
  } catch {
    // audio failures are never worth crashing over
  }
}
