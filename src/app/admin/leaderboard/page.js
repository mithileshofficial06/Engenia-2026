import Link from "next/link";
import { ArrowUpRight, Trophy } from "lucide-react";
import { requireAdminPage } from "@/lib/dal";
import { loadFest } from "@/lib/fest-server";
import { buildStandings, buildSeason } from "@/lib/standings";
import { MEDALS } from "@/lib/format";

export const metadata = { title: "Leaderboard" };
export const dynamic = "force-dynamic";

/**
 * The standings as the committee sees them — which is not what the hall sees.
 *
 * Because an admin's reads are not filtered by the reveal policy, this sums
 * *every* placing on record, including the ones still held back. So the two
 * numbers shown per department are the score as it will be once everything is
 * out, and the score the public leaderboard is showing right now. The gap
 * between them is precisely what has been judged but not yet announced, which
 * is the number someone running the closing ceremony actually needs.
 */
export default async function AdminLeaderboardPage() {
  await requireAdminPage();
  const fest = await loadFest();

  const full = buildStandings(fest.events, fest.departments);
  const publicEvents = fest.events.filter((e) => e.resultsPublished);
  const live = buildStandings(publicEvents, fest.departments);
  const livePoints = new Map(live.map((row) => [row.code, row.points]));

  const season = buildSeason(fest.events);
  const held = fest.events.filter((e) => !e.resultsPublished && (e.winners?.length ?? 0) > 0);
  const max = full[0]?.points || 1;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Leaderboard</h1>
          <p className="mt-1.5 text-sm text-white/45">
            {season.completed} of {season.total} events judged
            {held.length > 0 && ` · ${held.length} not yet revealed`}
          </p>
        </div>
        <Link
          href="/leaderboard"
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold"
        >
          Public view
          <ArrowUpRight size={13} />
        </Link>
      </header>

      {held.length > 0 && (
        <div className="glass mt-6 rounded-2xl p-5">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-400">
            <Trophy size={12} />
            Judged, not yet announced
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {held.map((e) => (
              <li
                key={e.id}
                className="rounded-lg bg-white/[0.05] px-3 py-1.5 text-xs text-cream-300/80"
              >
                {e.name}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-white/35">
            Their points are in the projected column below, but not on the public leaderboard.
            Reveal them from{" "}
            <Link href="/admin/events" className="text-gold-400 underline-offset-2 hover:underline">
              Events &amp; results
            </Link>
            .
          </p>
        </div>
      )}

      <ul className="mt-6 space-y-2.5">
        {full.map((dept) => {
          const shown = livePoints.get(dept.code) ?? 0;
          const pending = dept.points - shown;

          return (
            <li key={dept.code} className="glass overflow-hidden rounded-2xl">
              <div className="flex items-center gap-4 p-4 sm:p-5">
                <span className="w-8 shrink-0 text-center text-sm font-bold tabular-nums text-white/30">
                  {String(dept.rank).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="h-10 w-1 shrink-0 rounded-full"
                  style={{ background: dept.accent }}
                />

                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold text-cream-100 sm:text-base">
                    {dept.code}
                    {dept.tied && (
                      <span className="ml-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
                        tied
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-white/40">{dept.name}</p>

                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <span
                      className="block h-full rounded-full transition-[width] duration-700"
                      style={{
                        width: `${Math.max(2, (dept.points / max) * 100)}%`,
                        background: dept.accent,
                      }}
                    />
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-display text-xl font-semibold tabular-nums text-cream-100 sm:text-2xl">
                    {dept.points}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">projected</p>
                  {pending > 0 && (
                    <p className="mt-1 text-[11px] tabular-nums text-gold-400">
                      {shown} public · +{pending} held
                    </p>
                  )}
                </div>

                <div className="hidden shrink-0 items-center gap-2.5 text-[11px] font-semibold tabular-nums sm:flex">
                  {[
                    ["gold", MEDALS[1]],
                    ["silver", MEDALS[2]],
                    ["bronze", MEDALS[3]],
                  ].map(([key, medal]) => (
                    <span key={key} className={dept[key] ? medal?.text : "text-white/20"}>
                      {dept[key]}
                      <span className="ml-px text-[9px] opacity-60">{key[0].toUpperCase()}</span>
                    </span>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-white/30">
        Totals are summed from the placings on record — there is no stored score to correct.
        Fix a placing on the events page and this moves with it.
      </p>
    </div>
  );
}
