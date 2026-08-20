import Link from "next/link";
import { CalendarCheck, Eye, EyeOff, Megaphone, Trophy } from "lucide-react";
import { requireAdminPage } from "@/lib/dal";
import { loadFest } from "@/lib/fest-server";
import { buildStandings, buildSeason } from "@/lib/standings";
import { festival } from "@/data/site";

export const metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

function Tile({ label, value, hint, tone = "cream" }) {
  const tint = { cream: "text-cream-100", gold: "text-gold-400", jade: "text-jade-400" }[tone];
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">{label}</p>
      <p className={`font-display mt-2 text-3xl font-semibold tabular-nums ${tint}`}>{value}</p>
      {hint && <p className="mt-1 text-[11px] text-white/35">{hint}</p>}
    </div>
  );
}

export default async function AdminHomePage() {
  const admin = await requireAdminPage();
  const fest = await loadFest();

  const season = buildSeason(fest.events);
  const standings = buildStandings(fest.events, fest.departments);
  const judged = fest.events.filter((e) => (e.winners?.length ?? 0) > 0);
  const held = judged.filter((e) => !e.resultsPublished);
  const drafts = fest.announcements.filter((a) => !a.published);

  return (
    <div>
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
          Signed in as {admin.email}
        </p>
        <h1 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">
          {festival.name} {festival.year} control room
        </h1>
      </header>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Events" value={season.total} hint={`${judged.length} judged`} />
        <Tile
          label="Awaiting reveal"
          value={held.length}
          hint={held.length ? "Results entered, not announced" : "Nothing held back"}
          tone={held.length ? "gold" : "cream"}
        />
        <Tile
          label="Leader"
          value={standings[0]?.code ?? "—"}
          hint={standings[0] ? `${standings[0].points} points projected` : "No results yet"}
          tone="jade"
        />
        <Tile
          label="Updates"
          value={fest.announcements.length}
          hint={drafts.length ? `${drafts.length} draft` : "All published"}
        />
      </div>

      {held.length > 0 && (
        <section className="glass mt-6 rounded-2xl p-5">
          <h2 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-400">
            <EyeOff size={12} />
            Ready to announce
          </h2>
          <ul className="mt-3 space-y-1.5">
            {held.map((event) => (
              <li key={event.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-cream-300/80">{event.name}</span>
                <span className="shrink-0 text-[11px] tabular-nums text-white/35">
                  {event.winners.length} placing{event.winners.length === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/events?"
            className="btn btn-solid mt-4 inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold"
          >
            <Eye size={13} />
            Go and reveal
          </Link>
        </section>
      )}

      <nav className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          {
            href: "/admin/events",
            icon: CalendarCheck,
            title: "Events & results",
            body: "Set what each placing is worth, record the winners, and reveal them.",
          },
          {
            href: "/admin/leaderboard",
            icon: Trophy,
            title: "Leaderboard",
            body: "Projected standings against what the hall can currently see.",
          },
          {
            href: "/admin/announcements",
            icon: Megaphone,
            title: "Updates",
            body: "Post to the updates feed. Drafts stay hidden until published.",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="glass group rounded-2xl p-5 transition-colors hover:bg-white/[0.06]"
          >
            <card.icon size={18} className="text-gold-500" />
            <h2 className="font-display mt-3 text-base font-semibold text-cream-100">
              {card.title}
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-white/45">{card.body}</p>
          </Link>
        ))}
      </nav>

      {fest.source === "static" && (
        <p className="mt-6 rounded-lg border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-xs text-gold-400">
          The database is not reachable, so these figures come from the bundled 2025 content and
          nothing will save. Check the Supabase keys in <code>.env.local</code>.
        </p>
      )}
    </div>
  );
}
