import { departments as staticDepartments, announcements as staticAnnouncements } from "@/data/site";
import { events as staticEvents } from "@/data/events";

/**
 * One shape for the fest, whichever end it came from.
 *
 * The site was written against the files in src/data/ — `event.date`,
 * `event.winners[].dept` — and every page, filter and sort in it reads those
 * names. Postgres hands back `event_date` and a nested `event_winners` with a
 * `dept_code`. Rather than teach a dozen components to speak both, everything
 * is normalised to the original shape the moment it arrives, here.
 *
 * Which means the components below this line cannot tell whether they are
 * rendering last year's static file or a row that changed a second ago, and do
 * not need to.
 */

/** The columns to pull. Named explicitly so a schema addition cannot quietly
 *  start shipping a column the public page never asked for. */
const EVENT_COLUMNS =
  "id, slug, name, division, type, event_date, status, points, guidelines, results_published, " +
  "event_winners ( id, position, name, dept_code )";

/** A database event row → the shape src/data/events.js uses. */
export function normaliseEvent(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    division: row.division,
    type: row.type,
    // Back to a plain local-time string. The rest of the site formats this
    // with formatDate/formatTime, which expect what the static file had.
    date: row.event_date ? String(row.event_date).replace("Z", "").slice(0, 19) : null,
    status: row.status,
    points: row.points ?? {},
    guidelines: row.guidelines ?? [],
    resultsPublished: row.results_published,
    winners: (row.event_winners ?? [])
      .map((w) => ({ id: w.id, position: w.position, name: w.name, dept: w.dept_code }))
      .sort((a, b) => a.position - b.position),
  };
}

export function normaliseAnnouncement(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    published: row.published,
    createdAt: row.created_at ? String(row.created_at).replace("Z", "").slice(0, 19) : null,
  };
}

export function normaliseDepartment(row) {
  return { code: row.code, name: row.name, accent: row.accent };
}

/**
 * Everything the public pages need, in three round trips.
 *
 * Deliberately not one clever join. These are 7, 32 and a handful of rows —
 * the whole payload is a few kilobytes — and three plain selects are far
 * easier to reason about than a nested query whose failure mode is a silently
 * empty branch.
 *
 * An unpublished event simply comes back with `winners: []`. Nothing here
 * filters that; the row-level policy did it, before the rows left Postgres.
 */
export async function fetchFest(supabase) {
  const [departments, events, announcements] = await Promise.all([
    supabase.from("departments").select("code, name, accent").order("sort_order"),
    supabase.from("events").select(EVENT_COLUMNS).order("event_date"),
    supabase
      .from("announcements")
      .select("id, title, content, published, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const error = departments.error || events.error || announcements.error;
  if (error) throw error;

  return {
    departments: (departments.data ?? []).map(normaliseDepartment),
    events: (events.data ?? []).map(normaliseEvent),
    announcements: (announcements.data ?? []).map(normaliseAnnouncement),
    source: "supabase",
  };
}

/**
 * The same shape, from the files the site shipped with.
 *
 * Used before Supabase answers, when it is not configured, and when it is
 * unreachable. A fest site that renders a blank leaderboard because a network
 * call failed on the day is worse than one showing last year's — so there is
 * always something to draw, and `source` says which it is.
 */
export const STATIC_FEST = {
  departments: staticDepartments.map(normaliseDepartment),
  events: staticEvents.map((e) => ({
    ...e,
    resultsPublished: true,
    winners: e.winners ?? [],
  })),
  announcements: staticAnnouncements.map((a) => ({ ...a, published: true })),
  source: "static",
};
