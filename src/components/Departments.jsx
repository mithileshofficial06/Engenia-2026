"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { departments } from "@/data/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Flourish from "@/components/Flourish";
import SectionShell from "@/components/SectionShell";
import useReveal from "@/lib/useReveal";

/**
 * The seven departments, as the logo arc cut into seven strips.
 *
 * The banner wall this replaces gave each department a saturated slab of its
 * own colour, and seven of those side by side put more chroma on the page than
 * any other section — it out-shouted the wordmark it was supposed to echo.
 * Here the colour carries information instead: the band is one continuous
 * sweep, and each strip is the part of it that its own department already owns
 * everywhere else on the site.
 *
 * Two things make that work.
 *
 * The order is derived, not chosen. Each department's accent is projected onto
 * the logo arc — the nearest point on the gradient in globals.css — and the
 * columns are sorted by where they land. So the band runs ember, crimson,
 * azure, jade, gold, the same left-to-right spread the artwork does, and no
 * one had to hand-place a department to make it come out that way.
 *
 * Every strip shows a window onto the same gradient rather than a flat fill of
 * its own. The gradient is sized to the whole band and offset by the strip's
 * position in it (the same device the split headline uses), so the seven
 * columns reassemble into one unbroken sweep — and a column can widen on hover
 * without its hue drifting, because the window it shows is a fraction of the
 * image, not a fixed number of pixels.
 */

// The stops of --grad-arc in globals.css, as numbers. Keep the two in step.
const ARC = [
  [0, "#f47115"],
  [0.26, "#d41350"],
  [0.52, "#077faf"],
  [0.74, "#05bbae"],
  [1, "#eb9512"],
];

function rgb(hex) {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** The arc's colour at t, interpolated the way the browser paints it. */
function arcAt(t) {
  for (let i = 1; i < ARC.length; i += 1) {
    const [t0, from] = ARC[i - 1];
    const [t1, to] = ARC[i];
    if (t > t1) continue;

    const k = (t - t0) / (t1 - t0);
    const a = rgb(from);
    const b = rgb(to);
    return a.map((v, j) => v + (b[j] - v) * k);
  }
  return rgb(ARC.at(-1)[1]);
}

/** Where a colour sits along the arc: the position of the closest point on it. */
function arcPosition(hex) {
  const c = rgb(hex);
  let best = 0;
  let bestDistance = Infinity;

  for (let t = 0; t <= 1; t += 0.002) {
    const s = arcAt(t);
    const d = (s[0] - c[0]) ** 2 + (s[1] - c[1]) ** 2 + (s[2] - c[2]) ** 2;
    if (d < bestDistance) {
      bestDistance = d;
      best = t;
    }
  }
  return best;
}

function luminance([r, g, b]) {
  const lin = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

const INK = "#070403";
const CREAM = "#fff8ec";
const L_INK = luminance(rgb(INK));
const L_CREAM = luminance(rgb(CREAM));
const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const ORDER = [...departments].sort((a, b) => arcPosition(a.accent) - arcPosition(b.accent));
const COUNT = ORDER.length;

/**
 * How much of a strip is flat.
 *
 * Pinning one stop per department, at the centre of its strip, made the whole
 * band a blend — every strip was on its way somewhere else, and none of them
 * was actually the colour the leaderboard gives that department. Two stops
 * hold the middle 60% flat and leave the blending to the seams, which is where
 * the eye wants it: the sweep still reads as continuous, and each strip is
 * unmistakably its own colour for most of its width.
 */
const EDGE = 0.2;

const STOPS = ORDER.flatMap((dept, i) => [
  [(i + EDGE) / COUNT, rgb(dept.accent)],
  [(i + 1 - EDGE) / COUNT, rgb(dept.accent)],
]);

/** The band's colour at u, where u runs 0..1 across the whole band. */
function bandAt(u) {
  if (u <= STOPS[0][0]) return STOPS[0][1];
  if (u >= STOPS.at(-1)[0]) return STOPS.at(-1)[1];

  for (let i = 1; i < STOPS.length; i += 1) {
    const [at, colour] = STOPS[i];
    if (u > at) continue;
    const [prevAt, prev] = STOPS[i - 1];
    const k = at === prevAt ? 0 : (u - prevAt) / (at - prevAt);
    return prev.map((v, j) => v + (colour[j] - v) * k);
  }
  return STOPS.at(-1)[1];
}

/**
 * Ink or cream over strip i, whichever survives the whole strip.
 *
 * Asking this of the accent alone got it wrong at the seams. A strip runs from
 * one blend to another — azure's left edge is half crimson — and a type colour
 * that clears AA against the accent by a hair can be down near 2.8:1 twenty
 * pixels away. So both candidates are scored across the strip and the one with
 * the better worst case wins.
 */
function readableOver(i) {
  let worstInk = Infinity;
  let worstCream = Infinity;

  for (let k = 0; k <= 8; k += 1) {
    const l = luminance(bandAt((i + k / 8) / COUNT));
    worstInk = Math.min(worstInk, contrast(l, L_INK));
    worstCream = Math.min(worstCream, contrast(l, L_CREAM));
  }
  return worstInk >= worstCream ? INK : CREAM;
}

/* The band's gradient, in the direction the strips run. */
const band = (angle) =>
  `linear-gradient(${angle}, ${STOPS.map(
    ([at, colour]) => `rgb(${colour.map(Math.round).join(" ")}) ${(at * 100).toFixed(2)}%`,
  ).join(", ")})`;

const BAND_X = band("90deg");
const BAND_Y = band("180deg");

export default function Departments() {
  const [bandRef, bandState] = useReveal({ amount: 0.15 });

  return (
    <SectionShell id="departments" hue="jade" className="px-4 py-16 sm:py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Flourish className="mx-auto mb-6 h-5 w-full max-w-md text-[var(--accent)] opacity-55" />

        <SectionHeading
          index={2}
          eyebrow="The contenders"
          title="Participating"
          accent="Departments"
          subtitle="Seven departments competing for cultural supremacy."
        />

        {/* Standings live on the leaderboard — this is only about who competes,
            so nothing here is ranked and the order is by hue alone. */}
        <ul
          ref={bandRef}
          className={`arc-band mt-14 ${bandState}`}
          style={{ "--n": COUNT, "--band-x": BAND_X, "--band-y": BAND_Y }}
        >
          {ORDER.map((dept, i) => (
            <li
              key={dept.code}
              tabIndex={0}
              className="arc-col"
              style={{
                "--i": i,
                // Window onto the band: strip i of n. See the note above.
                "--slice": `${((i / (COUNT - 1)) * 100).toFixed(3)}%`,
                "--fg": readableOver(i),
              }}
            >
              <span aria-hidden className="arc-idx">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="arc-code">{dept.code}</span>
              <span className="arc-name">{dept.name}</span>
            </li>
          ))}
        </ul>

        <Reveal from="up" delay={0.1} className="mt-12 flex justify-center">
          <Link
            href="/leaderboard"
            className="btn btn-ghost group inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold"
          >
            See who is ahead
            <span className="text-[11px] uppercase tracking-[0.24em] text-cream-400/70">full standings</span>
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Reveal>
      </div>
    </SectionShell>
  );
}
