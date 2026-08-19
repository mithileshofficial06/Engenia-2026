"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { departments } from "@/data/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Flourish from "@/components/Flourish";
import BrushRule from "@/components/BrushRule";
import { sectionAccent } from "@/lib/accents";

// Cord lengths. Kept gentle — enough that the row is not mechanical, small
// enough that the name plates below still read as a line.
const DROP = [0, 14, 6, 18, 4, 12, 8];

// Pennant: square shoulders, V-notch out of the bottom.
const PENNANT = "polygon(0 0, 100% 0, 100% 84%, 50% 100%, 0 84%)";

const GOLD = "#eb9512";

function rgbOf(hex) {
  const n = Number.parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export default function Departments() {
  const still = useReducedMotion();

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

        {/* The hall: a gilded rail with seven banners hung off it. Standings
            live on the leaderboard — this section is only about who competes. */}
        <div className="relative mt-24">
          {/* rail, with a soft glow and tapered ends */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-[2px] rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD} 12%, ${GOLD} 88%, transparent)`,
              boxShadow: `0 0 14px rgb(${rgbOf(GOLD)} / .5)`,
              opacity: 0.75,
            }}
          />

          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-4 lg:grid-cols-7 lg:gap-x-3">
            {departments.map((dept, i) => {
              const rgb = rgbOf(dept.accent);
              const drop = DROP[i % DROP.length];

              return (
                <Reveal
                  key={dept.code}
                  as="li"
                  from="down"
                  delay={0.05 * i}
                  className="flex flex-col items-center"
                >
                  {/* ring on the rail */}
                  <span
                    aria-hidden
                    className="-mt-[6px] h-3 w-3 shrink-0 rounded-full border-2 bg-ink-950"
                    style={{ borderColor: GOLD, boxShadow: `0 0 10px rgb(${rgbOf(GOLD)} / .6)` }}
                  />
                  {/* cord */}
                  <span
                    aria-hidden
                    className="w-px shrink-0"
                    style={{
                      height: drop + 16,
                      background: `linear-gradient(to bottom, rgb(${rgbOf(GOLD)} / .75), rgb(${rgb} / .5))`,
                    }}
                  />

                  <motion.div
                    className="w-full origin-top"
                    animate={still ? undefined : { rotate: [-0.9, 0.9, -0.9] }}
                    transition={
                      still
                        ? undefined
                        : { duration: 5.5 + i * 0.45, repeat: Infinity, ease: "easeInOut" }
                    }
                  >
                    <div className="group flex flex-col items-center">
                      <div className="relative w-full transition-transform duration-500 group-hover:-translate-y-1">
                        <div
                          className="relative flex flex-col items-center justify-center gap-2 px-2 py-5"
                          style={{
                            clipPath: PENNANT,
                            aspectRatio: "0.74",
                            // Dyed cloth: the hue near-solid at the top, sinking
                            // into ink at the hem. Deep enough that ivory type
                            // reads cleanly on every one of the seven.
                            background: `linear-gradient(180deg, rgb(${rgb} / .95), rgb(${rgb} / .68) 46%, rgb(${rgb} / .34) 78%, rgb(${rgb} / .22)), #0d0907`,
                            filter: `drop-shadow(0 16px 20px rgb(0 0 0 / .55))`,
                          }}
                        >
                          {/* woven folds + a broad highlight down the left third */}
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 opacity-40"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(90deg, rgb(0 0 0 / .22) 0 1px, transparent 1px 15px)",
                            }}
                          />
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0"
                            style={{
                              backgroundImage:
                                "linear-gradient(100deg, transparent 8%, rgb(255 248 236 / .16) 32%, transparent 58%)",
                            }}
                          />
                          {/* gilt trim along the top edge */}
                          <span
                            aria-hidden
                            className="absolute inset-x-0 top-0 h-[3px]"
                            style={{ background: `linear-gradient(90deg, ${GOLD}, #ffc554, ${GOLD})` }}
                          />
                          {/* stitched inner border */}
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-[6px] opacity-45"
                            style={{
                              clipPath: PENNANT,
                              border: `1px dashed rgb(255 248 236 / .38)`,
                            }}
                          />

                          <span aria-hidden className="relative text-[9px] leading-none" style={{ color: GOLD }}>
                            ◆
                          </span>

                          <span
                            className="font-display relative text-center text-2xl font-black leading-none tracking-tight text-cream-100 sm:text-[1.75rem]"
                            style={{ textShadow: "0 2px 12px rgb(0 0 0 / .55)" }}
                          >
                            {dept.code}
                          </span>

                          <BrushRule width={40} className="relative opacity-80" style={{ color: GOLD }} />
                        </div>

                        {/* tassel at the hem */}
                        <span
                          aria-hidden
                          className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-[5px] rotate-45"
                          style={{ background: GOLD, boxShadow: `0 0 10px rgb(${rgbOf(GOLD)} / .7)` }}
                        />
                      </div>

                      <p className="mt-6 text-balance text-center text-[11px] leading-snug text-cream-300/60 transition-colors duration-500 group-hover:text-cream-100">
                        {dept.name}
                      </p>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </ul>
        </div>

        <Reveal from="up" delay={0.1} className="mt-16 flex justify-center">
          <Link
            href="/leaderboard"
            className="glass group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold text-cream-200/85 transition-colors duration-300 hover:text-cream-100"
          >
            See who is ahead
            <span className="text-[11px] uppercase tracking-[0.24em] text-cream-400/70">full standings</span>
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
