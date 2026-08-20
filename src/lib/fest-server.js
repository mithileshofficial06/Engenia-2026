import "server-only";

import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { fetchFest, STATIC_FEST } from "@/lib/fest";

/**
 * The fest, loaded on the server for the first paint.
 *
 * Every page that shows live data calls this, hands the result to
 * <FestProvider initial={...}>, and the socket takes over from there. Doing
 * the first read here rather than in an effect is what keeps the leaderboard
 * server-rendered: correct in the HTML, visible to a crawler, and readable on
 * a phone that is still opening its websocket.
 *
 * It never throws. A fest site that renders a blank page because a network
 * call failed on the morning of the fest is worse than one showing content a
 * few minutes stale, so an unreachable or unconfigured database falls through
 * to the files the site shipped with, and `source` records which was used.
 */
export async function loadFest() {
  if (!isSupabaseConfigured) return STATIC_FEST;

  try {
    const supabase = await createSupabaseServerClient();
    return await fetchFest(supabase);
  } catch (error) {
    // Worth saying out loud in a build or a dev run — silently serving last
    // year's results because a key is wrong is the kind of thing that goes
    // unnoticed until someone asks why the leaderboard has not moved.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[fest] falling back to static content:", error?.message ?? error);
    }
    return STATIC_FEST;
  }
}
