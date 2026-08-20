/**
 * Turns the static content the site shipped with into supabase/seed.sql.
 *
 *   node scripts/generate-seed.mjs
 *
 * The 2025 line-up already lives in src/data/events.js and src/data/site.js,
 * hand-checked and complete. Retyping 32 events and roughly a hundred
 * placings into a SQL file by hand would introduce errors that nothing would
 * catch — a misspelt department code drops points silently, which is the one
 * failure src/lib/standings.js exists to prevent. So the seed is generated
 * from those files instead, and the two cannot disagree.
 *
 * Re-run it whenever the static files change. The output is idempotent: it
 * upserts on the natural keys (department code, event slug) rather than
 * inserting blind, so loading it twice leaves the same rows.
 *
 * Seeded events arrive with results_published = true, because these are last
 * year's results and they are already public on the site. A fresh 2026
 * line-up should be entered through the admin pages, where the default is
 * false and each event is revealed deliberately.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { events } from "../src/data/events.js";
import { departments, announcements } from "../src/data/site.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Single-quote a value for SQL, or NULL. Doubles any embedded quote. */
const q = (v) =>
  v === null || v === undefined ? "NULL" : `'${String(v).replace(/'/g, "''")}'`;

/** A Postgres text[] literal, built out of quoted elements. */
const arr = (items) =>
  items?.length ? `ARRAY[${items.map(q).join(", ")}]::text[]` : `'{}'::text[]`;

const lines = [];
const say = (s = "") => lines.push(s);

say("-- ═══════════════════════════════════════════════════════════════════");
say("--  ENGENIA — seed data");
say("--");
say("--  GENERATED FILE — do not edit by hand.");
say("--  Produced from src/data/events.js and src/data/site.js by");
say("--  scripts/generate-seed.mjs. Run schema.sql first, then this.");
say("--");
say("--  Safe to run more than once: every statement upserts on a natural");
say("--  key, so a second run updates in place instead of duplicating.");
say("-- ═══════════════════════════════════════════════════════════════════");
say();

// ── Departments ──────────────────────────────────────────────────────
say("-- ── Departments ────────────────────────────────────────────────────");
departments.forEach((dept, i) => {
  say(
    `insert into public.departments (code, name, accent, sort_order) values ` +
      `(${q(dept.code)}, ${q(dept.name)}, ${q(dept.accent)}, ${i})\n` +
      `  on conflict (code) do update set ` +
      `name = excluded.name, accent = excluded.accent, sort_order = excluded.sort_order;`,
  );
});
say();

// ── Events ───────────────────────────────────────────────────────────
say("-- ── Events ─────────────────────────────────────────────────────────");
say("-- results_published is true here because these are last year's results,");
say("-- already public. New events created in the admin default to false.");
say();

for (const event of events) {
  const points = JSON.stringify(event.points ?? { 1: 20, 2: 15, 3: 10 });
  say(
    `insert into public.events ` +
      `(slug, name, division, type, event_date, status, points, guidelines, results_published) values (\n` +
      `  ${q(event.slug)}, ${q(event.name)}, ${q(event.division)}, ${q(event.type)},\n` +
      `  ${q(event.date)}::timestamptz, ${q(event.status)}, ${q(points)}::jsonb,\n` +
      `  ${arr(event.guidelines)}, true\n` +
      `) on conflict (slug) do update set\n` +
      `  name = excluded.name, division = excluded.division, type = excluded.type,\n` +
      `  event_date = excluded.event_date, status = excluded.status,\n` +
      `  points = excluded.points, guidelines = excluded.guidelines;`,
  );
}
say();

// ── Placings ─────────────────────────────────────────────────────────
say("-- ── Placings ───────────────────────────────────────────────────────");
say("-- Looked up by slug rather than by a hardcoded uuid, so this file does");
say("-- not depend on the ids the events insert happened to generate.");
say();

const known = new Set(departments.map((d) => d.code));
const unknown = new Set();

for (const event of events) {
  for (const winner of event.winners ?? []) {
    if (!known.has(winner.dept)) {
      unknown.add(`${winner.dept} (${event.slug}, position ${winner.position})`);
      continue;
    }
    say(
      `insert into public.event_winners (event_id, position, name, dept_code)\n` +
        `  select id, ${winner.position}, ${q(winner.name)}, ${q(winner.dept)}\n` +
        `  from public.events where slug = ${q(event.slug)}\n` +
        `  on conflict (event_id, position) do update set\n` +
        `    name = excluded.name, dept_code = excluded.dept_code;`,
    );
  }
}
say();

// ── Announcements ────────────────────────────────────────────────────
say("-- ── Announcements ──────────────────────────────────────────────────");
say("-- Keyed on title so a re-run updates the existing row. Titles are the");
say("-- only stable identifier the static file carries that survives here;");
say("-- rows created in the admin get a uuid and are unaffected by this.");
say();

for (const item of announcements) {
  say(
    `insert into public.announcements (title, content, published, created_at)\n` +
      `  select ${q(item.title)}, ${q(item.content)}, true, ${q(item.createdAt)}::timestamptz\n` +
      `  where not exists (select 1 from public.announcements where title = ${q(item.title)});`,
  );
}
say();

const out = path.join(root, "supabase", "seed.sql");
fs.writeFileSync(out, lines.join("\n") + "\n", "utf8");

const placings = events.reduce((n, e) => n + (e.winners?.length ?? 0), 0);
console.log(`wrote supabase/seed.sql`);
console.log(
  `  ${departments.length} departments, ${events.length} events, ` +
    `${placings - unknown.size} placings, ${announcements.length} announcements`,
);

// A result naming a department that is not on the roster would silently drop
// its points once loaded. Refuse to let that pass unremarked.
if (unknown.size) {
  console.error(`\n  SKIPPED ${unknown.size} placing(s) with unknown department codes:`);
  for (const u of unknown) console.error(`    ${u}`);
  process.exitCode = 1;
}
