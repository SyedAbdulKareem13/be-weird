"use client";

/**
 * SPECIMEN 01 — custom canvas particle typography (no library).
 * Draws `text` on an offscreen canvas, samples opaque pixels into targets,
 * and lets ~3000 particles (~1200 on mobile) spring toward them. Pointer
 * repulsion within 90px on fine pointers only; particles reassemble on idle.
 * The rAF loop pauses when the canvas is offscreen or the tab is hidden.
 * devicePixelRatio is capped at 2. Resize re-samples (debounced).
 */

import { useEffect, useRef } from "react";

export type ParticleTypographyProps = {
  text: string;
  className?: string;
  /** Base particle color — defaults to the --bone token. */
  particleColor?: string;
  /** ~8% of particles use this — defaults to the --hazard token. */
  accentColor?: string;
  /** Pixel gap between sampled points. Lower = denser. Default 3 (4 on mobile). */
  density?: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  k: number;
  drag: number;
  size: number;
  fill: string;
};

const MAX_PARTICLES_DESKTOP = 4200;
const MAX_PARTICLES_MOBILE = 1200;
const REPEL_RADIUS = 90;
const REPEL_RADIUS_SQ = REPEL_RADIUS * REPEL_RADIUS;
const REPEL_FORCE = 5.5;
const ACCENT_RATIO = 0.08;

function readToken(el: Element, name: string, fallback: string): string {
  const value = getComputedStyle(el).getPropertyValue(name).trim();
  return value || fallback;
}

/** Normalize any CSS color through the canvas (returns #rrggbb for opaque colors). */
function normalizeColor(
  ctx: CanvasRenderingContext2D,
  input: string,
  fallback: string
): string {
  ctx.fillStyle = fallback;
  ctx.fillStyle = input; // invalid values are silently ignored, fallback stays
  return typeof ctx.fillStyle === "string" ? ctx.fillStyle : fallback;
}

function rgba(color: string, alpha: number): string {
  if (color.startsWith("#") && color.length === 7) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return color;
}

