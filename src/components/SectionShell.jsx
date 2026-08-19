import { sectionAccent } from "@/lib/accents";

/**
 * Section shell: a full-bleed accent rule at the top, and an optional tinted
 * band behind the whole section.
 *
 * The sections all sat on the same drifting backdrop with nothing but vertical
 * space between them, so the page read as one continuous scroll and there was
 * no moment where one section visibly ended and the next began. Two things
 * fix that without hanging a divider graphic on every seam:
 *
 * - Every section opens with a hairline in its own accent, run the full width
 *   of the viewport. That marks the boundary and identifies the section by
 *   colour at the same time — azure is About, jade is Departments, and so on,
 *   which is the same mapping the ambient glow already follows.
 *
 * - Alternate sections carry a tinted band. The band is dark enough to flatten
 *   the orbs behind it, so scrolling the page alternates between lit and
 *   settled, and the eye gets a rhythm to count sections by.
 *
 * Deliberately static. Blur was the obvious thing to reach for here and is the
 * one thing that cannot work: a backdrop-filter would re-sample and re-blur
 * the ambient layer on every frame, and that layer is never still, so it could
 * never cache. This costs one paint.
 */
export default function SectionShell({ id, hue, band = false, className = "", children }) {
  return (
    <section
      id={id}
      {...sectionAccent(hue)}
      className={`relative ${band ? "bg-ink-900/65" : ""} ${className}`}
    >
      {/* The boundary marker. Fades out at both ends so it reads as a seam in
          the page rather than a box drawn around the section. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--accent) 20%, var(--accent) 80%, transparent)",
        }}
      />

      {/* A band needs closing as well as opening, or the next section looks
          like it starts early. */}
      {band && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-cream-400/12"
        />
      )}

      {children}
    </section>
  );
}
