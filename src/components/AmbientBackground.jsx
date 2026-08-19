"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ACCENTS, DEFAULT_ACCENT } from "@/lib/accents";
import EmberDrift from "@/components/EmberDrift";

/**
 * Fixed, non-interactive backdrop.
 *
 * Three things layer here: drifting colour orbs that take their hue from
 * whichever section you are currently reading, a drift of embers over the top,
 * and the static surface treatment — grid, canvas weave, grain, vignette.
 *
 * The orbs are lit through `--amb-1..3`, which are registered as real colour
 * properties in globals.css. That registration is what lets them transition;
 * an unregistered custom property would snap between hues instead of fading.
 */
export default function AmbientBackground() {
  const pathname = usePathname();
  const driftRef = useRef(null);
  const rootRef = useRef(null);

  // Pointer parallax — the orbs lag behind the cursor just enough to feel alive.
  useEffect(() => {
    const el = driftRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Nothing to lag behind on a touch screen, and the loop is not free.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    // The loop parks itself once the orbs have caught up with the cursor.
    // Left free-running it wrote an identical transform every frame, forever,
    // to the element that parents five 64px-blurred orbs — enough on its own
    // to keep that whole subtree awake on a page that is otherwise still.
    const tick = () => {
      cx += (tx - cx) * 0.045;
      cy += (ty - cy) * 0.045;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;

      if (Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05) {
        raf = 0; // settled — next pointermove wakes it back up
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 40;
      ty = (e.clientY / window.innerHeight - 0.5) * 40;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Follow the accent of whichever section holds the middle of the viewport.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Guarded on the key: --amb-1..3 are registered <color> properties feeding
    // five blurred radial gradients, so touching them restarts a 1.4s
    // transition that repaints and re-blurs all five. pick() runs on every
    // scroll frame, and re-applying the *same* accent there was repainting the
    // whole backdrop continuously while you scrolled.
    let current = null;
    const apply = (key) => {
      const resolved = key && ACCENTS[key] ? key : DEFAULT_ACCENT;
      if (resolved === current) return;
      current = resolved;
      ACCENTS[resolved].ambient.forEach((colour, i) =>
        root.style.setProperty(`--amb-${i + 1}`, colour),
      );
    };

    apply(DEFAULT_ACCENT);

    const visible = new Set();
    const pick = () => {
      // Nearest to the middle of the screen wins, so a short section sandwiched
      // between two tall ones still gets its turn.
      let best = null;
      let bestDist = Infinity;
      const mid = window.innerHeight / 2;
      for (const el of visible) {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = el;
        }
      }
      if (best) apply(best.dataset.accent);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        pick();
      },
      { threshold: [0, 0.15, 0.5] },
    );

    // Sections only change on navigation, so this is keyed off the route
    // rather than watching the DOM — a MutationObserver here would re-scan on
    // every animation-driven mount, of which this page has plenty.
    document.querySelectorAll("[data-accent]").forEach((el) => io.observe(el));
    pick();

    let queued = 0;
    const onScroll = () => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        pick();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      cancelAnimationFrame(queued);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="ambient pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink-950"
    >
      <div ref={driftRef} className="absolute inset-[-15%] will-change-transform">
        <div className="animate-pulse-glow absolute left-[8%] top-[6%] h-[46vmax] w-[46vmax] rounded-full bg-[radial-gradient(circle,var(--amb-1),transparent_62%)] blur-3xl" />
        <div
          className="animate-pulse-glow absolute right-[2%] top-[22%] h-[52vmax] w-[52vmax] rounded-full bg-[radial-gradient(circle,var(--amb-2),transparent_62%)] blur-3xl"
          style={{ animationDelay: "1.4s" }}
        />
        <div
          className="animate-pulse-glow absolute bottom-[-12%] left-[26%] h-[48vmax] w-[48vmax] rounded-full bg-[radial-gradient(circle,var(--amb-3),transparent_60%)] blur-3xl"
          style={{ animationDelay: "2.8s" }}
        />
        <div
          className="animate-pulse-glow absolute bottom-[8%] right-[18%] h-[38vmax] w-[38vmax] rounded-full bg-[radial-gradient(circle,var(--amb-1),transparent_62%)] blur-3xl"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="animate-pulse-glow absolute left-[42%] top-[46%] h-[32vmax] w-[32vmax] rounded-full bg-[radial-gradient(circle,var(--amb-2),transparent_62%)] blur-3xl"
          style={{ animationDelay: "5.4s" }}
        />
      </div>

      <EmberDrift />

      {/* Hairline grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,248,236,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,248,236,.6) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at 50% 0%, #000 20%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, #000 20%, transparent 78%)",
        }}
      />

      {/* Canvas weave — the logo is paint on a surface, so the page has one too */}
      <div className="canvas-tex absolute inset-0 opacity-70" />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(7,4,3,.86)_100%)]" />
    </div>
  );
}
