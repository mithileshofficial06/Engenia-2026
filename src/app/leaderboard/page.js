import PageHeader from "@/components/PageHeader";
import Leaderboard from "@/components/Leaderboard";

export const metadata = {
  title: "Leaderboard",
  description: "Live department standings across every ENGENIA event.",
};

export default function LeaderboardPage() {
  return (
    <div>
      <PageHeader
        hue="gold"
        eyebrow="Standings"
        title="The"
        accent="Leaderboard"
        subtitle="Points accumulate across every onstage and offstage event. Seven departments, one crown."
      />
      <Leaderboard />
    </div>
  );
}
