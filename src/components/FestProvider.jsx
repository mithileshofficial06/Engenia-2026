"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchFest, STATIC_FEST } from "@/lib/fest";
import { buildStandings, buildSeason, buildTotals } from "@/lib/standings";

/**
 * The live fest, shared by every page under it.
 *
 * The server renders with real rows already in hand, so the first paint is
 * correct and indexable — this is not a spinner waiting on a fetch. What this
 * adds is the socket: when an admin flips a result on stage, Postgres pushes
 * the change and every device holding this page redraws, with no refresh and
 * no polling.
 *
 * ── Why any change triggers a full refetch ───────────────────────────────
 *
 * The obvious design is to apply each payload incrementally: patch the row
 * that changed and recompute. It is also wrong here, for a reason particular
 * to how the reveal works.
 *
 * Revealing an event is one UPDATE on `events` — results_published false to
 * true. The winners for that event were never sent to this browser; the
 * row-level policy withheld them, and no INSERT is replayed on publish because
 * nothing was inserted. So the payload that matters carries none of the data
 * it makes visible, and a client patching row-by-row would flip a flag and
 * show an event with no placings under it.
 *
 * Refetching sidesteps that entirely: the next select runs under the new
 * policy outcome and returns the placings. The whole dataset is a few
 * kilobytes — 7 departments, 32 events, a hundred placings — so the round trip
 * costs less than the bookkeeping it removes.
 *
 * The refetch is debounced because a reveal is rarely one statement. Saving
 * three placings and publishing is four changes inside a second, and each
 * would otherwise start its own request; the last one to land would win, and
 * they do not necessarily land in the order they were sent.
 */

const FestContext = createContext(null);

/** Changes to any of these mean the page is out of date. */
const WATCHED = ["events", "event_winners", "announcements"];

const SETTLE_MS = 220;

export function FestProvider({ initial, children }) {
  const [fest, setFest] = useState(initial ?? STATIC_FEST);
  const [live, setLive] = useState(false);

  // Held in a ref so the effect below never lists it as a dependency: it
  // changes on every refetch, and depending on it would tear down and rebuild
  // the socket each time a result came in.
  const festRef = useRef(fest);
  festRef.current = fest;

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    const supabase = getSupabaseBrowserClient();
    let cancelled = false;
    let timer;

    const refetch = async () => {
      try {
        const next = await fetchFest(supabase);
        if (!cancelled) setFest(next);
      } catch {
        // Keep whatever is on screen. A dropped refetch means the page is
        // momentarily stale, which is survivable; blanking it is not. The
        // subscription stays up and the next change pulls a fresh copy.
      }
    };

    const queue = () => {
      clearTimeout(timer);
      timer = setTimeout(refetch, SETTLE_MS);
    };

    const channel = supabase.channel("fest");
    for (const table of WATCHED) {
      channel.on("postgres_changes", { event: "*", schema: "public", table }, queue);
    }

    channel.subscribe((status) => {
      if (cancelled) return;
      setLive(status === "SUBSCRIBED");
      // The socket may have connected after a change was already missed —
      // a laptop waking, a tab returning from the background. Reconcile on
      // every successful (re)subscribe rather than trusting the stream alone.
      if (status === "SUBSCRIBED") refetch();
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, []);

  const value = useMemo(() => {
    const standings = buildStandings(fest.events, fest.departments);
    return {
      ...fest,
      standings,
      season: buildSeason(fest.events),
      totals: buildTotals(standings),
      leader: standings[0] ?? null,
      /** True once the realtime socket is up. Drives the "Live" dot. */
      live,
    };
  }, [fest, live]);

  return <FestContext.Provider value={value}>{children}</FestContext.Provider>;
}

/**
 * The fest, live.
 *
 * Falls back to the static content rather than throwing when used outside a
 * provider, so a component can be dropped anywhere — including the marketing
 * pages, which have no provider above them — and still render.
 */
export function useFest() {
  const ctx = useContext(FestContext);
  if (ctx) return ctx;

  const standings = buildStandings(STATIC_FEST.events, STATIC_FEST.departments);
  return {
    ...STATIC_FEST,
    standings,
    season: buildSeason(STATIC_FEST.events),
    totals: buildTotals(standings),
    leader: standings[0] ?? null,
    live: false,
  };
}
