"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Search,
  Trophy,
} from "lucide-react";
import {
  saveEventWinners,
  setResultsPublished,
  updateEventPoints,
  updateEventStatus,
} from "@/app/admin/actions";
import { formatDate, formatTime } from "@/lib/format";

/**
 * Where the fest is actually run from.
 *
 * One row per event, opening into the three things an organiser changes while
 * standing next to the stage: what the placings are worth, who took them, and
 * whether the room is allowed to know yet.
 *
 * ── Why the reveal is a separate button ─────────────────────────────────
 *
 * Saving placings and publishing them are deliberately two actions. During the
 * fest the judges hand over a result some minutes before it is announced, and
 * the whole point of entering it early is that the announcement is then one
 * tap rather than three fields typed under a spotlight. Combining them would
 * mean either typing the result live, or spoiling it on the leaderboard the
 * moment it was recorded.
 *
 * Until that button is pressed the placings are not merely hidden: the
 * row-level policy in schema.sql withholds them from every public read, so
 * they are not in anyone's browser to be found.
 */

const POSITION_LABEL = { 1: "1st", 2: "2nd", 3: "3rd" };
const STATUSES = ["UPCOMING", "LIVE", "COMPLETED"];

const DIVISION_FILTERS = ["ALL", "ONSTAGE", "OFFSTAGE"];
const REVEAL_FILTERS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Awaiting reveal" },
  { key: "PUBLISHED", label: "Revealed" },
];

/** The three placing slots, filled from whatever the event already has. */
function slotsFor(event) {
  return [1, 2, 3].map((position) => {
    const existing = event.winners?.find((w) => w.position === position);
    return { position, name: existing?.name ?? "", dept: existing?.dept ?? "" };
  });
}

