"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Every mutation the admin can perform.
 *
 * Each one opens with requireAdmin(). That is not belt-and-braces around the
 * login screen — Server Actions are reachable by a direct POST to their
 * generated endpoint, without ever loading the page that calls them, so a
 * check living in the interface protects nothing. Behind this, the row-level
 * policies in supabase/schema.sql refuse the same write again on the database
 * side, under the caller's own session. Two independent locks.
 *
 * Actions return `{ ok, error }` rather than throwing at the client. A thrown
 * error in a Server Action reaches the browser as a redacted digest in
 * production, which is right for a stack trace and useless to an organiser who
 * needs to know that a department code was not recognised.
 *
 * ── On revalidatePath ────────────────────────────────────────────────────
 * The public pages carry their own realtime socket and will redraw from the
 * database push without any help from here. These calls are for the admin's
 * own server-rendered pages, and for the first load of a public page by
 * someone who arrives after a change but never received the push because they
 * were not on the site when it happened.
 */

/** Public surfaces whose server-rendered copy is stale after a results change. */
const PUBLIC_PATHS = ["/", "/leaderboard", "/events"];

const revalidate = (paths) => {
  for (const p of paths) revalidatePath(p);
};

/** Narrow a thrown/returned Supabase error to something an organiser can act on. */
function explain(error) {
  if (!error) return null;
  const message = error.message ?? String(error);

  if (error.code === "23505") {
    return "That placing is already recorded for this event.";
  }
  if (error.code === "23503") {
    return "That department code is not on the roster.";
  }
  if (/row-level security/i.test(message)) {
    return "The database refused that write. Your session may have expired — sign in again.";
  }
  return message;
}

async function admin() {
  await requireAdmin();
  return createSupabaseServerClient();
}

/* ── Points ───────────────────────────────────────────────────────────── */

/**
 * What each placing in an event is worth.
 *
 * Stored as {"1": n, "2": n, "3": n} to match what the site already reads.
 * Values are coerced and floored at zero — a negative points value would
 * subtract from a department's total, which no event should be able to do by
 * a typo in a form field.
 */
export async function updateEventPoints(eventId, points) {
  try {
    const supabase = await admin();

    const clean = {};
    for (const position of ["1", "2", "3"]) {
      const n = Number(points?.[position]);
      clean[position] = Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
    }

    const { error } = await supabase.from("events").update({ points: clean }).eq("id", eventId);
    if (error) return { ok: false, error: explain(error) };

    revalidate([...PUBLIC_PATHS, "/admin", "/admin/events"]);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: explain(e) };
  }
}

/* ── Placings ─────────────────────────────────────────────────────────── */

/**
 * Replace the placings for one event.
 *
 * The whole set is rewritten rather than patched row by row. The form always
 * submits all three, and a delete-then-insert cannot leave a stale second
 * place behind when an event is corrected from three winners down to two —
 * which patching can, and did not announce when it happened.
 *
 * A row counts as filled in when it names a *department*, not when it names a
 * person. In a TEAM event the department is the whole answer — there is no
 * individual to credit — so the name is optional and stored as NULL, which is
 * what the site already renders around with `name ?? dept`. Requiring a name
 * would make every team result impossible to enter.
 *
 * Rows with no department are dropped rather than stored: an event with only a
 * first place is a normal state during the fest, and a placing belonging to
 * nobody would award points to no one while still occupying the slot.
 */
export async function saveEventWinners(eventId, winners) {
  try {
    const supabase = await admin();

    const rows = (winners ?? [])
      .filter((w) => w?.dept?.trim())
      .map((w) => ({
        event_id: eventId,
        position: Number(w.position),
        name: w?.name?.trim() ? w.name.trim() : null,
        dept_code: w.dept.trim(),
      }))
      .filter((w) => w.position >= 1 && w.position <= 3);

    const { error: clearError } = await supabase
      .from("event_winners")
      .delete()
      .eq("event_id", eventId);
    if (clearError) return { ok: false, error: explain(clearError) };

    if (rows.length) {
      const { error } = await supabase.from("event_winners").insert(rows);
      if (error) return { ok: false, error: explain(error) };
    }

    revalidate([...PUBLIC_PATHS, "/admin", "/admin/events"]);
    return { ok: true, saved: rows.length };
  } catch (e) {
    return { ok: false, error: explain(e) };
  }
}

/**
 * The reveal.
 *
 * One boolean, and the moment it turns true the placings for this event stop
 * being filtered out of every public read and start arriving over the socket.
 * Nothing else has to happen: the leaderboard is summed from the placings it
 * can see, so publishing an event *is* awarding its points.
 */
export async function setResultsPublished(eventId, published) {
  try {
    const supabase = await admin();

    const { error } = await supabase
      .from("events")
      .update({ results_published: Boolean(published) })
      .eq("id", eventId);
    if (error) return { ok: false, error: explain(error) };

    revalidate([...PUBLIC_PATHS, "/admin", "/admin/events"]);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: explain(e) };
  }
}

/** Where an event is in its life: upcoming, running, done. */
export async function updateEventStatus(eventId, status) {
  try {
    if (!["UPCOMING", "LIVE", "COMPLETED"].includes(status)) {
      return { ok: false, error: "Unknown status." };
    }
    const supabase = await admin();

    const { error } = await supabase.from("events").update({ status }).eq("id", eventId);
    if (error) return { ok: false, error: explain(error) };

    revalidate([...PUBLIC_PATHS, "/admin", "/admin/events"]);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: explain(e) };
  }
}

/* ── Announcements ────────────────────────────────────────────────────── */

export async function createAnnouncement({ title, content, published = true }) {
  try {
    if (!title?.trim() || !content?.trim()) {
      return { ok: false, error: "A title and a message are both required." };
    }
    const supabase = await admin();

    const { data, error } = await supabase
      .from("announcements")
      .insert({ title: title.trim(), content: content.trim(), published: Boolean(published) })
      .select("id")
      .single();
    if (error) return { ok: false, error: explain(error) };

    revalidate(["/announcements", "/admin", "/admin/announcements"]);
    return { ok: true, id: data.id };
  } catch (e) {
    return { ok: false, error: explain(e) };
  }
}

export async function updateAnnouncement(id, { title, content, published }) {
  try {
    if (!title?.trim() || !content?.trim()) {
      return { ok: false, error: "A title and a message are both required." };
    }
    const supabase = await admin();

    const { error } = await supabase
      .from("announcements")
      .update({ title: title.trim(), content: content.trim(), published: Boolean(published) })
      .eq("id", id);
    if (error) return { ok: false, error: explain(error) };

    revalidate(["/announcements", "/admin", "/admin/announcements"]);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: explain(e) };
  }
}

export async function deleteAnnouncement(id) {
  try {
    const supabase = await admin();

    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return { ok: false, error: explain(error) };

    revalidate(["/announcements", "/admin", "/admin/announcements"]);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: explain(e) };
  }
}

/* ── Session ──────────────────────────────────────────────────────────── */

/**
 * Sign out. No requireAdmin() — someone whose membership was just revoked
 * still has a cookie, and refusing to let them drop it would be absurd.
 */
export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/admin", "layout");
  return { ok: true };
}
