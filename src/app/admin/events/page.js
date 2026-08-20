import EventsAdmin from "@/components/admin/EventsAdmin";
import { requireAdminPage } from "@/lib/dal";
import { loadFest } from "@/lib/fest-server";

export const metadata = { title: "Events & results" };

// The admin must never be served a cached copy: a stale render here is an
// organiser looking at placings that have already been changed by whoever else
// is signed in on the shared account.
export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await requireAdminPage();
  const fest = await loadFest();

  return <EventsAdmin events={fest.events} departments={fest.departments} source={fest.source} />;
}
