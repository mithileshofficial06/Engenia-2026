"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { highlights } from "@/data/site";
import SectionHeading from "@/components/SectionHeading";
import Flourish from "@/components/Flourish";
import { sectionAccent } from "@/lib/accents";

export default function Highlights() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const scrollTo = useCallback((index) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(index, highlights.length - 1));
    const card = track.children[clamped];
    if (card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, []);

  // Derive the active card from scroll position rather than tracking it manually,
  // so native swipes and button clicks stay in sync.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let min = Infinity;
        Array.from(track.children).forEach((child, i) => {
          const mid = child.offsetLeft - track.offsetLeft + child.clientWidth / 2;
          const d = Math.abs(mid - center);
          if (d < min) {
            min = d;
            closest = i;
          }
        });
        setActive(closest);
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="highlights" {...sectionAccent("crimson")} className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Flourish className="mx-auto mb-6 h-5 w-full max-w-md text-[var(--accent)] opacity-55" />

        <SectionHeading
          eyebrow="Look back"
          title="Cultural"
          accent="Highlights"
          subtitle="A glimpse of LICET's vibrant cultural spirit."
        />
      </div>

      <div className="relative mt-10">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-6 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {highlights.map((item, i) => (
            <motion.figure
              key={item.src}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative w-[85vw] shrink-0 snap-center overflow-hidden rounded-3xl sm:w-[62vw] lg:w-[46vw] xl:w-[560px]"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-ink-800">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 85vw, (max-width: 1280px) 62vw, 560px"
                  className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent" />
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />

                <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <span className="bg-fest mb-3 block h-[3px] w-10 rounded-full" />
                  <h3 className="font-display text-balance text-xl font-bold leading-tight text-cream-100 sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 max-w-md text-pretty text-sm leading-relaxed text-white/60">
                    {item.body}
                  </p>
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </div>

        {/* Controls */}
        <div className="mx-auto mt-2 flex max-w-6xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-1.5">
            {highlights.map((item, i) => (
              <button
                key={item.src}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to highlight ${i + 1}`}
                aria-current={active === i}
                className={`h-1.5 transition-all duration-300 ${
                  active === i ? "bg-fest w-8" : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollTo(active - 1)}
              disabled={active === 0}
              aria-label="Previous highlight"
              className="glass flex h-10 w-10 items-center justify-center text-white/80 transition disabled:opacity-30 enabled:hover:bg-white/[0.08] enabled:hover:text-cream-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollTo(active + 1)}
              disabled={active === highlights.length - 1}
              aria-label="Next highlight"
              className="glass flex h-10 w-10 items-center justify-center text-white/80 transition disabled:opacity-30 enabled:hover:bg-white/[0.08] enabled:hover:text-cream-100"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
