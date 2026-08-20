"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { departments, highlights } from "@/data/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Flourish from "@/components/Flourish";
import SectionShell from "@/components/SectionShell";
import useReveal from "@/lib/useReveal";

/**
 * The seven departments, as the logo arc cut into seven strips.
 *
 * Each strip is a photograph from the fest, held well back, with the logo arc
 * running across the band as trim rather than as fill.
 *
 * Colour used to be the fill: seven saturated slabs, which put more chroma on
 * the page than any other section and read as a swatch book rather than as a
 * fest. The photographs carry the section now — dimmed and drained almost to
 * grey so seven of them side by side stay quiet — and the arc survives in two
 * thin layers: a wash over each strip that tints it toward its department's
 * own colour, and a hairline at the foot at full strength. Same information,
 * a fraction of the volume.
 *
 * The order is derived, not chosen. Each department's accent is projected onto
 * the logo arc — the nearest point on the gradient in globals.css — and the
 * columns are sorted by where they land. So the band runs ember, crimson,
 * azure, jade, gold, the same left-to-right spread the artwork does, and no
 * one had to hand-place a department to make it come out that way.
 *
 * Both colour layers show a window onto one shared gradient rather than a fill
 * of their own. The gradient is sized to the whole band and offset by the
 * strip's position in it (the same device the split headline uses), so the
 * seven reassemble into an unbroken sweep — and a strip can widen on hover
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

/* The band's gradient, in the direction the strips run. */
const band = (angle) =>
  `linear-gradient(${angle}, ${STOPS.map(
    ([at, colour]) => `rgb(${colour.map(Math.round).join(" ")}) ${(at * 100).toFixed(2)}%`,
  ).join(", ")})`;

const BAND_X = band("90deg");
const BAND_Y = band("180deg");

/* The fest's own photographs, in the order the gallery holds them. There are
   fewer of these than there are departments, so one comes back round — which
   is why each strip also carries its own focal point: the two strips sharing a
   photograph are at opposite ends of the band and are cropped to different
   parts of it, and nothing reads as a repeat. */
const SHOTS = highlights.map((shot) => shot.src);
const FOCUS = ["50%", "36%", "62%", "44%", "58%", "38%", "66%"];

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
                "--focus": FOCUS[i % FOCUS.length],
              }}
            >
              {/* Atmosphere, not content — the photographs say "this is a fest
                  with a crowd in it" and nothing more, so they are unlabelled
                  and a screen reader is right to skip them. */}
              <Image
                src={SHOTS[i % SHOTS.length]}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 20vw"
                className="arc-shot"
              />
              <span aria-hidden className="arc-tint arc-slice" />
              <span aria-hidden className="arc-edge arc-slice" />

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
