"use client";

import SplitHeading from "@/components/SplitHeading";
import Flourish from "@/components/Flourish";
import useReveal from "@/lib/useReveal";
import { sectionAccent } from "@/lib/accents";

/**
 * The masthead of a sub-page. Same entrance vocabulary as a section heading,
 * fired on mount rather than on scroll — it is already on screen when the route
 * loads, so waiting for an intersection would only delay it.
 */
export default function PageHeader({ eyebrow, title, accent, subtitle, hue = "ember", children }) {
  const [ref, state] = useReveal({ immediate: true });

  return (
    <header {...sectionAccent(hue)} className="relative px-4 pb-10 pt-28 sm:pt-32 md:px-8">
      {/* Radial falloff, unblurred. A gradient this soft has nothing left for a
          filter to smooth, and a full-width blurred layer behind a page header
          is one of the most expensive things a browser can be asked to paint. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 h-[38vmin] w-[90vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgb(var(--accent-rgb)_/_.2),transparent_70%)]"
      />
      <div
        ref={ref}
        className={`relative mx-auto flex max-w-6xl flex-col items-center text-center ${state}`}
      >
        {eyebrow && (
          <span className="rise-up glass inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }}
            />
            {eyebrow}
          </span>
        )}

        {/* The accent word takes no colour of its own: the whole heading is
            painted in the logo arc, and a solid fill inside it would punch a
            flat hole through the spread. */}
        <SplitHeading
          as="h1"
          title={title}
          accent={accent}
          delay={120}
          className="text-fest font-display mt-5 text-balance text-[2rem] font-semibold leading-[1.08] tracking-tight sm:text-[2.5rem] md:text-[3rem]"
        />

        {subtitle && (
          <p
            style={{ "--rise-delay": "460ms" }}
            className="rise-up mt-5 max-w-xl text-pretty text-sm leading-relaxed text-white/55 sm:text-base"
          >
            {subtitle}
          </p>
        )}

        <Flourish className="mt-6 h-5 w-full max-w-md text-[var(--accent)] opacity-55" />

        {children && (
          <div style={{ "--rise-delay": "560ms" }} className="rise-up mt-8 w-full">
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