function EventRow({ event, departments, expanded, onToggle }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const [points, setPoints] = useState(() => ({
    1: event.points?.["1"] ?? 20,
    2: event.points?.["2"] ?? 15,
    3: event.points?.["3"] ?? 10,
  }));
  const [slots, setSlots] = useState(() => slotsFor(event));
  const [note, setNote] = useState(null);

  const published = event.resultsPublished;
  const recorded = event.winners?.length ?? 0;

  /** Run an action, surface whatever it says, and pull the fresh rows down. */
  const run = (fn, success) =>
    start(async () => {
      setNote(null);
      const result = await fn();
      if (result?.ok) {
        setNote({ tone: "ok", text: success });
        router.refresh();
      } else {
        setNote({ tone: "bad", text: result?.error ?? "That did not save." });
      }
    });

  const setSlot = (position, patch) =>
    setSlots((prev) => prev.map((s) => (s.position === position ? { ...s, ...patch } : s)));

  return (
    <li className="glass overflow-hidden rounded-2xl">
      <div className="flex items-center gap-3 p-4">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <ChevronDown
            size={16}
            className={`shrink-0 text-white/35 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
          <span className="min-w-0 flex-1">
            <span className="font-display block truncate text-sm font-semibold text-cream-100 sm:text-base">
              {event.name}
            </span>
            <span className="mt-0.5 block text-[11px] text-white/40">
              {event.date ? `${formatDate(event.date)} · ${formatTime(event.date)}` : "No date"} ·{" "}
              {event.division} · {event.type}
            </span>
          </span>
        </button>

        <span className="flex shrink-0 items-center gap-2">
          <span
            className={`hidden text-[10px] font-semibold uppercase tracking-[0.18em] sm:inline ${
              recorded ? "text-cream-300/70" : "text-white/25"
            }`}
          >
            {recorded ? `${recorded}/3` : "—"}
          </span>
          <span
            title={published ? "Results are public" : "Results are hidden"}
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              published ? "bg-jade-500/15 text-jade-400" : "bg-white/[0.05] text-white/30"
            }`}
          >
            {published ? <Eye size={14} /> : <EyeOff size={14} />}
          </span>
        </span>
      </div>

      {expanded && (
        <div className="border-t border-white/10 p-4 sm:p-5">
          {/* ── Points ── */}
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
            Points per placing
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            {[1, 2, 3].map((position) => (
              <label key={position} className="block">
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                  {POSITION_LABEL[position]}
                </span>
                <input
                  type="number"
                  min="0"
                  value={points[position]}
                  onChange={(e) => setPoints((p) => ({ ...p, [position]: e.target.value }))}
                  className="mt-1.5 w-20 rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2.5 text-sm tabular-nums text-cream-100 outline-none transition focus:border-[var(--color-gold-500)]"
                />
              </label>
            ))}
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => updateEventPoints(event.id, points), "Points saved.")}
              className="btn btn-ghost px-5 py-2.5 text-xs font-semibold disabled:opacity-50"
            >
              Save points
            </button>
          </div>

          {/* ── Placings ── */}
          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
            Placings
          </p>
          <div className="mt-3 space-y-2.5">
            {slots.map((slot) => (
              <div key={slot.position} className="flex flex-wrap items-center gap-2">
                <span className="w-9 shrink-0 text-xs font-bold tabular-nums text-gold-400">
                  {POSITION_LABEL[slot.position]}
                </span>
                <input
                  type="text"
                  value={slot.name}
                  // A team event is won by the department, not a person, so the
                  // name is genuinely optional here and the placeholder says so
                  // rather than leaving an organiser hunting for a name to type.
                  placeholder={
                    event.type === "TEAM" ? "Team name (optional)" : "Winner's name"
                  }
                  onChange={(e) => setSlot(slot.position, { name: e.target.value })}
                  className="min-w-0 flex-1 rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2.5 text-sm text-cream-100 outline-none transition focus:border-[var(--color-gold-500)]"
                />
                <select
                  value={slot.dept}
                  onChange={(e) => setSlot(slot.position, { dept: e.target.value })}
                  className="shrink-0 rounded-lg border border-white/12 bg-ink-800 px-3 py-2.5 text-sm text-cream-100 outline-none transition focus:border-[var(--color-gold-500)]"
                >
                  <option value="">Department…</option>
                  {departments.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.code}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <p className="mt-2.5 text-[11px] leading-relaxed text-white/35">
            The department is what scores — the name is optional, and team events usually have
            none. Leave the department blank to record fewer than three placings. Saving replaces
            every placing on this event.
          </p>

          {/* ── Actions ── */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => saveEventWinners(event.id, slots), "Placings saved.")}
              className="btn btn-ghost inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold disabled:opacity-50"
            >
              {pending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              Save placings
            </button>

            <button
              type="button"
              disabled={pending || (!published && recorded === 0)}
              onClick={() =>
                run(
                  () => setResultsPublished(event.id, !published),
                  published ? "Results hidden again." : "Results are live.",
                )
              }
              className={`inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                published
                  ? "btn btn-ghost"
                  : "btn btn-solid"
              }`}
              title={
                !published && recorded === 0
                  ? "Save at least one placing before revealing"
                  : undefined
              }
            >
              {published ? <EyeOff size={13} /> : <Trophy size={13} />}
              {published ? "Hide results" : "Reveal results"}
            </button>

            <select
              value={event.status}
              disabled={pending}
              onChange={(e) => run(() => updateEventStatus(event.id, e.target.value), "Status updated.")}
              className="rounded-lg border border-white/12 bg-ink-800 px-3 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-cream-100 outline-none disabled:opacity-50"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {note && (
            <p
              role="status"
              className={`mt-4 flex items-start gap-2 rounded-lg px-3.5 py-2.5 text-xs ${
                note.tone === "ok"
                  ? "border border-jade-500/25 bg-jade-500/10 text-jade-400"
                  : "border border-crimson-500/30 bg-crimson-500/10 text-crimson-400"
              }`}
            >
              {note.tone === "ok" ? (
                <Check size={13} className="mt-px shrink-0" />
              ) : (
                <AlertCircle size={13} className="mt-px shrink-0" />
              )}
              {note.text}
            </p>
          )}
        </div>
      )}
    </li>
  );
}

export default function EventsAdmin({ events, departments, source }) {
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState("ALL");
  const [reveal, setReveal] = useState("ALL");
  const [openId, setOpenId] = useState(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (division !== "ALL" && e.division !== division) return false;
      if (reveal === "PENDING" && e.resultsPublished) return false;
      if (reveal === "PUBLISHED" && !e.resultsPublished) return false;
      if (q && !e.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [events, query, division, reveal]);

  const pendingCount = events.filter((e) => !e.resultsPublished).length;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Events &amp; results</h1>
          <p className="mt-1.5 text-sm text-white/45">
            {events.length} events · {pendingCount} awaiting reveal
          </p>
        </div>
      </header>

      {source === "static" && (
        <p className="mt-5 flex items-start gap-2 rounded-lg border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-xs text-gold-400">
          <AlertCircle size={14} className="mt-px shrink-0" />
          Showing the bundled 2025 content — the database is not reachable, so nothing here will
          save. Check the Supabase keys in <code>.env.local</code>.
        </p>
      )}

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find an event…"
            className="w-full rounded-lg border border-white/12 bg-white/[0.04] py-3 pl-10 pr-3 text-sm text-cream-100 outline-none transition focus:border-[var(--color-gold-500)]"
          />
        </div>

        <div className="flex gap-1">
          {DIVISION_FILTERS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDivision(d)}
              className={`px-3.5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                division === d ? "bg-fest text-ink-950" : "text-white/45 hover:text-cream-100"
              }`}
            >
              {d === "ALL" ? "All" : d}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          {REVEAL_FILTERS.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setReveal(r.key)}
              className={`px-3.5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                reveal === r.key ? "bg-white/[0.1] text-cream-100" : "text-white/45 hover:text-cream-100"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 text-center text-sm text-white/35">No events match those filters.</p>
      ) : (
        <ul className="mt-5 space-y-2.5">
          {shown.map((event) => (
            <EventRow
              // Keyed on the placings and the publish flag as well as the id, so
              // a refresh after saving rebuilds the row from the rows that came
              // back rather than leaving the inputs on their previous state.
              key={`${event.id}:${event.resultsPublished}:${event.winners?.length ?? 0}`}
              event={event}
              departments={departments}
              expanded={openId === event.id}
              onToggle={() => setOpenId((id) => (id === event.id ? null : event.id))}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
