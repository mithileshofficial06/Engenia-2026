"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Eye, EyeOff, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
} from "@/app/admin/actions";
import { formatDate, formatTime } from "@/lib/format";

/**
 * The updates feed, from the writing end.
 *
 * An announcement can be saved unpublished, which is the same staging idea the
 * event results use: write the "prize distribution starts in 10 minutes" post
 * while the previous event is still running, then publish it when it is true.
 * Unpublished rows are withheld by the row-level policy, so a draft is not
 * sitting in the public page waiting to be found in a network response.
 */

const BLANK = { title: "", content: "", published: true };

function Editor({ initial, onCancel, onDone }) {
  const [draft, setDraft] = useState(initial ?? BLANK);
  const [error, setError] = useState(null);
  const [pending, start] = useTransition();

  const editing = Boolean(initial?.id);

  const submit = (e) => {
    e.preventDefault();
    start(async () => {
      setError(null);
      const result = editing
        ? await updateAnnouncement(initial.id, draft)
        : await createAnnouncement(draft);

      if (result?.ok) onDone();
      else setError(result?.error ?? "That did not save.");
    });
  };

  return (
    <form onSubmit={submit} className="glass relative overflow-hidden rounded-2xl p-5">
      <span aria-hidden className="bg-arc absolute inset-x-0 top-0 h-px" />

      <label className="block">
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
          Title
        </span>
        <input
          type="text"
          required
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          placeholder="Group Dance results are out"
          className="mt-2 w-full rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-cream-100 outline-none transition focus:border-[var(--color-gold-500)]"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
          Message
        </span>
        <textarea
          required
          rows={5}
          value={draft.content}
          onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
          placeholder="Line breaks are kept exactly as you type them."
          className="mt-2 w-full resize-y rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-cream-100 outline-none transition focus:border-[var(--color-gold-500)]"
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setDraft((d) => ({ ...d, published: !d.published }))}
          className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition ${
            draft.published
              ? "bg-jade-500/15 text-jade-400"
              : "bg-white/[0.05] text-white/45"
          }`}
        >
          {draft.published ? <Eye size={13} /> : <EyeOff size={13} />}
          {draft.published ? "Visible on the site" : "Draft — hidden"}
        </button>

        <span className="flex-1" />

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-xs font-medium text-white/45 transition-colors hover:text-cream-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="btn btn-solid inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold disabled:opacity-50"
        >
          {pending && <Loader2 size={13} className="animate-spin" />}
          {editing ? "Save changes" : "Post update"}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-crimson-500/30 bg-crimson-500/10 px-3.5 py-2.5 text-xs text-crimson-400"
        >
          <AlertCircle size={13} className="mt-px shrink-0" />
          {error}
        </p>
      )}
    </form>
  );
}

function Row({ item, onEdit, onChanged }) {
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const toggle = () =>
    start(async () => {
      await updateAnnouncement(item.id, { ...item, published: !item.published });
      onChanged();
    });

  const remove = () =>
    start(async () => {
      await deleteAnnouncement(item.id);
      onChanged();
    });

  return (
    <li className="glass rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
            {item.createdAt ? `${formatDate(item.createdAt)} · ${formatTime(item.createdAt)}` : "—"}
            {!item.published && (
              <span className="rounded bg-white/[0.07] px-2 py-0.5 text-white/50">Draft</span>
            )}
          </div>
          <h2 className="font-display mt-2 text-balance text-base font-semibold text-cream-100 sm:text-lg">
            {item.title}
          </h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/55">
            {item.content}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={toggle}
            disabled={pending}
            title={item.published ? "Hide from the site" : "Publish"}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition disabled:opacity-40 ${
              item.published
                ? "bg-jade-500/15 text-jade-400 hover:bg-jade-500/25"
                : "bg-white/[0.05] text-white/40 hover:bg-white/[0.1]"
            }`}
          >
            {item.published ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button
            type="button"
            onClick={onEdit}
            title="Edit"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.05] text-white/50 transition hover:bg-white/[0.1] hover:text-cream-100"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => (confirming ? remove() : setConfirming(true))}
            onBlur={() => setConfirming(false)}
            disabled={pending}
            title={confirming ? "Click again to delete" : "Delete"}
            className={`flex h-10 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition disabled:opacity-40 ${
              confirming
                ? "bg-crimson-500/20 text-crimson-400"
                : "w-10 bg-white/[0.05] px-0 text-white/50 hover:bg-white/[0.1] hover:text-crimson-400"
            }`}
          >
            {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {confirming && "Sure?"}
          </button>
        </div>
      </div>
    </li>
  );
}

export default function AnnouncementsAdmin({ announcements, source }) {
  const router = useRouter();
  const [composing, setComposing] = useState(false);
  const [editing, setEditing] = useState(null);

  const done = () => {
    setComposing(false);
    setEditing(null);
    router.refresh();
  };

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Updates</h1>
          <p className="mt-1.5 text-sm text-white/45">
            {announcements.length} posted · {announcements.filter((a) => !a.published).length} draft
          </p>
        </div>

        {!composing && !editing && (
          <button
            type="button"
            onClick={() => setComposing(true)}
            className="btn btn-solid inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
          >
            <Plus size={15} />
            New update
          </button>
        )}
      </header>

      {source === "static" && (
        <p className="mt-5 flex items-start gap-2 rounded-lg border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-xs text-gold-400">
          <AlertCircle size={14} className="mt-px shrink-0" />
          Showing bundled content — the database is not reachable, so nothing here will save.
        </p>
      )}

      {composing && (
        <div className="mt-6">
          <Editor onCancel={() => setComposing(false)} onDone={done} />
        </div>
      )}

      <ul className="mt-6 space-y-3">
        {announcements.length === 0 && !composing && (
          <p className="py-10 text-center text-sm text-white/35">
            Nothing posted yet. The first update will appear on the site straight away.
          </p>
        )}

        {announcements.map((item) =>
          editing === item.id ? (
            <li key={item.id}>
              <Editor initial={item} onCancel={() => setEditing(null)} onDone={done} />
            </li>
          ) : (
            <Row key={item.id} item={item} onEdit={() => setEditing(item.id)} onChanged={done} />
          ),
        )}
      </ul>
    </div>
  );
}
