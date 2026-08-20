import PageHeader from "@/components/PageHeader";
import Leaderboard from "@/components/Leaderboard";
import { FestProvider } from "@/components/FestProvider";
import { loadFest } from "@/lib/fest-server";

export const metadata = {
  title: "Leaderboard",
  description: "Live department standings across every ENGENIA event.",
};

/**
 * Rendered per request, not at build time — the standings are the one thing on
 * the site that must never be a cached copy. FestProvider then keeps them
 * moving: a result revealed in the admin lands here over a socket, with no
 * refresh and no polling.
 */
export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const fest = await loadFest();

  return (
    <FestProvider initial={fest}>
      <PageHeader
        hue="gold"
        eyebrow="Standings"
        title="The"
        accent="Leaderboard"
        subtitle="Points accumulate across every onstage and offstage event. Seven departments, one crown."
      />
      <Leaderboard />
    </FestProvider>
  );
}
