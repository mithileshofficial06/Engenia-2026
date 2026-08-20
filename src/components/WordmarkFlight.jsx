"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import geometry from "@/data/wordmark.json";

/**
 * The wordmark flies from the hero into the navbar corner one letter at a time.
 *
 * It is rendered exactly once, fixed to the viewport, and driven directly by
 * scroll position rather than by a triggered animation — so the letters track
 * the scrollbar instead of firing off at a threshold. Each letter is offset in
 * the progress window (see STAGGER), which is what makes them peel away and
 * land in sequence rather than as one block.
 *
 * Two empty slots tell it where to be: Hero renders one at full size, Navbar
 * renders the small one in the corner. Both reserve their space in normal
 * layout, so nothing shifts as the letters leave. Routes with no hero simply
 * have no hero slot, and the letters rest docked.
 *
 * Both slots are measured per frame rather than cached. Caching cost a real
 * bug: the navbar slides down on load, so a rect read during that entrance put
 * the landing point up to 80px too high and the letters docked off-screen.
 * Re-measuring also survives font loading and the navbar's own scrolled-state
 * transition.
 *
 * The loop parks itself once the letters have settled and the slots have
 * stopped moving, and wakes on scroll, resize, navigation or a late font load.
 * Free-running it was two forced layouts a frame for the life of the page,
 * on every route — including the ones with no hero, where the letters just
 * sit docked and nothing it computed could ever change.
 */

const FlightContext = createContext(null);
export const useWordmarkFlight = () => useContext(FlightContext);

// How far down the viewport the flight completes, as a fraction of one screen.
const TRAVEL = 0.55;
// Per-letter offset within the 0..1 progress window. Bigger = more sequential.
const STAGGER = 0.07;
// Follow factor: the rendered value chases the scroll-derived target, which
// takes the edge off fast scrolls and trackpad jitter.
const SMOOTH = 0.18;

const COUNT = geometry.letters.length;
const SPAN = 1 - STAGGER * (COUNT - 1);

const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);
const easeOut = (t) => 1 - (1 - t) ** 3;

export function WordmarkFlightProvider({ children }) {
  const heroSlot = useRef(null);
  const dockSlot = useRef(null);

  const value = useMemo(() => ({ heroSlot, dockSlot }), []);

  return (
    <FlightContext.Provider value={value}>
      {children}
      <FlyingWordmark heroSlot={heroSlot} dockSlot={dockSlot} />
    </FlightContext.Provider>
  );
}

// Frames of no measurable change before the loop parks. Long enough to ride
// out the navbar entrance and its 500ms scrolled-state transition.
const SETTLE_FRAMES = 60;

function FlyingWordmark({ heroSlot, dockSlot }) {
  const letterEls = useRef([]);
  const progress = useRef(0);
  const sizedFor = useRef(0);
  const readyRef = useRef(false);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let raf = 0;
    let idle = 0;
    let lastBox = "";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Routes with no hero have nothing to fly: the letters sit docked, the
    // progress target is pinned at 1, and every one of those measurements
    // resolves to the same numbers it did last frame. Waking the loop on their
    // scroll bought two forced layouts a frame to compute a value that cannot
    // move.
    const flies = Boolean(heroSlot.current);

    const frame = () => {
      const dockEl = dockSlot.current;
      const heroEl = heroSlot.current;

      if (dockEl) {
        const dock = dockEl.getBoundingClientRect();
        // The hero slot unmounts on other routes; falling back to the dock box
        // means those pages simply render the letters at rest in the corner.
        const base = heroEl ? heroEl.getBoundingClientRect() : dock;

        if (dock.width > 0 && base.width > 0) {
          // Element sizes only change when the layout does, so avoid touching
          // them on every frame.
          if (Math.abs(base.width - sizedFor.current) > 0.5) {
            sizedFor.current = base.width;
            const height = base.width / geometry.aspect;
            for (let i = 0; i < COUNT; i += 1) {
              const el = letterEls.current[i];
              if (!el) continue;
              el.style.width = `${(geometry.letters[i].width / 100) * base.width}px`;
              el.style.height = `${height}px`;
            }
          }

          const target = heroEl ? clamp01(window.scrollY / (window.innerHeight * TRAVEL)) : 1;
          progress.current = reduce
            ? target
            : progress.current + (target - progress.current) * SMOOTH;

          // Still only if the letters have caught up *and* neither slot has
          // moved since the last frame.
          const box = `${dock.left},${dock.top},${dock.width},${base.left},${base.top},${base.width}`;
          const settled = Math.abs(target - progress.current) < 0.0005 && box === lastBox;
          lastBox = box;
          idle = settled ? idle + 1 : 0;
          if (settled) progress.current = target;

          const p = progress.current;
          const scale = dock.width / base.width;

          for (let i = 0; i < COUNT; i += 1) {
            const el = letterEls.current[i];
            if (!el) continue;

            const e = easeOut(clamp01((p - i * STAGGER) / SPAN));
            const letter = geometry.letters[i];
            const fromX = base.left + (letter.left / 100) * base.width;
            const toX = dock.left + (letter.left / 100) * dock.width;

            const x = fromX + (toX - fromX) * e;
            const y = base.top + (dock.top - base.top) * e;
            const s = 1 + (scale - 1) * e;

            el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
          }

          // Held in a ref as well as in state: reading the state here would
          // have to be a dependency of this effect, and flipping it would then
          // tear down and rebuild the whole loop on the first frame.
          if (!readyRef.current) {
            readyRef.current = true;
            setReady(true);
          }

          if (idle > SETTLE_FRAMES) {
            raf = 0; // parked — scroll, resize, navigation or fonts wake it
            return;
          }
        }
      }

      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      idle = 0;
      if (!raf) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    if (flies) window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    // A font landing late reflows the navbar, and with it the dock slot.
    document.fonts?.ready.then(wake).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
    };
  }, [heroSlot, dockSlot, pathname]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[78] overflow-hidden"
      style={{ opacity: ready ? 1 : 0, transition: "opacity .3s ease" }}
    >
      {geometry.letters.map((letter, i) => (
        <div
          key={letter.src}
          ref={(el) => {
            letterEls.current[i] = el;
          }}
          className="absolute left-0 top-0 origin-top-left overflow-hidden will-change-transform"
        >
          {/* Entrance runs inside the flight transform, so the two never fight:
              the outer element owns position and clipping, this one owns the
              drop-in that slides up through it. */}
          <motion.div
            className="relative h-full w-full"
            initial={{ y: letter.from === "top" ? "-108%" : "108%", opacity: 0, filter: "blur(7px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            transition={{
              y: { duration: 1.05, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
              filter: { duration: 0.75, delay: 0.3 + i * 0.12, ease: "easeOut" },
              opacity: { duration: 0.35, delay: 0.3 + i * 0.12 },
            }}
          >
            <Image
              src={letter.src}
              alt=""
              fill
              priority
              sizes="(max-width: 640px) 320px, (max-width: 1024px) 660px, 780px"
              className="object-fill"
            />
          </motion.div>
        </div>
      ))}
    </div>
  );
}
