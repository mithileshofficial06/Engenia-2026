"use client";

import { useEffect, useRef } from "react";

/**
 * Slow-rising embers, like ash off a stage light.
 *
 * Kept deliberately cheap: particles are drawn from two pre-rendered sprites
 * rather than building a radial gradient per particle per frame, the count
 * scales with viewport area, and the loop stops entirely when the tab is
 * hidden or the user asks for reduced motion.
 */

// Warm only. The section-reactive orbs behind carry the colour shifts; sparks
// that turn teal stop reading as fire.
const SPARK_COLOURS = ["255 197 84", "244 113 21"];

const DENSITY = 1 / 13000; // particles per px² of viewport
const MAX_PARTICLES = 130;

function makeSprite(rgb) {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgb(${rgb} / 1)`);
  grad.addColorStop(0.35, `rgb(${rgb} / .45)`);
  grad.addColorStop(1, `rgb(${rgb} / 0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export default function EmberDrift() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const sprites = SPARK_COLOURS.map(makeSprite);

    let width = 0;
    let height = 0;
    let particles = [];
    let raf = 0;
    let last = performance.now();

    const spawn = (seeded) => ({
      x: Math.random() * width,
      // Seeded particles start scattered up the screen; later ones enter below.
      y: seeded ? Math.random() * height : height + Math.random() * 60,
      r: 5 + Math.random() * 16,
      rise: 8 + Math.random() * 22, // px per second
      drift: (Math.random() - 0.5) * 14,
      phase: Math.random() * Math.PI * 2,
      wobble: 0.4 + Math.random() * 1.1,
      alpha: 0.25 + Math.random() * 0.5,
      sprite: sprites[Math.random() < 0.62 ? 0 : 1],
    });

    const resize = () => {
      // Capped below the display density on purpose: every particle is a soft
      // 64px sprite with no edge to sharpen, so the extra pixels of a 2x buffer
      // buy nothing visible and cost ~78% more fill per frame under "lighter".
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(MAX_PARTICLES, Math.round(width * height * DENSITY));
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const frame = (now) => {
      // Seconds since last frame, clamped so a backgrounded tab does not
      // teleport every particle off screen when it resumes.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (const p of particles) {
        p.y -= p.rise * dt;
        p.phase += p.wobble * dt;
        p.x += (p.drift + Math.sin(p.phase) * 10) * dt;

        if (p.y < -40 || p.x < -60 || p.x > width + 60) {
          Object.assign(p, spawn(false));
          continue;
        }

        // Fade out over the top third so they dissolve rather than clip.
        const fade = p.y < height * 0.34 ? Math.max(0, p.y / (height * 0.34)) : 1;
        ctx.globalAlpha = p.alpha * fade * (0.72 + Math.sin(p.phase * 1.6) * 0.28);
        ctx.drawImage(p.sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full opacity-70" />;
}
