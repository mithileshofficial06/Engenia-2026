"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { highlights } from "@/data/site";
import SectionHeading from "@/components/SectionHeading";
import Flourish from "@/components/Flourish";
import SectionShell from "@/components/SectionShell";

/**
 * Cultural Highlights, as a deck of photographs rather than a row of them.
 *
 * The section used to be a horizontal scroll track showing three cards at
 * once. It is now a single centred stack: one dominant card with the rest
 * layered behind it, and every five seconds the top card is lifted off, swung
 * aside and slotted into the back of the deck while the one beneath rises to
 * take its place.
 *
 * The rotation is a real reorder, not an index swap with a crossfade. `order`
 * holds the deck sequence and is rotated on each tick; each card looks up its
 * own position in that array to find its depth slot. Because the cards keep
 * stable keys and never unmount, Framer Motion animates each one from the slot
 * it held to the slot it now holds, which is what produces the physical read.
 * Staying mounted also means the photographs decode once and are never
 * re-fetched as the deck cycles.
 */

const AUTOPLAY_MS = 5000;
const DURATION = 0.8;
const EASE = [0.22, 1, 0.36, 1];

/**
 * Depth slots, front to back.
 *
 * The deck peels upward, so what you see of each card behind the front one is
 * its top edge — photograph. Stacking them downward instead showed only the
 * foot of each card, which is where the caption gradient is darkest, so the
 * whole stack read as black strips rather than as layered pictures.
 *
 * Offsets are percentages of the card height rather than pixels, because the
 * card is 600px tall on a desktop and 269px on a phone; a fixed 26px peek is
 * subtle on one and a third of the way up the other. The visible peek works
 * out as the offset minus half the scale inset, so these give roughly 5%, 9%
 * and 12% of card height.
 */
const DEPTH = [
  { scale: 1, y: "0%", opacity: 1, z: 40 },
  { scale: 0.95, y: "-7.5%", opacity: 0.85, z: 30 },
  { scale: 0.9, y: "-14%", opacity: 0.6, z: 20 },
  { scale: 0.85, y: "-19.5%", opacity: 0.38, z: 10 },
];
// Cards deeper than the visible slots are parked, invisible, at the back.
const PARKED = { scale: 0.82, y: "-23%", opacity: 0, z: 0 };

/**
 * How far through its flight the departing card keeps a raised z-index.
 *
 * z-index cannot be interpolated, so this is a timed swap rather than an
 * animated property. The card has to stay above the deck long enough to clear
 * the cards that would otherwise occlude it; by 45% it has lifted and moved
 * aside, and dropping it behind the stack at that point is invisible.
 */
const RAISE_FRACTION = 0.45;

const SWIPE_DISTANCE = 70;
const SWIPE_VELOCITY = 450;

