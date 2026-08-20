import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * `proxy.js`, not `middleware.js` — the middleware convention is deprecated in
 * Next 16 and this is its replacement. Same job, same signature.
 *
 * Two things happen here, and neither is the security check.
 *
 * 1. The session is refreshed. Supabase access tokens are short-lived, and
 *    something has to trade an expiring one for a fresh pair and write the
 *    cookies back. A Server Component cannot — it may read cookies but not set
 *    them — so if this did not run, an admin's session would expire mid-shift
 *    and log them out over nothing.
 *
 * 2. A signed-out visitor asking for /admin is redirected, and a signed-in one
 *    landing on /admin/login is sent inward. That is a courtesy, not a lock:
 *    it saves rendering a page that would only bounce.
 *
 * The real enforcement is in src/lib/dal.js and, behind it, the row-level
 * policies in supabase/schema.sql. This deliberately checks only that a
 * session exists and never that it belongs to an admin — the docs are explicit
 * that proxy runs on prefetches too, and a database round trip on every
 * prefetched link is exactly the cost that guidance is warning about. Being
 * waved through here buys nothing: requireAdminPage() asks the real question
 * on arrival.
 */
export async function proxy(request) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Not configured yet. Let everything through — the admin pages render their
  // own "connect Supabase first" notice, which is more use than a redirect
  // loop between two routes that are both unreachable.
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(list) {
        for (const { name, value } of list) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Must be getUser(), and must be awaited before any branch below: this call
  // is what performs the refresh, and the setAll above is what persists it.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isLogin = path === "/admin/login";
  const isAdminArea = path.startsWith("/admin") && !isLogin;

  if (isAdminArea && !user) {
    const to = request.nextUrl.clone();
    to.pathname = "/admin/login";
    // Where they were headed, so the login can put them back there rather
    // than always landing on the dashboard.
    to.searchParams.set("next", path);
    return NextResponse.redirect(to);
  }

  if (isLogin && user) {
    const to = request.nextUrl.clone();
    to.pathname = "/admin";
    to.search = "";
    return NextResponse.redirect(to);
  }

  return response;
}

export const config = {
  // Everything except static assets and image optimisation. The session
  // refresh has to run broadly — an admin who spends ten minutes reading the
  // public leaderboard should not come back to a dead session — but there is
  // nothing to refresh on a request for a font.
  matcher: ["/((?!_next/static|_next/image|favicon|.*\\.(?:png|jpg|jpeg|webp|svg|ico|woff2?)$).*)"],
};
