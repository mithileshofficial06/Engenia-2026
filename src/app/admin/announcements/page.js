import AnnouncementsAdmin from "@/components/admin/AnnouncementsAdmin";
import { requireAdminPage } from "@/lib/dal";
import { loadFest } from "@/lib/fest-server";

export const metadata = { title: "Updates" };
export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  await requireAdminPage();
  const fest = await loadFest();

  return <AnnouncementsAdmin announcements={fest.announcements} source={fest.source} />;
}