export default function ParticleTypography({
  text,
  className,
  particleColor,
  accentColor,
  density,
}: ParticleTypographyProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;
    let inView = false;
    let rafId: number | null = null;
    let resizeTimer: number | null = null;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const pointer = { x: 0, y: 0, active: false };

    const shouldRun = () => inView && !disposed && !reduced && !document.hidden;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      let currentFill = "";
      for (const p of particles) {
        if (p.fill !== currentFill) {
          currentFill = p.fill;
          ctx.fillStyle = currentFill;
        }
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    };

    const physics = () => {
      let px = 0;
      let py = 0;
      let repel = false;
      if (pointer.active && finePointer) {
        const rect = canvas.getBoundingClientRect();
        px = pointer.x - rect.left;
        py = pointer.y - rect.top;
        repel = true;
      }
      for (const p of particles) {
        if (repel) {
          const dx = p.x - px;
          const dy = p.y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 > 0.01 && d2 < REPEL_RADIUS_SQ) {
            const d = Math.sqrt(d2);
            const f = (1 - d / REPEL_RADIUS) * REPEL_FORCE;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        // spring toward target, then bleed velocity
        p.vx += (p.tx - p.x) * p.k;
        p.vy += (p.ty - p.y) * p.k;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
      }
    };

    const step = () => {
      rafId = null;
      physics();
      draw();
      if (shouldRun()) rafId = requestAnimationFrame(step);
    };

    const kick = () => {
      if (rafId === null && shouldRun()) rafId = requestAnimationFrame(step);
    };

    const sample = () => {
      width = wrapper.clientWidth;
      height = wrapper.clientHeight;
      if (width < 10 || height < 10) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // offscreen text raster at CSS-pixel resolution
      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;

      const family = readToken(wrapper, "--font-bricolage", "") || "sans-serif";
      octx.font = `bold 100px ${family}`;
      // upgrade to condensed where the canvas font shorthand supports font-stretch
      octx.font = `bold condensed 100px ${family}`;
      const metrics = octx.measureText(text);
      const glyphH =
        (metrics.actualBoundingBoxAscent || 75) +
        (metrics.actualBoundingBoxDescent || 25);
      const scale = Math.min(
        (width * 0.94) / Math.max(metrics.width, 1),
        (height * 0.82) / Math.max(glyphH, 1)
      );
      const fontPx = Math.max(12, Math.floor(100 * scale));
      octx.font = `bold ${fontPx}px ${family}`;
      octx.font = `bold condensed ${fontPx}px ${family}`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillStyle = "#ffffff";
      octx.fillText(text, width / 2, height / 2);

      const isMobile = window.innerWidth < 768;
      const gap = Math.max(2, Math.round(density ?? (isMobile ? 4 : 3)));
      const image = octx.getImageData(0, 0, width, height).data;
      const targets: { x: number; y: number }[] = [];
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          if (image[(y * width + x) * 4 + 3] > 128) targets.push({ x, y });
        }
      }
      if (targets.length === 0) return;

      // shuffle so capping keeps an even spread, then cap
      for (let i = targets.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = targets[i];
        targets[i] = targets[j];
        targets[j] = tmp;
      }
      const cap = isMobile ? MAX_PARTICLES_MOBILE : MAX_PARTICLES_DESKTOP;
      if (targets.length > cap) targets.length = cap;

      const bone = normalizeColor(
        ctx,
        particleColor ?? readToken(wrapper, "--bone", "#EFEAE3"),
        "#EFEAE3"
      );
      const hazard = normalizeColor(
        ctx,
        accentColor ?? readToken(wrapper, "--hazard", "#FF4D00"),
        "#FF4D00"
      );
      const palette = [
        rgba(bone, 0.38),
        rgba(bone, 0.55),
        rgba(bone, 0.72),
        rgba(bone, 0.9),
      ];
      const accentFill = rgba(hazard, 0.95);

      const next: Particle[] = new Array(targets.length);
      for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        const old = particles[i];
        next[i] = {
          x: old ? old.x : Math.random() * width,
          y: old ? old.y : Math.random() * height,
          vx: old ? old.vx : 0,
          vy: old ? old.vy : 0,
          tx: t.x,
          ty: t.y,
          k: 0.015 + Math.random() * 0.025,
          drag: 0.85 + Math.random() * 0.05,
          size: 1.3 + Math.random() * 1.7,
          fill:
            Math.random() < ACCENT_RATIO
              ? accentFill
              : palette[Math.floor(Math.random() * palette.length)],
        };
      }
      // group same fills into runs so draw() changes fillStyle rarely
      next.sort((a, b) => (a.fill < b.fill ? -1 : a.fill > b.fill ? 1 : 0));
      particles = next;

      if (reduced) {
        // no animation: settle instantly, render once
        for (const p of particles) {
          p.x = p.tx;
          p.y = p.ty;
        }
        draw();
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
        kick();
      },
      { rootMargin: "80px" }
    );
    io.observe(wrapper);

    const onVisibility = () => kick();
    document.addEventListener("visibilitychange", onVisibility);

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onPointerGone = () => {
      pointer.active = false;
    };
    if (finePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onPointerGone);
    }

    const ro = new ResizeObserver(() => {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeTimer = null;
        if (disposed) return;
        sample();
        draw();
        kick();
      }, 200);
    });
    ro.observe(wrapper);

    sample();
    draw();
    kick();

    // once webfonts land, re-sample so the raster matches Bricolage
    void document.fonts.ready.then(() => {
      if (disposed) return;
      sample();
      draw();
      kick();
    });

    return () => {
      disposed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (finePointer) {
        window.removeEventListener("pointermove", onPointerMove);
        document.documentElement.removeEventListener("mouseleave", onPointerGone);
      }
    };
  }, [text, particleColor, accentColor, density]);

  return (
    <div
      ref={wrapperRef}
      role="img"
      aria-label={`3,000 particles pretending to be the words ${text}`}
      className={className ?? "h-full w-full"}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
    </div>
  );
}
