"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * The browser's Supabase client.
 *
 * Carries the anon key, which is public by design — it identifies the project,
 * it does not grant anything. What a request is allowed to see is decided by
 * the row-level policies in supabase/schema.sql against the signed session,
 * so this key in a page source is no more revealing than the project URL
 * beside it.
 *
 * One instance per tab. `createBrowserClient` from @supabase/ssr keeps the
 * session in cookies rather than localStorage, which is what lets the server
 * read the same session the browser holds — a token only the client can see
 * would mean every admin page had to render empty and fill in afterwards.
 *
 * Memoised because the realtime socket belongs to the client object: calling
 * this from three components and getting three clients would open three
 * sockets and deliver every change three times.
 */

let browserClient;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  }
  return browserClient;
}

/**
 * Whether the project has been configured at all.
 *
 * The site has to render without Supabase — during setup, and on the day
 * something upstream is down — so nothing may assume a client exists. Callers
 * check this and fall back to the static content in src/data/.
 */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
