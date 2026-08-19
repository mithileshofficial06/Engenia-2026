"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { departments } from "@/data/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Flourish from "@/components/Flourish";
import { sectionAccent } from "@/lib/accents";

export default function Departments() {
  return (
    <section id="departments" {...sectionAccent("jade")} className="relative px-4 py-24 sm:py-32 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Flourish className="mx-auto mb-9 h-5 w-full max-w-md text-[var(--accent)] opacity-55" />

        <SectionHeading
          eyebrow="The contenders"
          title="Participating"
          accent="Departments"
          subtitle="Seven departments competing for cultural supremacy."
        />

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept, i) => (
            <Reveal key={dept.code} from="scale" delay={0.05 * i}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="glass group relative h-full overflow-hidden rounded-2xl p-6"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-25 blur-2xl transition-opacity duration-700 group-hover:opacity-60"
                  style={{ background: `radial-gradient(circle, ${dept.accent}, transparent 65%)` }}
                />
                <span
                  className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ background: `linear-gradient(90deg, ${dept.accent}, transparent)` }}
                />

                <div className="relative flex items-start justify-between gap-3">
                  <h3
                    className="font-display text-3xl font-black tracking-tight sm:text-4xl"
                    style={{ color: dept.accent }}
                  >
                    {dept.code}
                  </h3>
                  <ArrowUpRight
                    size={18}
                    className="mt-1 shrink-0 text-white/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/70"
                  />
                </div>

                <p className="relative mt-3 text-pretty text-sm leading-relaxed text-white/55">{dept.name}</p>

                <div className="relative mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4">
                  <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/35">
                    Department Team
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-white/70">{dept.points} pts</span>
                </div>
              </motion.article>
            </Reveal>
          ))}

          <Reveal from="scale" delay={0.05 * departments.length}>
            <Link
              href="/leaderboard"
              className="group relative flex h-full min-h-[186px] flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed border-white/15 p-6 text-center transition-colors duration-500 hover:border-white/35"
            >
              <span className="bg-fest absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.07]" />
              <span className="font-display relative text-2xl font-bold text-white/85">See who's ahead</span>
              <span className="relative inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.24em] text-white/45">
                Full leaderboard
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
