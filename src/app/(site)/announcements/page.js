import PageHeader from "@/components/PageHeader";
import AnnouncementsFeed from "@/components/AnnouncementsFeed";
import { FestProvider } from "@/components/FestProvider";
import { loadFest } from "@/lib/fest-server";

export const metadata = {
  title: "Updates",
  description: "Latest announcements and updates from the ENGENIA organising team.",
};

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const fest = await loadFest();

  return (
    <FestProvider initial={fest}>
      <div className="pb-28">
        <PageHeader
          hue="jade"
          eyebrow="Stay posted"
          title="Updates &"
          accent="Announcements"
          subtitle="Everything the organising team wants you to know, newest first."
        />

        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <AnnouncementsFeed />
        </div>
      </div>
    </FestProvider>
  );
}
