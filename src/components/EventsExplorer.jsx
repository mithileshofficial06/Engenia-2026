"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, ChevronRight, Clock, Search, Trophy, User, Users, X } from "lucide-react";
import { events } from "@/data/events";
import { formatDate, formatTime, MEDALS } from "@/lib/format";
import { MOTIFS } from "@/lib/assets";
import { sectionAccent } from "@/lib/accents";
import BrushRule from "@/components/BrushRule";

const DIVISIONS = ["ALL", "ONSTAGE", "OFFSTAGE"];
const TYPES = ["ALL", "TEAM", "INDIVIDUAL"];

const GOLD = "#eb9512";
// Onstage posters cycle the logo's figures. Cycling by position rather than
// matching event names keeps it working whatever the 2026 line-up turns out
// to be.
const MOTIF_CYCLE = ["guitar", "mask", "ballerina", "moonwalker"];

const dayKey = (iso) => iso.slice(0, 10);

/** Stable day numbers, derived from the whole line-up so filtering cannot
 *  renumber the programme under you. */
const DAY_NUMBERS = (() => {
  const days = [...new Set(events.map((e) => dayKey(e.date)))].sort();
  return Object.fromEntries(days.map((d, i) => [d, i + 1]));
})();

// The 2025 data is all COMPLETED, but the page has to read properly for the
// months before ENGENIA 2026 when nothing has a result yet.
const STATUS = {
  COMPLETED: { label: "Completed", tone: "text-cream-400/70" },
  LIVE: { label: "Live now", tone: "text-crimson-400" },
  UPCOMING: { label: "Upcoming", tone: "text-gold-400" },
};
const statusOf = (s) => STATUS[s] ?? { label: s, tone: "text-cream-400/70" };

