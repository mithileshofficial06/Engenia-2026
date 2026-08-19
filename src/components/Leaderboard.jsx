"use client";

import { motion } from "motion/react";
import { Crown, Medal, Trophy } from "lucide-react";
import { departments } from "@/data/site";
import { events } from "@/data/events";
import Counter from "@/components/Counter";
import Reveal from "@/components/Reveal";

const ranked = [...departments].sort((a, b) => b.points - a.points);
const max = ranked[0]?.points || 1;

// Podium reading order: 2nd, 1st, 3rd.
const podium = [ranked[1], ranked[0], ranked[2]].filter(Boolean);
const PODIUM_META = {
  0: { rank: 2, height: "h-28 sm:h-36", icon: Medal, tint: "rgba(232,216,187,.75)" },
  1: { rank: 1, height: "h-40 sm:h-52", icon: Crown, tint: "rgba(235,149,18,.9)" },
  2: { rank: 3, height: "h-20 sm:h-28", icon: Trophy, tint: "rgba(244,113,21,.8)" },
};

function winsFor(code) {
  return events.reduce(
    (n, e) => n + e.winners.filter((w) => w.dept === code && w.position === 1).length,
    0,
  );
}

export default function Leaderboard() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-28 md:px-8">
      {/* Podium */}
      <div className="flex items-end justify-center gap-3 sm:gap-6">
        {podium.map((dept, i) => {
          const meta = PODIUM_META[i];
          const Icon = meta.icon;
          return (
            <motion.div
              key={dept.code}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
              className="flex w-1/3 max-w-[200px] flex-col items-center"
            >
              <Icon
                size={meta.rank === 1 ? 30 : 22}
                className="mb-3"
                style={{ color: meta.tint, filter: `drop-shadow(0 0 14px ${meta.tint})` }}
              />
              <p
                className="font-display text-center text-xl font-black leading-none sm:text-3xl"
                style={{ color: dept.accent }}
              >
                {dept.code}
              </p>
              <p className="mt-2 text-center text-xs font-semibold tabular-nums text-white/60 sm:text-sm">
                <Counter value={dept.points} /> pts
              </p>

              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.9, delay: 0.3 + 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
                className={`glass relative mt-4 w-full origin-bottom overflow-hidden rounded-t-2xl ${meta.height}`}
              >
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: `linear-gradient(90deg, transparent, ${dept.accent}, transparent)` }}
                />
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-25"
                  style={{ background: `linear-gradient(to top, ${dept.accent}, transparent 70%)` }}
                />
                <span className="font-display absolute inset-x-0 bottom-3 text-center text-3xl font-black text-white/25 sm:text-5xl">
                  {meta.rank}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Full standings */}
      <div className="mt-16 space-y-2.5">
        {ranked.map((dept, i) => (
          <Reveal key={dept.code} from="up" delay={0.04 * i}>
            <div className="glass group relative overflow-hidden rounded-2xl px-4 py-4 sm:px-6">
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: dept.points / max }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.1 + 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-y-0 left-0 origin-left opacity-[0.14]"
                style={{ width: "100%", background: `linear-gradient(90deg, ${dept.accent}, transparent)` }}
              />

              <div className="relative flex items-center gap-4">
                <span className="font-display w-8 shrink-0 text-center text-lg font-black tabular-nums text-white/30 sm:text-xl">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span
                  className="h-9 w-1 shrink-0 rounded-full"
                  style={{ background: dept.accent, boxShadow: `0 0 16px ${dept.accent}` }}
                />

                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-bold leading-tight sm:text-xl" style={{ color: dept.accent }}>
                    {dept.code}
                  </p>
                  <p className="truncate text-xs text-white/45">{dept.name}</p>
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Firsts</p>
                  <p className="text-sm font-semibold tabular-nums text-white/70">{winsFor(dept.code)}</p>
                </div>

                <div className="w-20 shrink-0 text-right sm:w-24">
                  <p className="font-display text-2xl font-bold tabular-nums text-cream-100 sm:text-3xl">
                    <Counter value={dept.points} />
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">points</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-white/30">
        Standings reflect ENGENIA 2025 and will reset when ENGENIA 2026 begins.
      </p>
    </section>
  );
}
