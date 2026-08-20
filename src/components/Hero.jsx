"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
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

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.62], [1, 0]);

  // Scrolling runs the headline entrance backwards: the two halves part again
  // and travel back out the sides they came in from.
  const partLeft = useTransform(scrollYProgress, [0, 0.5], [0, reduce ? 0 : -280]);
  const partRight = useTransform(scrollYProgress, [0, 0.5], [0, reduce ? 0 : 280]);


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

        <motion.div style={{ y: contentY, opacity: fade }} className="flex w-full flex-col items-center">
          {/* The headline arrives as two halves closing on the centre, and
              leaves the same way in reverse as the hero scrolls away.

              Each half is two nested spans on purpose: the outer one carries
              the scroll-driven exit as a MotionValue, the inner one carries
              the timed entrance. Framer Motion lets `style` and `animate`
              fight over a shared property, and x is claimed by both here, so
              they are kept on separate elements. */}
          <h1 className="font-display mt-4 text-balance text-center text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            <motion.span style={{ x: partLeft }} className="inline-block">
              <motion.span
                initial={{ x: reduce ? "0%" : "-60%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                transition={{ delay: LOGO_SETTLED, duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                className="text-fest-split inline-block [background-position:0%_50%]"
              >
                Experience the
              </motion.span>
            </motion.span>{" "}
            <motion.span style={{ x: partRight }} className="inline-block">
              <motion.span
                initial={{ x: reduce ? "0%" : "60%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                transition={{ delay: LOGO_SETTLED, duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                className="text-fest-split inline-block [background-position:100%_50%]"
              >
                Extravaganza
              </motion.span>
            </motion.span>
          </h1>

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
      </div>
    </section>
  );
}
