"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { highlights } from "@/data/site";

// Placeholder set — the six stills carried over from last year, laid out so
// the grid still reads well once more photos are dropped in.
const photos = highlights;
const SPANS = ["sm:col-span-2 sm:row-span-2", "", "", "sm:col-span-2", "", ""];

export default function GalleryGrid() {
  const [index, setIndex] = useState(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((delta) => {
    setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length));
  }, []);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  return (
    <>
      <div className="mx-auto grid max-w-6xl auto-rows-[190px] grid-cols-1 gap-3 px-4 pb-28 sm:auto-rows-[210px] sm:grid-cols-3 md:px-8">
        {photos.map((photo, i) => (
          <motion.button
            key={photo.src}
            type="button"
            onClick={() => setIndex(i)}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-white/10 ${SPANS[i % SPANS.length]}`}
            aria-label={`Open ${photo.title}`}
          >
            <Image
              src={photo.src}
              alt={photo.title}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-110"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

            <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-white/10 text-cream-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Expand size={14} />
            </span>

            <span className="absolute inset-x-0 bottom-0 p-4 text-left">
              <span className="bg-fest mb-2 block h-[3px] w-8 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="font-display block text-balance text-base font-bold leading-tight text-cream-100 sm:text-lg">
                {photo.title}
              </span>
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={photos[index].title}
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink-950/95 p-4 backdrop-blur-xl sm:p-10"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center bg-white/10 text-cream-100 transition hover:bg-white/20"
            >
              <X size={18} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/10 text-cream-100 transition hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/10 text-cream-100 transition hover:bg-white/20 sm:right-6"
            >
              <ChevronRight size={20} />
            </button>

            <motion.figure
              key={photos[index].src}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex w-full max-w-4xl flex-col items-center"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-white/15">
                <Image
                  src={photos[index].src}
                  alt={photos[index].title}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="mt-5 max-w-2xl text-center">
                <h2 className="font-display text-balance text-xl font-bold sm:text-2xl">{photos[index].title}</h2>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-white/55">{photos[index].body}</p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/30">
                  {index + 1} / {photos.length}
                </p>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
