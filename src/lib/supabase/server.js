import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * The server's Supabase client, bound to the caller's cookies.
 *
 * `cookies()` is async in Next 16, so this is too — every call site awaits it.
 *
 * The write path needs care. A Server Component may only *read* cookies; the
 * setter throws there, and only a Server Function or a Route Handler can
 * actually put one on the response. Supabase wants to write whenever it
 * refreshes an expiring session, which can happen during a render.
 *
 * Swallowing that throw is correct rather than lazy: proxy.js refreshes the
 * session on the way in and writes the refreshed cookie itself, so by the
 * time a component renders, the token is already fresh and the write being
 * dropped here is a duplicate of one that has been made. Letting it escape
 * would crash a render over a no-op.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(list) {
          try {
            for (const { name, value, options } of list) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Rendering a Server Component. See the note above — proxy.js has
            // already written whatever this call was trying to write.
          }
        },
      },
    },
  );
}

/** Whether the project is configured. Mirrors the browser-side flag. */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