function Pill({ active, group, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
        active ? "text-ink-950" : "text-cream-400/70 hover:text-cream-100"
      }`}
    >
      {active && (
        <motion.span
          layoutId={group}
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
          className="bg-fest absolute inset-0"
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function WinnerChips({ event }) {
  if (event.status !== "COMPLETED" || !event.winners.length) return null;
  return (
    <span className="flex items-center gap-1.5">
      {event.winners.slice(0, 3).map((w) => (
        <span
          key={`${w.position}-${w.dept}`}
          title={`${MEDALS[w.position]?.label}: ${w.name ?? w.dept}`}
          className={`flex h-6 w-6 items-center justify-center bg-cream-100/[0.07] text-[9px] font-bold ring-1 ${
            MEDALS[w.position]?.ring ?? "ring-cream-400/20"
          } ${MEDALS[w.position]?.text ?? "text-cream-300/70"}`}
        >
          {w.dept.slice(0, 2)}
        </span>
      ))}
    </span>
  );
}

export default function EventsExplorer() {
  const [division, setDivision] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (division !== "ALL" && e.division !== division) return false;
      if (type !== "ALL" && e.type !== type) return false;
      if (q && !e.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [division, type, query]);

  // The programme: days in order, each split into its stage and grounds bills.
  const programme = useMemo(() => {
    const byDay = new Map();
    for (const e of [...filtered].sort((a, b) => a.date.localeCompare(b.date))) {
      const k = dayKey(e.date);
      if (!byDay.has(k)) byDay.set(k, []);
      byDay.get(k).push(e);
    }
    return [...byDay.entries()].map(([date, list]) => ({
      date,
      day: DAY_NUMBERS[date],
      onstage: list.filter((e) => e.division === "ONSTAGE"),
      offstage: list.filter((e) => e.division === "OFFSTAGE"),
      count: list.length,
    }));
  }, [filtered]);

  return (
    <div {...sectionAccent("crimson")}>
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-400/50" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the programme..."
            aria-label="Search events"
            className="glass w-full py-3 pl-11 pr-4 text-sm text-cream-100 placeholder:text-cream-400/50 focus:outline-none focus:ring-2 focus:ring-crimson-500/45"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="glass flex p-1">
            {DIVISIONS.map((d) => (
              <Pill key={d} group="division-pill" active={division === d} onClick={() => setDivision(d)}>
                {d === "ALL" ? "All stages" : d}
              </Pill>
            ))}
          </div>
          <div className="glass flex p-1">
            {TYPES.map((t) => (
              <Pill key={t} group="type-pill" active={type === t} onClick={() => setType(t)}>
                {t === "ALL" ? "Any format" : t}
              </Pill>
            ))}
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.24em] text-cream-400/60">
          {filtered.length} {filtered.length === 1 ? "event" : "events"} across {programme.length}{" "}
          {programme.length === 1 ? "day" : "days"}
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-5xl px-4 md:px-8">
        {programme.map(({ date, day, onstage, offstage, count }, i) => (
          <motion.section
            key={date}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={i > 0 ? "mt-20" : ""}
          >
            <DayHeader date={date} day={day} count={count} finale={onstage.length > 0} />

            {onstage.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {onstage.map((event, j) => (
                  <PosterCard key={event.slug} event={event} index={j} onOpen={() => setSelected(event)} />
                ))}
              </div>
            )}

            {offstage.length > 0 && (
              <ul className={onstage.length > 0 ? "mt-10" : "mt-8"}>
                {offstage.map((event) => (
                  <EventRow key={event.slug} event={event} onOpen={() => setSelected(event)} />
                ))}
              </ul>
            )}
          </motion.section>
        ))}

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-sm text-cream-400/60">No events match that filter.</p>
        )}
      </div>

      <AnimatePresence>
        {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ── Day header ───────────────────────────────────────────────────────── */

function DayHeader({ date, day, count, finale }) {
  const d = new Date(date);
  const weekday = d.toLocaleDateString("en-IN", { weekday: "long" });
  const dayMonth = d.toLocaleDateString("en-IN", { day: "numeric", month: "long" });

  return (
    <header>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.34em]"
            style={{ color: finale ? GOLD : "var(--accent)" }}
          >
            Day {String(day).padStart(2, "0")}
            {finale && " · The finale"}
          </p>
          <h2 className="font-display mt-2 text-3xl font-bold leading-none text-cream-100 sm:text-4xl">
            {weekday}
            <span className="ml-3 text-cream-400/55">{dayMonth}</span>
          </h2>
        </div>

        <p className="text-[11px] uppercase tracking-[0.24em] text-cream-400/60">
          {count} {count === 1 ? "event" : "events"}
          <span className="mx-2 text-cream-400/30">/</span>
          {finale ? "on stage" : "on the grounds"}
        </p>
      </div>

      <BrushRule
        width="100%"
        className="mt-4 opacity-70"
        style={{ color: finale ? GOLD : "var(--accent)" }}
      />
    </header>
  );
}

/* ── Onstage: poster ──────────────────────────────────────────────────── */

function PosterCard({ event, index, onOpen }) {
  const motif = MOTIFS[MOTIF_CYCLE[index % MOTIF_CYCLE.length]];
  const status = statusOf(event.status);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl p-6 text-left"
      style={{
        background: "linear-gradient(180deg, rgb(211 19 62 / .22), rgb(13 9 7 / .55) 46%, #0d0907)",
        boxShadow: "0 20px 44px -22px rgb(0 0 0 / .9)",
      }}
    >
      <Image
        src={motif}
        alt=""
        aria-hidden
        width={320}
        height={640}
        className="pointer-events-none absolute -right-6 top-1/2 h-[86%] w-auto -translate-y-1/2 object-contain opacity-[0.16] mix-blend-screen transition-all duration-700 group-hover:-right-3 group-hover:opacity-30"
      />

      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${GOLD}, #ffc554, transparent)` }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-cream-100/10"
      />

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ring-1 ring-gold-500/40"
            style={{ color: GOLD }}
          >
            On stage
          </span>
          <span className="inline-flex items-center gap-1 bg-cream-100/[0.07] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-cream-300/70 ring-1 ring-cream-400/20">
            {event.type === "TEAM" ? <Users size={10} /> : <User size={10} />}
            {event.type}
          </span>
        </div>

        <h3 className="font-display mt-4 text-balance text-2xl font-bold leading-tight text-cream-100 sm:text-3xl">
          {event.name}
        </h3>

        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-cream-400/70">
          <Clock size={13} />
          {formatTime(event.date)}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-cream-400/15 pt-4">
          <WinnerChips event={event} />
          <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${status.tone}`}>
            {status.label}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

/* ── Offstage: programme row ──────────────────────────────────────────── */

function EventRow({ event, onOpen }) {
  const status = statusOf(event.status);

  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-cream-400/10 py-4 text-left transition-colors duration-300 hover:border-cream-400/25 sm:gap-6"
      >
        <span className="font-display w-[4.5rem] shrink-0 text-sm font-bold tabular-nums text-cream-300/80 sm:w-24 sm:text-base">
          {formatTime(event.date)}
        </span>

        <span className="min-w-0">
          <span className="font-display block truncate text-lg font-bold text-cream-100 transition-colors duration-300 group-hover:text-[var(--accent)] sm:text-xl">
            {event.name}
          </span>
          <span className="mt-0.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream-400/55">
            {event.type}
            <span className="text-cream-400/30">/</span>
            <span className={status.tone}>{status.label}</span>
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-3">
          <span className="hidden sm:block">
            <WinnerChips event={event} />
          </span>
          <ChevronRight
            size={16}
            className="text-cream-400/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-cream-100"
          />
        </span>
      </button>
    </li>
  );
}

/* ── Detail modal ─────────────────────────────────────────────────────── */

function EventModal({ event, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={event.name}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink-950/85 backdrop-blur-md sm:items-center sm:p-6"
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="glass glass-blur relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl sm:rounded-3xl"
      >
        <span className="bg-arc absolute inset-x-0 top-0 h-1" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-cream-100/[0.08] text-cream-300/80 transition hover:bg-cream-100/15 hover:text-cream-100"
        >
          <X size={16} />
        </button>

        <div className="p-6 sm:p-9">
          <div className="flex flex-wrap items-center gap-2 pr-10">
            <span
              className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ${
                event.division === "ONSTAGE"
                  ? "bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/30"
                  : "bg-crimson-500/15 text-crimson-400 ring-1 ring-crimson-500/30"
              }`}
            >
              {event.division}
            </span>
            <span className="bg-cream-100/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-cream-300/70 ring-1 ring-cream-400/20">
              {event.type}
            </span>
            <span className="bg-cream-100/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-cream-300/70 ring-1 ring-cream-400/20">
              {statusOf(event.status).label}
            </span>
          </div>

          <h2 className="font-display mt-4 text-balance text-3xl font-bold leading-tight sm:text-4xl">
            {event.name}
          </h2>

          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-cream-400/70">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />
              {formatDate(event.date, { weekday: "short" })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} />
              {formatTime(event.date)}
            </span>
          </p>

          <div className="mt-6 flex gap-2">
            {[1, 2, 3].map((pos) => (
              <div
                key={pos}
                className="flex-1 rounded-xl bg-cream-100/[0.05] px-3 py-3 text-center ring-1 ring-cream-400/15"
              >
                <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${MEDALS[pos].text}`}>
                  {MEDALS[pos].label}
                </p>
                <p className="font-display mt-1 text-2xl font-bold text-cream-100">{event.points[pos]}</p>
                <p className="text-[9px] uppercase tracking-[0.18em] text-cream-400/50">points</p>
              </div>
            ))}
          </div>

          {event.guidelines.length > 0 && (
            <section className="mt-8">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cream-400/60">
                Guidelines
              </h3>
              <ul className="mt-4 space-y-2.5">
                {event.guidelines.map((line, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-cream-300/75">
                    <span className="bg-fest mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                    <span className="text-pretty">{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {event.status === "COMPLETED" && event.winners.length > 0 && (
            <section className="mt-8">
              <h3 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-cream-400/60">
                <Trophy size={12} className="text-gold-500" /> Winners
              </h3>
              <ul className="mt-4 space-y-2">
                {event.winners.map((w) => (
                  <li
                    key={`${w.position}-${w.dept}-${w.name ?? ""}`}
                    style={{ boxShadow: `inset 0 0 30px -18px ${MEDALS[w.position]?.glow ?? "transparent"}` }}
                    className="flex items-center gap-4 rounded-xl bg-cream-100/[0.04] px-4 py-3 ring-1 ring-cream-400/12"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center text-[10px] font-bold ring-1 ${MEDALS[w.position]?.ring} ${MEDALS[w.position]?.text}`}
                    >
                      {MEDALS[w.position]?.label}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-medium text-cream-200/90">
                      {w.name || `${w.dept} team`}
                    </span>
                    <span className="shrink-0 bg-cream-100/[0.07] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cream-300/70">
                      {w.dept}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
