"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Crown, Medal, Trophy } from "lucide-react";
import { useFest } from "@/components/FestProvider";
import { festival } from "@/data/site";
import { formatDate, MEDALS } from "@/lib/format";
import Counter from "@/components/Counter";
import Reveal from "@/components/Reveal";

// Podium reading order: 2nd, 1st, 3rd.
const PODIUM_META = {
  0: { rank: 2, height: "h-28 sm:h-36", icon: Medal, tint: "rgba(232,216,187,.75)" },
  1: { rank: 1, height: "h-40 sm:h-52", icon: Crown, tint: "rgba(235,149,18,.9)" },
  2: { rank: 3, height: "h-20 sm:h-28", icon: Trophy, tint: "rgba(244,113,21,.8)" },
};

const TIER = [
  { key: "gold", letter: "G", label: "Gold", tint: "#ffc554" },
  { key: "silver", letter: "S", label: "Silver", tint: "#e8d8bb" },
  { key: "bronze", letter: "B", label: "Bronze", tint: "#f47115" },
];

const DIM = "rgba(255,255,255,.2)";

/* How much of the table is settled. Reads off whatever season is current,
   which now changes under the page as results are revealed. */
const progressLine = (season) =>
  ({
    final: `All ${season.total} events decided.`,
    live: `${season.completed} of ${season.total} events decided.`,
    upcoming: "No results in yet.",
    empty: "No events on record.",
  })[season.state];

/** The medal split, shown identically on the podium and in the folded-up
 *  mobile row. A tier a department never placed in reads as a quiet dash. */
function MedalSplit({ dept, className = "" }) {
  return (
    <span className={`flex items-center gap-2.5 text-[11px] font-semibold tabular-nums ${className}`}>
      {TIER.map((tier) => (
        <span key={tier.key} style={{ color: dept[tier.key] ? tier.tint : DIM }}>
          <span className="sr-only">{tier.label}: </span>
          {dept[tier.key]}
          <span aria-hidden className="ml-px text-[9px] opacity-60">
            {tier.letter}
          </span>
        </span>
      ))}
    </span>
  );
}

