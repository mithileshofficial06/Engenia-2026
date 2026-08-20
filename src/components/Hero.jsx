"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { festival } from "@/data/site";
import Countdown from "@/components/Countdown";
import geometry from "@/data/wordmark.json";
import { useWordmarkFlight } from "@/components/WordmarkFlight";
import { sectionAccent } from "@/lib/accents";

/**
 * The opening sequence is timed off the wordmark, not off nothing.
 *
 * WordmarkFlight staggers seven letters at 0.3 + i * 0.12 with a 1.05s drop,
 * so the last one lands at 2.07s. The curtain in globals.css holds until
 * 2.09s and lifts over the following 0.8s; everything below is sequenced
 * after that, which is why these delays start where a page normally would
 * have finished animating. Changing the letter stagger means changing these.
 */
const LOGO_SETTLED = 2.35;

export default function Hero() {
  const ref = useRef(null);
  const { heroSlot } = useWordmarkFlight();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const reduce = useReducedMotion();

  /* Scroll progress arrives as a step function — a wheel notch or a trackpad
     flick delivers it in jumps — so reading x straight off it made the exit
     stutter in exactly the places the timed entrance was smooth. It goes
     through one spring first, and every property below reads that spring, so
     the headline, the drift and the fade all run on the same clock instead of
     three that can disagree by a frame. */
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
    restDelta: 0.0005,
  });

  const contentY = useTransform(progress, [0, 1], [0, 90]);

  /* Two fades, not one. The headline leaves with its own exit — the halves
     are already travelling out the sides, so it should be gone by the time
     they clear — but the counter and the buttons are still sitting in the
     middle of the viewport at that point, and fading them on the headline's
     curve emptied the hero while there was nothing yet to replace it. The
     block below the headline therefore holds full strength until it is
     genuinely on its way off the top, and only then fades. */
  const headlineFade = useTransform(progress, [0, 0.24, 0.66], [1, 0.92, 0]);
  const lowerFade = useTransform(progress, [0, 0.62, 0.98], [1, 1, 0]);

  // Scrolling runs the headline entrance backwards: the two halves part again
  // and travel back out the sides they came in from. The middle stop is the
  // ease — on a straight two-stop ramp the halves leave at full speed from the
  // first pixel of scroll, which is what read as a jerk rather than an exit.
  const travel = reduce ? [0, 0, 0] : [0, 26, 300];
  const partLeft = useTransform(progress, [0, 0.3, 0.68], travel.map((v) => -v));
  const partRight = useTransform(progress, [0, 0.3, 0.68], travel);


  return (
    <section
      ref={ref}
      {...sectionAccent("ember")}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-20 pt-28 sm:pt-32"
    >
      {/* Glow behind the wordmark — now that the art has no black plate, this
          reads through the letters instead of sitting behind a box. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] h-[62vmin] w-[118vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(244,113,21,.20),rgba(211,19,62,.13)_46%,transparent_76%)]"
      />

      <div className="relative z-10 flex w-full flex-col items-center">
        {/* Reserves the wordmark's space and marks where the flight starts.
            The letters themselves are drawn by WordmarkFlight, fixed to the
            viewport, so this section cannot clip them on their way out. */}
        <div
          ref={heroSlot}
          aria-hidden
          className="w-full max-w-[320px] sm:max-w-[520px] md:max-w-[660px] lg:max-w-[780px]"
          style={{ aspectRatio: geometry.aspect }}
        />

        <motion.div style={{ y: contentY }} className="flex w-full flex-col items-center">
          {/* The headline arrives as two halves closing on the centre, and
              leaves the same way in reverse as the hero scrolls away.

              Each half is two nested spans on purpose: the outer one carries
              the scroll-driven exit as a MotionValue, the inner one carries
              the timed entrance. Framer Motion lets `style` and `animate`
              fight over a shared property, and x is claimed by both here, so
              they are kept on separate elements. */}
          <motion.h1
            style={{ opacity: headlineFade }}
            className="font-display mt-4 text-balance text-center text-[1.7rem] font-semibold leading-[1.14] tracking-tight sm:text-4xl md:text-[2.75rem]"
          >
            <motion.span style={{ x: partLeft, willChange: "transform" }} className="inline-block">
              <motion.span
                initial={{ x: reduce ? "0%" : "-60%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                transition={{ delay: LOGO_SETTLED, duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                className="text-fest-split inline-block [background-position:0%_50%]"
              >
                Experience the
              </motion.span>
            </motion.span>{" "}
            <motion.span style={{ x: partRight, willChange: "transform" }} className="inline-block">
              <motion.span
                initial={{ x: reduce ? "0%" : "60%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                transition={{ delay: LOGO_SETTLED, duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                className="text-fest-split inline-block [background-position:100%_50%]"
              >
                Extravaganza
              </motion.span>
            </motion.span>
          </motion.h1>

          {/* Everything under the headline shares one fade, so the date line,
              the counter and the buttons leave together rather than three
              elements dimming at three slightly different moments. */}
          <motion.div style={{ opacity: lowerFade }} className="flex w-full flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: LOGO_SETTLED + 0.55, duration: 0.7 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/55"
            >
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={15} className="text-gold-500" />
                {festival.dates}
              </span>
              <span className="hidden h-4 w-px bg-white/15 sm:block" />
              <span className="inline-flex items-center gap-2">
                <MapPin size={15} className="text-crimson-500" />
                {festival.location}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: LOGO_SETTLED + 0.7, duration: 0.7 }}
              className="mt-9"
            >
              <Countdown target={festival.startsAt} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: LOGO_SETTLED + 0.85, duration: 0.7 }}
              className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
            >
              <Link
                href="/events"
                className="btn btn-solid group inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold"
              >
                Explore Events
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/leaderboard"
                className="btn btn-ghost inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold"
              >
                Live Leaderboard
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
