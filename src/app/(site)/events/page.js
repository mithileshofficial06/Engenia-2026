import PageHeader from "@/components/PageHeader";
import EventsExplorer from "@/components/EventsExplorer";
import { FestProvider } from "@/components/FestProvider";
import { loadFest } from "@/lib/fest-server";

export const metadata = {
  title: "Events",
  description: "Every onstage and offstage competition at ENGENIA, with guidelines and results.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const fest = await loadFest();

  const onstage = fest.events.filter((e) => e.division === "ONSTAGE").length;
  const offstage = fest.events.length - onstage;

  return (
    <FestProvider initial={fest}>
      <div className="pb-28">
        <PageHeader
          hue="crimson"
          eyebrow="The line-up"
          title="The"
          accent="Events"
          subtitle={`${fest.events.length} competitions across two divisions — ${onstage} onstage, ${offstage} offstage. Tap any card for guidelines and results.`}
        />
        <EventsExplorer />
      </div>
    </FestProvider>
  );
}
