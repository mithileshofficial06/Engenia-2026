"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Loader2, RotateCcw, X } from "lucide-react";
import { resetLeaderboard } from "@/app/admin/actions";

/**
 * The reset, from the pressing end.
 *
 * Three deliberate frictions between an idle cursor and an emptied fest: the
 * control is collapsed until asked for, opening it states plainly what will
 * go, and the button stays disabled until a password has been typed. The
 * password is re-checked on the server against the auth server, not compared
 * to anything held here — see resetLeaderboard() in actions.js.
 *
 * The field is cleared on every exit, success or failure. A password left
 * sitting in a form on the results desk is the thing this whole flow exists
 * to guard against.
 */
export default function ResetLeaderboard({ placings = 0 }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [done, setDone] = useState(null);
  const [pending, start] = useTransition();

  const close = () => {
    setOpen(false);
    setPassword("");
    setError(null);
  };

  const submit = (e) => {
    e.preventDefault();
    start(async () => {
      setError(null);
      const result = await resetLeaderboard(password);

      if (result?.ok) {
        setDone(result.cleared ?? 0);
        setPassword("");
        setOpen(false);
        router.refresh();
      } else {
        setError(result?.error ?? "The reset did not go through.");
        setPassword("");
      }
    });
  };

  if (done !== null) {
    return (
      <div className="mt-10 rounded-2xl border border-jade-500/30 bg-jade-500/[0.07] p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-jade-400">
          <Check size={15} />
          Leaderboard reset
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/50">
          {done} placing{done === 1 ? "" : "s"} cleared, and every event returned to unrevealed.
          Points values, guidelines and dates were left alone — the fest is set up exactly as it
          was, with nothing scored.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-2xl border border-crimson-500/25 bg-crimson-500/[0.05] p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-crimson-400">
        Danger zone
      </p>

      {!open ? (
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <p className="max-w-xl text-[13px] leading-relaxed text-white/45">
            Clears every placing on record and returns all events to unrevealed, putting all seven
            departments back to zero. Points values, guidelines and dates are untouched. There is
            no undo.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-crimson-500/40 px-5 py-3 text-xs font-semibold text-crimson-400 transition-colors hover:bg-crimson-500/10"
          >
            <RotateCcw size={13} />
            Reset leaderboard
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-3">
          <p className="text-[13px] leading-relaxed text-white/55">
            This deletes{" "}
            <strong className="font-semibold text-cream-100">
              {placings} placing{placings === 1 ? "" : "s"}
            </strong>{" "}
            and un-reveals every event. The public leaderboard drops to zero the moment it saves,
            on every device currently watching it. It cannot be undone.
          </p>

          <label className="mt-4 block max-w-sm">
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
              Confirm with your password
            </span>
            <input
              type="password"
              autoFocus
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-cream-100 outline-none transition focus:border-[var(--color-crimson-500)] focus:bg-white/[0.06]"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-lg border border-crimson-500/30 bg-crimson-500/10 px-4 py-3 text-sm text-crimson-400"
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="submit"
              disabled={pending || !password}
              className="inline-flex items-center gap-2 rounded-lg bg-crimson-500/90 px-5 py-3 text-xs font-semibold text-cream-100 transition-colors hover:bg-crimson-500 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {pending ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
              {pending ? "Resetting…" : "Yes, reset everything"}
            </button>
            <button
              type="button"
              onClick={close}
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-xs font-semibold text-white/50 transition-colors hover:text-cream-100 disabled:opacity-45"
            >
              <X size={13} />
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
