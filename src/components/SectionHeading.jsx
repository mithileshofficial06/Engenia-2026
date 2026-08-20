"use client";

import SplitHeading from "@/components/SplitHeading";
import useReveal from "@/lib/useReveal";

/**
 * The heading block every section opens with: position marker, title, rule.
 *
 * One observer runs the whole block. The eyebrow rises, then the title arrives
 * letter by letter, then the swash paints itself under the accent word, then
 * the subtitle catches up — all of it CSS keyframes on staggered delays, so the
 * sequence costs nothing on the main thread once it starts.
 */
export default function SectionHeading({
  eyebrow,
  title,
  accent,
  subtitle,
  index,
  align = "center",
}) {
  const [ref, state] = useReveal();
  const alignment = align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <div ref={ref} className={`flex flex-col ${alignment} gap-4 ${state}`}>
      {eyebrow && (
        <span className="rise-up glass inline-flex items-center gap-2.5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-cream-300/75">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }}
          />
          {/* The number is what makes the eyebrow a position rather than just
              a label — it tells you how far through the page you are, which
              the accent colour on its own cannot. */}
          {index != null && (
            <>
              <span className="tabular-nums" style={{ color: "var(--accent)" }}>
                {String(index).padStart(2, "0")}
              </span>
              <span className="text-cream-400/30">/</span>
            </>
          )}
          {eyebrow}
        </span>
      )}

      {/* The letters carry the logo arc between them; the swash under the
          accent word carries the section's own hue. */}
      <SplitHeading
        as="h2"
        title={title}
        accent={accent}
        swash
        delay={140}
        className="text-fest font-display text-balance text-[1.6rem] font-semibold leading-[1.12] tracking-tight sm:text-[2rem] md:text-[2.4rem]"
      />

      {subtitle && (
        <p
          style={{ "--rise-delay": "420ms" }}
          className={`rise-up max-w-xl text-pretty text-sm leading-relaxed text-cream-300/60 sm:text-base ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
