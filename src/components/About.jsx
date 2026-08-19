"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { about, festival } from "@/data/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Flourish from "@/components/Flourish";
import BrushRule from "@/components/BrushRule";
import Counter from "@/components/Counter";
import { ACCENTS, accentVars, sectionAccent } from "@/lib/accents";
import { DROPCAP_SRC, MOTIFS } from "@/lib/assets";

export default function About() {
  // The drop cap is a picture of an E, so it can only stand in for a real one.
  const opensOnE = about.body.startsWith("E");

  return (
    <section id="about" {...sectionAccent("azure")} className="relative px-4 py-16 sm:py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Flourish className="mx-auto mb-6 h-5 w-full max-w-md text-[var(--accent)] opacity-55" />

        <SectionHeading
          eyebrow="Who we are"
          title="About"
          accent="EnGenia"
          subtitle={`${festival.college}.`}
        />

        {/* ── The spread: prose left, figures right ──────────────────── */}
        <div className="mt-12 grid gap-10 md:grid-cols-[1.55fr_1fr] md:gap-12">
          <Reveal from="right">
            <div className="relative">
              {/* Drop cap cut from the logo's own E, with the paragraph set to
                  flow around it the way a printed programme would. Only used
                  when the copy actually opens on an E — otherwise the text
                  renders whole and unaltered. */}
              {opensOnE && (
                <span className="float-left mr-4 mt-1.5 block h-[4.6rem] w-[2.5rem] sm:h-[5.6rem] sm:w-[3rem]">
                  <Image
                    src={DROPCAP_SRC}
                    alt=""
                    width={228}
                    height={422}
                    className="h-full w-full object-contain object-left drop-shadow-[0_0_28px_rgba(244,113,21,.35)]"
                  />
                </span>
              )}

              <p className="text-pretty text-lg leading-[1.75] text-cream-300/75 sm:text-xl sm:leading-[1.8]">
                {/* The drop cap is an image, so the letter it stands in for has
                    to be given back to screen readers here. */}
                {opensOnE && <span className="sr-only">E</span>}
                {opensOnE ? about.body.slice(1) : about.body}
              </p>

              <BrushRule width={180} className="mt-8 text-[var(--accent)] opacity-60" />
            </div>
          </Reveal>

          {/* Stats as a hairline rail, not boxes */}
          <Reveal from="left" delay={0.12}>
            <dl className="divide-y divide-cream-400/12 border-y border-cream-400/12">
              {about.stats.map((stat) => (
                <div key={stat.label} className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="text-[11px] font-medium uppercase tracking-[0.26em] text-cream-400/70">
                    {stat.label}
                  </dt>
                  <dd className="font-display text-3xl font-bold tabular-nums text-cream-100 sm:text-4xl">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* ── The four pillars, each carrying a figure from the logo ──── */}
        <div className="mt-12 grid gap-3 sm:gap-4 md:grid-cols-2">
          {about.pillars.map((pillar, i) => (
            <Reveal key={pillar.title} from="up" delay={0.06 * i}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                style={accentVars(ACCENTS[pillar.hue])}
                className="glass group relative h-full overflow-hidden rounded-2xl p-7 sm:p-8"
              >
                {/* The figure, large and ghosted, bleeding off the right edge */}
                <Image
                  src={MOTIFS[pillar.motif]}
                  alt=""
                  aria-hidden
                  width={320}
                  height={640}
                  className="pointer-events-none absolute -right-2 top-1/2 h-[125%] w-auto -translate-y-1/2 object-contain opacity-[0.13] mix-blend-screen transition-all duration-700 group-hover:-right-1 group-hover:opacity-25"
                />

                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgb(var(--accent-rgb)_/_.3),transparent_65%)] opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
                />

                <span
                  className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
                />

                <div className="relative max-w-[78%]">
                  <span
                    className="font-display text-3xl font-black leading-none tabular-nums opacity-45 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ color: "var(--accent)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3 className="font-display mt-3 text-balance text-xl font-bold leading-snug text-cream-100 sm:text-2xl">
                    {pillar.title}
                  </h3>

                  <BrushRule width={64} className="mt-3 text-[var(--accent)] opacity-70" />

                  <p className="mt-3 text-pretty text-sm leading-relaxed text-cream-300/60 sm:text-base">
                    {pillar.body}
                  </p>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
