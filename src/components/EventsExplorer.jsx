"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, Clock, Search, Trophy, User, Users, X } from "lucide-react";
import { events } from "@/data/events";
import { formatDate, formatTime, MEDALS } from "@/lib/format";

const DIVISIONS = ["ALL", "ONSTAGE", "OFFSTAGE"];
const TYPES = ["ALL", "TEAM", "INDIVIDUAL"];

function Pill({ active, group, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
        active ? "text-ink-950" : "text-white/55 hover:text-cream-100"
      }`}
    >
      {active && (
        <motion.span
          layoutId={group}
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
          className="bg-fest absolute inset-0 rounded-full"
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
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

  return (
    <>
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events..."
            aria-label="Search events"
            className="glass w-full rounded-full py-3 pl-11 pr-4 text-sm text-cream-100 placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-crimson-500/45"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="glass flex rounded-full p-1">
            {DIVISIONS.map((d) => (
              <Pill key={d} group="division-pill" active={division === d} onClick={() => setDivision(d)}>
                {d === "ALL" ? "All stages" : d}
              </Pill>
            ))}
          </div>
          <div className="glass flex rounded-full p-1">
            {TYPES.map((t) => (
              <Pill key={t} group="type-pill" active={type === t} onClick={() => setType(t)}>
                {t === "ALL" ? "Any format" : t}
              </Pill>
            ))}
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.24em] text-white/35">
          {filtered.length} {filtered.length === 1 ? "event" : "events"}
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl gap-4 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((event, i) => (
            <motion.button
              key={event.slug}
              layout
              type="button"
              onClick={() => setSelected(event)}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.03, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="glass group relative overflow-hidden rounded-2xl p-5 text-left"
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100 ${
                  event.division === "ONSTAGE"
                    ? "bg-[radial-gradient(circle,rgba(211,19,62,.4),transparent_65%)]"
                    : "bg-[radial-gradient(circle,rgba(235,149,18,.35),transparent_65%)]"
                }`}
              />

              <div className="relative flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ${
                    event.division === "ONSTAGE"
                      ? "bg-crimson-500/15 text-crimson-400 ring-1 ring-crimson-500/30"
                      : "bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/30"
                  }`}
                >
                  {event.division}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/55 ring-1 ring-white/10">
                  {event.type === "TEAM" ? <Users size={10} /> : <User size={10} />}
                  {event.type}
                </span>
              </div>

              <h3 className="font-display relative mt-4 text-balance text-xl font-bold leading-snug text-cream-100 transition-colors group-hover:text-gold-400 sm:text-2xl">
                {event.name}
              </h3>

              <div className="relative mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/45">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={12} />
                  {formatDate(event.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={12} />
                  {formatTime(event.date)}
                </span>
              </div>

              <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4">
                <div className="flex items-center gap-1.5">
                  {event.winners.slice(0, 3).map((w) => (
                    <span
                      key={`${w.position}-${w.dept}`}
                      title={`${MEDALS[w.position]?.label}: ${w.name ?? w.dept}`}
                      className={`flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] text-[9px] font-bold ring-1 ${
                        MEDALS[w.position]?.ring ?? "ring-white/15"
                      } ${MEDALS[w.position]?.text ?? "text-white/70"}`}
                    >
                      {w.dept.slice(0, 2)}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 transition-colors group-hover:text-white/75">
                  Details
                </span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-sm text-white/40">No events match that filter.</p>
      )}

      <AnimatePresence>
        {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}

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
        className="glass relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl sm:rounded-3xl"
      >
        <span className="bg-arc absolute inset-x-0 top-0 h-1" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08] text-white/70 transition hover:bg-white/15 hover:text-cream-100"
        >
          <X size={16} />
        </button>

        <div className="p-6 sm:p-9">
          <div className="flex flex-wrap items-center gap-2 pr-10">
            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ${
                event.division === "ONSTAGE"
                  ? "bg-crimson-500/15 text-crimson-400 ring-1 ring-crimson-500/30"
                  : "bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/30"
              }`}
            >
              {event.division}
            </span>
            <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/55 ring-1 ring-white/10">
              {event.type}
            </span>
            <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/55 ring-1 ring-white/10">
              {event.status}
            </span>
          </div>

          <h2 className="font-display mt-4 text-balance text-3xl font-bold leading-tight sm:text-4xl">
            {event.name}
          </h2>

          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/50">
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
                className="flex-1 rounded-xl bg-white/[0.05] px-3 py-3 text-center ring-1 ring-white/[0.08]"
              >
                <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${MEDALS[pos].text}`}>
                  {MEDALS[pos].label}
                </p>
                <p className="font-display mt-1 text-2xl font-bold text-cream-100">{event.points[pos]}</p>
                <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">points</p>
              </div>
            ))}
          </div>

          {event.guidelines.length > 0 && (
            <section className="mt-8">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">Guidelines</h3>
              <ul className="mt-4 space-y-2.5">
                {event.guidelines.map((line, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-white/65">
                    <span className="bg-fest mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                    <span className="text-pretty">{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-8">
            <h3 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
              <Trophy size={12} className="text-gold-500" /> Winners
            </h3>
            <ul className="mt-4 space-y-2">
              {event.winners.map((w) => (
                <li
                  key={`${w.position}-${w.dept}-${w.name ?? ""}`}
                  style={{ boxShadow: `inset 0 0 30px -18px ${MEDALS[w.position]?.glow ?? "transparent"}` }}
                  className="flex items-center gap-4 rounded-xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/[0.07]"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-1 ${MEDALS[w.position]?.ring} ${MEDALS[w.position]?.text}`}
                  >
                    {MEDALS[w.position]?.label}
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-white/85">
                    {w.name || `${w.dept} team`}
                  </span>
                  <span className="shrink-0 rounded-full bg-white/[0.07] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
                    {w.dept}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}
