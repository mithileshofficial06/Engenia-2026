import PageHeader from "@/components/PageHeader";
import EventsExplorer from "@/components/EventsExplorer";
import { events } from "@/data/events";

export const metadata = {
  title: "Events",
  description: "Every onstage and offstage competition at ENGENIA, with guidelines and results.",
};

export default function EventsPage() {
  const onstage = events.filter((e) => e.division === "ONSTAGE").length;
  const offstage = events.length - onstage;

  return (
    <div className="pb-28">
      <PageHeader
        hue="crimson"
        eyebrow="The line-up"
        title="The"
        accent="Events"
        subtitle={`${events.length} competitions across two divisions — ${onstage} onstage, ${offstage} offstage. Tap any card for guidelines and results.`}
      />
      <EventsExplorer />
    </div>
  );
}
