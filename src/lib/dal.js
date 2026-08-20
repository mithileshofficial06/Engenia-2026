import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * The Data Access Layer: one place that answers "who is asking, and may they".
 *
 * Server Actions are reachable by a direct POST, not only through the buttons
 * that call them — so a check that lives in the admin UI, or in proxy.js, is a
 * convenience rather than a defence. Every action in src/app/admin/actions.js
 * opens with requireAdmin() from here, and behind that the row-level policies
 * in supabase/schema.sql refuse the write a second time on the database side.
 * Two independent locks, neither relying on the front end.
 *
 * Wrapped in React's `cache` so that a page calling this in the layout, again
 * in the page, and again in a leaf component costs one round trip per render
 * rather than three.
 */

/**
 * The signed-in user, verified against Supabase — or null.
 *
 * Deliberately `getUser()` and not `getSession()`. A session is read straight
 * out of the cookie, which the browser controls and can therefore lie about;
 * getUser() puts the token to the auth server and gets back a user only if the
 * signature holds. On a page that decides whether someone may rewrite the
 * leaderboard, that difference is the whole point.
 */
export const getCurrentUser = cache(async () => {
  if (!isSupabaseConfigured) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) return null;
  return data.user;
});

/**
 * Whether the current caller is on the admin roster.
 *
 * Membership is a row in admin_users, not a claim in the token. A token is
 * issued at login and lives for as long as it lives; a row can be deleted, and
 * the next request is refused. Removing an organiser should not mean waiting
 * for their session to lapse.
 */
export const getAdmin = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id, email")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return { id: user.id, email: data.email || user.email };
});

/**
 * Admin, or bounced to the login screen. For pages and layouts.
 */
export async function requireAdminPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/**
 * Admin, or throw. For Server Actions, which have no sensible redirect —
 * they return to a caller that is expecting a result object.
 *
 * The message is deliberately flat. Distinguishing "not signed in" from
 * "signed in but not an admin" tells an unauthenticated prodder which half of
 * the problem they solved, and neither answer helps a legitimate user, who
 * simply gets sent to the login page by requireAdminPage above.
 */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new Error("Not authorised.");
  return admin;
}
