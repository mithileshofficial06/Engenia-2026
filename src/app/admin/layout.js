import AdminNav from "@/components/admin/AdminNav";
import { getAdmin } from "@/lib/dal";

export const metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  // The control room has no business in a search index.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The admin shell.
 *
 * No auth check here, deliberately. A layout does not re-render on every
 * navigation within its segment, so a guard placed here would run once and
 * then be skipped for the rest of the session — the docs are explicit that
 * layouts are the wrong place to enforce access. Each page calls
 * requireAdminPage() for itself, and proxy.js turns away signed-out requests
 * before either gets that far.
 *
 * The login route lives under /admin but must render without the shell, so it
 * sits in its own segment and this layout renders only the chrome around
 * everything else.
 */
export default async function AdminLayout({ children }) {
  const admin = await getAdmin();

  // Signed out: this is the login page rendering through the shared segment.
  // Hand it through bare — it draws its own full-screen layout.
  if (!admin) return children;

  return (
    <div className="min-h-[100svh] pb-24">
      <AdminNav email={admin.email} />
      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-28 md:px-8">{children}</main>
    </div>
  );
}
