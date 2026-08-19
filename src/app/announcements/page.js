import { Megaphone } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { announcements } from "@/data/site";
import { formatDate, formatTime } from "@/lib/format";

export const metadata = {
  title: "Updates",
  description: "Latest announcements and updates from the ENGENIA organising team.",
};

export default function AnnouncementsPage() {
  return (
    <div className="pb-28">
      <PageHeader
        hue="jade"
        eyebrow="Stay posted"
        title="Updates &"
        accent="Announcements"
        subtitle="Everything the organising team wants you to know, newest first."
      />

      <div className="mx-auto max-w-3xl px-4 md:px-8">
        {announcements.length === 0 && (
          <p className="text-center text-sm text-white/40">No announcements yet. Check back soon.</p>
        )}

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
                <h2 className="font-display mt-3 text-balance text-2xl font-bold leading-snug sm:text-3xl">
                  {item.title}
                </h2>
                <p className="mt-3 whitespace-pre-line text-pretty text-sm leading-relaxed text-white/60 sm:text-base">
                  {item.content}
                </p>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  );
}
