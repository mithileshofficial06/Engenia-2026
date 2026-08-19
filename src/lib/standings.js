import { departments } from "@/data/site";
import { events } from "@/data/events";

/**
 * Standings, derived.
 *
 * Points are not stored anywhere. They are summed here from the event
 * results — every placing in `events.js` is worth `event.points[position]`,
 * and that sum *is* the leaderboard. Keeping a hand-written total alongside
 * the results meant the two could disagree with nothing to catch it; a
 * correction to a winner would leave the standings quietly wrong.
 *
 * Each department also carries the ledger that produced its total, so the
 * page can show its working rather than asserting a number.
 */

const POSITION_KEY = { 1: "gold", 2: "silver", 3: "bronze" };

function build() {
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

export const standings = build();

export const leader = standings[0] ?? null;

/** Totals across the whole table, for the summary strip. */
export const totals = standings.reduce(
  (acc, row) => ({
    points: acc.points + row.points,
    medals: acc.medals + row.medals,
  }),
  { points: 0, medals: 0 },
);

/**
 * Which fest these standings describe, and whether they are settled.
 *
 * Derived from the results rather than written down, so swapping `events.js`
 * for the 2026 line-up re-labels the page on its own instead of leaving a
 * stale year in the markup.
 */
export const season = (() => {
  const dates = events.map((e) => e.date).filter(Boolean).sort();
  const year = dates.length ? new Date(dates[dates.length - 1]).getFullYear() : null;
  const total = events.length;
  const completed = events.filter((e) => e.status === "COMPLETED").length;

  const state = total === 0 ? "empty" : completed === total ? "final" : completed > 0 ? "live" : "upcoming";

  return {
    year,
    total,
    completed,
    state,
    label: { final: "Final", live: "Live", upcoming: "Not started", empty: "No results" }[state],
    lastResult: dates.length ? dates[dates.length - 1] : null,
  };
})();
