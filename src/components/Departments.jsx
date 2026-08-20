"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { departments } from "@/data/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Flourish from "@/components/Flourish";
import BrushRule from "@/components/BrushRule";
import SectionShell from "@/components/SectionShell";
import useReveal from "@/lib/useReveal";

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
  const [railRef, railState] = useReveal({ amount: 0.15 });

  return (
    <SectionShell id="departments" hue="jade" className="px-4 py-16 sm:py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Flourish className="mx-auto mb-6 h-5 w-full max-w-md text-[var(--accent)] opacity-55" />

        <SectionHeading
          index={2}
          eyebrow="The contenders"
          title="Participating"
          accent="Departments"
          subtitle="Seven departments competing for cultural supremacy."
        />

        {/* The hall: a gilded rail with seven banners hung off it. Standings
            live on the leaderboard — this section is only about who competes.

            The banners used to sway forever on seven infinite Framer Motion
            loops, each one rotating a clipped element carrying a drop shadow —
            seven blurred surfaces re-rasterising every frame for as long as the
            page was open, whether or not the section was even on screen. They
            now fall once, swing themselves still over about half a second, and
            cost nothing after that. The pendulum is `banner-drop` in
            globals.css. */}
        <div ref={railRef} className={`relative mt-16 ${railState}`}>
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
              // Banners come off the rail left to right, close enough together
              // that the row reads as one gesture rather than as seven.
              const delay = i * 80;

              return (
                <li key={dept.code} className="group flex flex-col items-center">
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

                  {/* The falling element. Pivots on its top edge, where the cord
                      meets the cloth — any other origin reads as a spin rather
                      than as something hanging. */}
                  <div className="banner-drop w-full" style={{ "--drop-delay": `${delay}ms` }}>
                    <div className="flex flex-col items-center">
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
                            // Shaped shadow, so it follows the V-notch. Kept
                            // tight: this is the one surface that has to be
                            // re-rasterised while the banner swings.
                            filter: `drop-shadow(0 12px 14px rgb(0 0 0 / .5))`,
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
                            className="font-display relative text-center text-xl font-semibold leading-none tracking-tight text-cream-100 sm:text-2xl"
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
                    </div>
                  </div>

                  {/* The name plate stays out of the swing. A caption that swung
                      with its banner would be unreadable, and it belongs to the
                      row rather than to the cloth. */}
                  <p
                    style={{ "--rise-delay": `${delay + 420}ms` }}
                    className="rise-up mt-6 text-balance text-center text-[11px] leading-snug text-cream-300/60 transition-colors duration-500 group-hover:text-cream-100"
                  >
                    {dept.name}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <Reveal from="up" delay={0.1} className="mt-12 flex justify-center">
          <Link
            href="/leaderboard"
            className="btn btn-ghost group inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold"
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
    </SectionShell>
  );
}