export default function Highlights() {
  const reduce = useReducedMotion();

  // Held as one object so the rotation and the card that is mid-flight can
  // never disagree about which card just left the front.
  const [{ order, flying }, setStack] = useState(() => ({
    order: highlights.map((_, i) => i),
    flying: null,
  }));

  // Bumped by any manual navigation, purely to restart the autoplay timer so a
  // tap is not immediately followed by an automatic advance.
  const [cycle, setCycle] = useState(0);
  const [raised, setRaised] = useState(null);

  const next = useCallback(() => {
    setStack(({ order: o }) => ({
      order: [...o.slice(1), o[0]],
      flying: o[0],
    }));
  }, []);

  const prev = useCallback(() => {
    setStack(({ order: o }) => ({
      order: [o[o.length - 1], ...o.slice(0, -1)],
      flying: null,
    }));
  }, []);

  const goTo = useCallback((target) => {
    setStack(({ order: o }) => {
      const pos = o.indexOf(target);
      if (pos <= 0) return { order: o, flying: null };
      return { order: [...o.slice(pos), ...o.slice(0, pos)], flying: null };
    });
  }, []);

  const manual = useCallback((fn) => {
    fn();
    setCycle((c) => c + 1);
  }, []);

  // Autoplay, but only while the deck is actually on screen.
  //
  // This is the single most expensive thing the home page was doing. The deck
  // is five 960px photographs stacked on one another, and a tick animates
  // x/y/rotate/scale/opacity across all five at once, each with a large blurred
  // box shadow — so every five seconds the browser spent most of a second
  // repainting the lot. It did that from the moment the page loaded, forever,
  // including while you were reading the hero three screens above it and while
  // the section was nowhere near the viewport. The observer keeps the interval
  // idle until the deck is visible and stops it again when it leaves.
  const deckRef = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = deckRef.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setLive(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Restarts whenever the user navigates by hand, or the deck comes back.
  useEffect(() => {
    if (!live) return undefined;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [next, cycle, live]);

  useEffect(() => {
    if (flying == null) return undefined;
    if (reduce) {
      setRaised(null);
      return undefined;
    }
    setRaised(flying);
    const id = setTimeout(
      () => setRaised(null),
      DURATION * 1000 * RAISE_FRACTION,
    );
    return () => clearTimeout(id);
  }, [flying, reduce]);

  const active = order[0];
  const transition = reduce
    ? { duration: 0 }
    : { duration: DURATION, ease: EASE };

  return (
    <SectionShell id="highlights" hue="crimson" band className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Flourish className="mx-auto mb-6 h-5 w-full max-w-md text-[var(--accent)] opacity-55" />

        <SectionHeading
          index={3}
          eyebrow="Look back"
          title="Cultural"
          accent="Highlights"
          subtitle="A glimpse of LICET's vibrant cultural spirit."
        />
      </div>

      <div className="mt-16 overflow-x-clip sm:mt-28">
        <div className="px-4 md:px-8">
          <div
            aria-roledescription="carousel"
            aria-label="Cultural highlights"
            className="relative mx-auto w-full max-w-[960px]"
          >
            {/* The aspect box reserves the deck height and fixes the card
                footprint. Cards sit absolutely inside it and translate up out
                of it, which the margin above the deck accounts for. */}
            <div ref={deckRef} className="relative aspect-[4/3] sm:aspect-[16/10]">
              {highlights.map((item, i) => {
                const slot = order.indexOf(i);
                const depth = DEPTH[slot] ?? PARKED;
                const isActive = slot === 0;
                const isFlying = flying === i && !reduce;

                return (
                  <motion.figure
                    key={item.src}
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${highlights.length}: ${item.title}`}
                    className="absolute inset-0 origin-center overflow-hidden rounded-[24px] bg-ink-800 ring-1 ring-inset ring-white/12"
                    style={{
                      zIndex: raised === i ? 60 : depth.z,
                      // Only the front card takes input; the ones behind must not
                      // swallow a click or a drag aimed at it.
                      pointerEvents: isActive ? "auto" : "none",
                      boxShadow: isActive
                        ? "0 34px 90px -34px rgba(0,0,0,.95)"
                        : "0 18px 50px -28px rgba(0,0,0,.85)",
                    }}
                    animate={
                      isFlying
                        ? {
                            // Slid down and out with a tilt, as if lifted off
                            // the deck, then carried up and back into it. The
                            // outward leg runs against the direction of travel
                            // on purpose: the deck stacks upward, so a card that
                            // only moved up would read as shrinking in place.
                            x: ["0%", "9%", "0%"],
                            y: ["0%", "8%", depth.y],
                            rotate: [0, 4, 0],
                            scale: [1, 1.02, depth.scale],
                            opacity: [1, 1, depth.opacity],
                          }
                        : {
                            x: 0,
                            y: depth.y,
                            rotate: 0,
                            scale: depth.scale,
                            opacity: depth.opacity,
                          }
                    }
                    transition={
                      isFlying
                        ? { ...transition, times: [0, 0.42, 1] }
                        : transition
                    }
                    drag={isActive && !reduce ? "x" : false}
                    dragSnapToOrigin
                    dragElastic={0.16}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (
                        info.offset.x < -SWIPE_DISTANCE ||
                        info.velocity.x < -SWIPE_VELOCITY
                      ) {
                        manual(next);
                      } else if (
                        info.offset.x > SWIPE_DISTANCE ||
                        info.velocity.x > SWIPE_VELOCITY
                      ) {
                        manual(prev);
                      }
                    }}
                    whileHover={
                      isActive && !reduce
                        ? { y: "-1%", scale: 1.01 }
                        : undefined
                    }
                  >
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 92vw, 960px"
                      className="select-none object-cover"
                      draggable={false}
                    />

                    {/* Cinematic wash over the lower half, so the caption reads
                      on any photograph without dimming the whole frame. */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 via-40% to-transparent" />

                    <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-9 md:p-10">
                      <span className="bg-fest mb-3 block h-[3px] w-10" />
                      <h3 className="font-display text-balance text-lg font-semibold leading-tight text-cream-100 sm:text-xl md:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 max-w-xl text-pretty text-sm leading-relaxed text-white/65 sm:mt-3 sm:line-clamp-3 sm:text-base">
                        {item.body}
                      </p>
                    </figcaption>
                  </motion.figure>
                );
              })}
            </div>

            {/* The stack rises out of the top of the box, so nothing has to be
              cleared underneath it. */}
            <div className="relative z-50 mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => manual(prev)}
                aria-label="Previous highlight"
                className="glass flex h-9 w-9 items-center justify-center text-white/70 transition hover:bg-white/[0.08] hover:text-cream-100"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-2">
                {highlights.map((item, i) => (
                  <button
                    key={item.src}
                    type="button"
                    onClick={() => manual(() => goTo(i))}
                    aria-label={`Go to highlight ${i + 1}`}
                    aria-current={active === i}
                    className={`h-1.5 transition-all duration-300 ${
                      active === i
                        ? "bg-fest w-7"
                        : "w-1.5 bg-white/25 hover:bg-white/45"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => manual(next)}
                aria-label="Next highlight"
                className="glass flex h-9 w-9 items-center justify-center text-white/70 transition hover:bg-white/[0.08] hover:text-cream-100"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
