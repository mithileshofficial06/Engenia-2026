"use client";

import { motion } from "motion/react";
import Flourish from "@/components/Flourish";
import { sectionAccent } from "@/lib/accents";

export default function PageHeader({ eyebrow, title, accent, subtitle, hue = "ember", children }) {
  return (
    <header {...sectionAccent(hue)} className="relative px-4 pb-10 pt-28 sm:pt-32 md:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 h-[38vmin] w-[90vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgb(var(--accent-rgb)_/_.2),transparent_68%)] blur-2xl"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="glass inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70"
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }} />
            {eyebrow}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="text-fest font-display mt-5 text-balance text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
        >
          {/* The accent word no longer takes the section hue on its own: the
              whole heading is painted in the logo arc, and a solid colour
              inside it would punch a flat hole through the spread. */}
          {title} {accent}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/55 sm:text-lg"
          >
            {subtitle}
          </motion.p>
        )}

        <Flourish className="mt-6 h-5 w-full max-w-md text-[var(--accent)] opacity-55" />

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-8 w-full"
          >
            {children}
          </motion.div>
        )}
      </div>
    </header>
  );
}
