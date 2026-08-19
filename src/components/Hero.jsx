"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { festival } from "@/data/site";
import Countdown from "@/components/Countdown";
import geometry from "@/data/wordmark.json";
import { useWordmarkFlight } from "@/components/WordmarkFlight";
import { sectionAccent } from "@/lib/accents";

export default function Hero() {
  const ref = useRef(null);
  const { heroSlot } = useWordmarkFlight();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.62], [1, 0]);


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
        className="pointer-events-none absolute left-1/2 top-[42%] h-[62vmin] w-[118vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(244,113,21,.20),rgba(211,19,62,.13)_46%,transparent_72%)] blur-2xl"
      />

      <div className="relative z-10 flex w-full flex-col items-center">
        <motion.div style={{ opacity: fade }} className="mb-9">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.7 }}
            className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.3em] text-white/65 sm:text-[11px]"
          >
            <span className="relative flex h-2 w-2">
              <span className="bg-fest absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" />
              <span className="bg-fest relative inline-flex h-2 w-2 rounded-full" />
            </span>
            {festival.edition}
          </motion.p>
        </motion.div>

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
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="text-fest font-display mt-4 text-balance text-center text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl"
          >
            Experience the Extravaganza
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.7 }}
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
            transition={{ delay: 1.55, duration: 0.7 }}
            className="mt-9"
          >
            <Countdown target={festival.startsAt} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.7 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Link
              href="/events"
              className="bg-fest group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-ink-950 shadow-[0_16px_44px_-14px_rgba(211,19,62,.95)] transition-transform duration-300 hover:scale-[1.04] active:scale-95"
            >
              Explore Events
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/leaderboard"
              className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white/85 transition-colors duration-300 hover:text-cream-100"
            >
              Live Leaderboard
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/30">Scroll</span>
          <span className="h-10 w-px bg-gradient-to-b from-white/35 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