function Ledger({ dept }) {
  return (
    <div className="border-t border-white/10 px-4 pb-5 pt-4 sm:px-6">
      <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-white/35">
        How {dept.code} reached {dept.points} points
      </p>

      {dept.results.length === 0 ? (
        <p className="px-2 py-3 text-sm text-white/35">No placings recorded.</p>
      ) : (
        <ol className="space-y-0.5">
          {dept.results.map((r) => {
            const medal = MEDALS[r.position];
            return (
              <li
                key={`${r.slug}-${r.position}-${r.winner}`}
                className="flex items-baseline gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-white/[0.03]"
              >
                <span
                  className={`w-8 shrink-0 text-[11px] font-bold tabular-nums ${medal?.text ?? "text-white/40"}`}
                >
                  {medal?.label ?? "—"}
                </span>

                <span className="min-w-0 flex-1 truncate text-cream-200/85">{r.event}</span>

                <span className="hidden min-w-0 max-w-[14rem] shrink truncate text-xs text-white/35 sm:block">
                  {r.winner}
                </span>

                <span className="hidden w-16 shrink-0 text-right text-xs tabular-nums text-white/30 md:block">
                  {formatDate(r.date, { year: undefined })}
                </span>

                <span className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-white/60">
                  +{r.earned}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

export default function Leaderboard() {
  const [open, setOpen] = useState(null);

  /* Live. The server put real rows in here on the first render, and
     FestProvider swaps them the instant a result is revealed — so the podium
     re-orders and the bars re-scale without anyone reloading. */
  const { standings, season } = useFest();

  const max = standings[0]?.points || 1;
  const podium = [standings[1], standings[0], standings[2]].filter(Boolean);

  // The standings describe whichever fest the results came from, which is not
  // necessarily the one the site is advertising. Say which, up front.
  const isArchive = season.year != null && String(season.year) !== festival.year;
  const PROGRESS = progressLine(season);

  return (
    <section className="mx-auto max-w-5xl px-4 pb-28 md:px-8">
      {/* Which fest these standings are, and whether they are settled. Both
          are derived from the results, so this re-labels itself the moment
          the 2026 line-up lands in events.js. */}
      <Reveal from="fade">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <span className="glass inline-flex items-center gap-2.5 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cream-200/90">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: season.state === "live" ? "#d3133e" : "#e8d8bb",
                boxShadow: season.state === "live" ? "0 0 10px #d3133e" : "none",
              }}
            />
            {festival.name} {season.year} · {season.label}
          </span>

          <p className="max-w-lg text-sm leading-relaxed text-white/45">
            {PROGRESS}
            {isArchive && (
              <>
                {" "}
                These are the closing standings of {festival.name} {season.year}; {festival.name}{" "}
                {festival.year} has not been scored yet.
              </>
            )}
          </p>
        </div>
      </Reveal>

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
                className="font-display text-center text-lg font-semibold leading-none sm:text-2xl"
                style={{ color: dept.accent }}
              >
                {dept.code}
              </p>
              <p className="mt-2 text-center text-xs font-semibold tabular-nums text-white/60 sm:text-sm">
                <Counter value={dept.points} /> pts
              </p>

              {/* So the podium says how a total was built, not only how big. */}
              <MedalSplit dept={dept} className="mt-1.5 justify-center" />

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
                <span className="font-display absolute inset-x-0 bottom-3 text-center text-2xl font-semibold text-white/20 sm:text-4xl">
                  {meta.rank}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Full standings — a medal table, each row opening onto the results
          that produced its total. */}
      <div className="mt-12">
        {/* A visual legend for the columns below. Every figure it labels is
            also named in the row itself for screen readers, so this is hidden
            from them rather than announced as a stray row of letters. */}
        <div
          aria-hidden
          className="flex items-center gap-4 px-4 pb-2 text-[10px] uppercase tracking-[0.22em] text-white/35 sm:px-6"
        >
          <span className="w-8 shrink-0 text-center">#</span>
          <span className="w-1 shrink-0" />
          <span className="min-w-0 flex-1">Department</span>
          {TIER.map((tier) => (
            <span key={tier.key} className="hidden w-12 shrink-0 text-right sm:block" title={tier.label}>
              {tier.letter}
            </span>
          ))}
          <span className="hidden w-16 shrink-0 text-right md:block">Medals</span>
          <span className="w-20 shrink-0 text-right sm:w-24">Points</span>
          <span className="w-10 shrink-0" />
        </div>

        <div className="space-y-2.5">
          {standings.map((dept, i) => {
            const isOpen = open === dept.code;
            return (
              <Reveal key={dept.code} from="up" delay={0.04 * i}>
                <div className="glass relative overflow-hidden rounded-2xl">
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: dept.points / max }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.1 + 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-y-0 left-0 origin-left opacity-[0.14]"
                    style={{
                      width: "100%",
                      background: `linear-gradient(90deg, ${dept.accent}, transparent)`,
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : dept.code)}
                    aria-expanded={isOpen}
                    aria-controls={`ledger-${dept.code}`}
                    className="relative flex w-full items-center gap-4 px-4 py-4 text-left sm:px-6"
                  >
                    <span className="font-display w-8 shrink-0 text-center text-base font-semibold tabular-nums text-white/30 sm:text-lg">
                      <span className="sr-only">Rank </span>
                      {String(dept.rank).padStart(2, "0")}
                    </span>

                    <span
                      aria-hidden
                      className="h-9 w-1 shrink-0 rounded-full"
                      style={{ background: dept.accent, boxShadow: `0 0 16px ${dept.accent}` }}
                    />

                    <span className="min-w-0 flex-1">
                      <span
                        className="font-display block text-base font-semibold leading-tight sm:text-lg"
                        style={{ color: dept.accent }}
                      >
                        {dept.code}
                        {dept.tied && (
                          <span className="ml-2 align-middle text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
                            tied
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-xs text-white/45">{dept.name}</span>

                      {/* Under sm the medal columns fold in here rather than
                          dropping off the table entirely. */}
                      <MedalSplit dept={dept} className="mt-1.5 sm:hidden" />
                    </span>

                    {TIER.map((tier) => (
                      <span
                        key={tier.key}
                        className="hidden w-12 shrink-0 text-right text-sm font-semibold tabular-nums sm:block"
                        style={{ color: dept[tier.key] ? tier.tint : undefined }}
                      >
                        <span className="sr-only">
                          {tier.label}: {dept[tier.key]}
                        </span>
                        <span aria-hidden className={dept[tier.key] ? "" : "text-white/20"}>
                          {dept[tier.key] || "—"}
                        </span>
                      </span>
                    ))}

                    <span className="hidden w-16 shrink-0 text-right text-sm font-semibold tabular-nums text-white/70 md:block">
                      <span className="sr-only">Total medals: </span>
                      {dept.medals}
                    </span>

                    <span className="w-20 shrink-0 text-right sm:w-24">
                      <span className="font-display block text-xl font-semibold tabular-nums text-cream-100 sm:text-2xl">
                        <Counter value={dept.points} />
                      </span>
                      <span className="block text-[10px] uppercase tracking-[0.2em] text-white/35">
                        points
                      </span>
                    </span>

                    <span className="flex w-10 shrink-0 justify-end">
                      <ChevronDown
                        size={16}
                        aria-hidden
                        className={`text-white/35 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`ledger-${dept.code}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="relative overflow-hidden"
                      >
                        <Ledger dept={dept} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <p className="mt-10 text-center text-xs leading-relaxed text-white/30">
        Every total above is summed from the {season.total} events on record — open a row to see the
        placings behind it.
      </p>
    </section>
  );
}
