import { departments as staticDepartments } from "@/data/site";
import { events as staticEvents } from "@/data/events";

/**
 * Standings, derived.
 *
 * Points are not stored anywhere — not in this file, not in the database.
 * They are summed here from the event results: every placing is worth
 * `event.points[position]`, and that sum *is* the leaderboard. Keeping a
 * hand-written total alongside the results meant the two could disagree with
 * nothing to catch it; a correction to a winner would leave the standings
 * quietly wrong. The admin can rewrite a placing and the table is right on
 * the next frame, because there is nothing else to update.
 *
 * These used to be constants, computed once when the module first loaded and
 * baked into the build. Now that the results arrive over a realtime socket and
 * can change while someone is looking at the page, they are pure functions of
 * whatever rows they are handed. The module-level exports at the foot are the
 * same computation over the static files, kept as the fallback the site
 * renders from before Supabase answers — or if it never does.
 */

const POSITION_KEY = { 1: "gold", 2: "silver", 3: "bronze" };

/**
 * @param {Array} events       events, each with `points` and `winners`
 * @param {Array} departments  the roster; anything not on it scores nothing
 */
export function buildStandings(events = [], departments = []) {
  const rows = new Map(
    departments.map((dept) => [
      dept.code,
      { ...dept, points: 0, gold: 0, silver: 0, bronze: 0, medals: 0, results: [] },
    ]),
  );

  const unmatched = new Set();

  // Chronological, so each department's ledger reads as a record of the fest
  // rather than a ranked highlight reel.
  const chronological = [...events].sort((a, b) => String(a.date).localeCompare(String(b.date)));

  for (const event of chronological) {
    for (const winner of event.winners ?? []) {
      const row = rows.get(winner.dept);
      if (!row) {
        unmatched.add(winner.dept);
        continue;
      }

      const earned = event.points?.[String(winner.position)] ?? 0;
      const tier = POSITION_KEY[winner.position];

      row.points += earned;
      if (tier) {
        row[tier] += 1;
        row.medals += 1;
      }
      row.results.push({
        slug: event.slug,
        event: event.name,
        date: event.date,
        division: event.division,
        position: winner.position,
        winner: winner.name,
        earned,
      });
    }
  }

  // A dept code in a result that matches no department silently drops points,
  // which is the exact failure this module exists to prevent. Say so.
  if (unmatched.size && process.env.NODE_ENV !== "production") {
    console.warn(
      `[standings] result rows reference unknown departments: ${[...unmatched].join(", ")}`,
    );
  }

  // Points first, then golds, then silvers, then bronzes — the usual medal
  // ordering, so a department that converts placings into wins ranks above one
  // that merely accumulates them.
  const ranked = [...rows.values()].sort(
    (a, b) =>
      b.points - a.points ||
      b.gold - a.gold ||
      b.silver - a.silver ||
      b.bronze - a.bronze ||
      a.code.localeCompare(b.code),
  );

  // Standard competition ranking: equal rows share a rank and the next one
  // skips (1, 2, 2, 4).
  let rank = 0;
  let previous = null;
  ranked.forEach((row, i) => {
    const key = `${row.points}/${row.gold}/${row.silver}/${row.bronze}`;
    if (key !== previous) {
      rank = i + 1;
      previous = key;
    }
    row.rank = rank;
    row.tied = false;
  });
  for (const row of ranked) {
    row.tied = ranked.filter((other) => other.rank === row.rank).length > 1;
  }

  return ranked;
}

/** Totals across the whole table, for the summary strip. */
export function buildTotals(standings = []) {
  return standings.reduce(
    (acc, row) => ({ points: acc.points + row.points, medals: acc.medals + row.medals }),
    { points: 0, medals: 0 },
  );
}

/**
 * Which fest these standings describe, and whether they are settled.
 *
 * Derived from the results rather than written down, so a new line-up
 * re-labels the page on its own instead of leaving a stale year in the markup.
 *
 * `completed` counts events whose results are actually out, not events marked
 * COMPLETED. During the fest those two diverge for exactly as long as it takes
 * to walk from the judges' table to the stage — an event can be over while its
 * placings are still held back — and the reader is being told how much of the
 * leaderboard is settled, which is the published count.
 */
export function buildSeason(events = []) {
  const dates = events.map((e) => e.date).filter(Boolean).sort();
  const year = dates.length ? new Date(dates[dates.length - 1]).getFullYear() : null;
  const total = events.length;
  const completed = events.filter((e) => (e.winners?.length ?? 0) > 0).length;

  const state =
    total === 0 ? "empty" : completed === total ? "final" : completed > 0 ? "live" : "upcoming";

  return {
    year,
    total,
    completed,
    state,
    label: { final: "Final", live: "Live", upcoming: "Not started", empty: "No results" }[state],
    lastResult: dates.length ? dates[dates.length - 1] : null,
  };
}

/* ── The static fallback ────────────────────────────────────────────────
   What the page shows before the database answers, and what it keeps showing
   if the database never does. Same computation, over the files the site
   shipped with. */

export const standings = buildStandings(staticEvents, staticDepartments);
export const leader = standings[0] ?? null;
export const totals = buildTotals(standings);
export const season = buildSeason(staticEvents);
