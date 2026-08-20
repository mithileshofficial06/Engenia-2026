"use client";

import { Megaphone } from "lucide-react";
import Reveal from "@/components/Reveal";
import { useFest } from "@/components/FestProvider";
import { formatDate, formatTime } from "@/lib/format";

/**
 * The updates feed, live.
 *
 * Markup lifted unchanged from the page this replaced — the only difference is
 * where the list comes from. A post published in the admin appears here on
 * every open tab as soon as Postgres pushes it, which on the day of the fest
 * is the difference between "check the site" and "look at your phone".
 *
 * Drafts never arrive: the row-level policy filters unpublished rows out of
 * the public read, so an announcement being written now is not sitting in
 * anybody's browser waiting to be found.
 */
export default function AnnouncementsFeed() {
  const { announcements } = useFest();

  if (announcements.length === 0) {
    return (
      <p className="text-center text-sm text-white/40">No announcements yet. Check back soon.</p>
    );
  }

  return (
    <ol className="relative space-y-4 border-l border-white/10 pl-6 sm:pl-8">
      {announcements.map((item, i) => (
        <Reveal key={item.id} from="left" delay={0.06 * i} as="li" className="relative">
          <span className="bg-fest absolute -left-[31px] top-7 h-3.5 w-3.5 rounded-full ring-4 ring-ink-950 sm:-left-[39px]" />
          <article className="glass relative overflow-hidden rounded-2xl p-6 sm:p-7">
            <span className="bg-arc absolute inset-x-0 top-0 h-px opacity-70" />
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              <Megaphone size={12} className="text-gold-500" />
              {formatDate(item.createdAt)} · {formatTime(item.createdAt)}
            </div>
            <h2 className="font-display mt-3 text-balance text-xl font-semibold leading-snug sm:text-2xl">
              {item.title}
            </h2>
            <p className="mt-3 whitespace-pre-line text-pretty text-sm leading-relaxed text-white/60 sm:text-base">
              {item.content}
            </p>
          </article>
        </Reveal>
      ))}
    </ol>
  );
}
