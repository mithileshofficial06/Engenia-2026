"use client";

import { Fragment, useEffect, useRef } from "react";
import BrushRule from "@/components/BrushRule";

/**
 * A heading that arrives one letter at a time, rising through its own baseline.
 *
 * Two things are being solved here at once, and the second is the awkward one.
 *
 * The motion is pure CSS — see `.split-char` in globals.css. Every glyph is an
 * inline-block inside a clipping word box and carries an index, and the
 * animation is a keyframe with a per-letter delay computed from that index. So
 * a twenty-letter heading is twenty composited transforms with no JavaScript
 * running while they play, rather than twenty animation loops. The container's
 * `rise-in` class is the only trigger.
 *
 * The gradient is the awkward one. `background-clip: text` clips against the
 * box of the element that owns the background, so painting the arc on the
 * heading and then moving the letters inside it does not work: each letter
 * stops sampling the heading and starts sampling itself, and the line renders
 * as twenty complete rainbows instead of one sweep. So every letter gets its
 * own copy of the gradient, sized to the full heading box and offset by that
 * letter's position inside it — which reconstructs exactly the gradient the
 * heading would have painted, while leaving each glyph free to move.
 *
 * Those offsets are read with `offsetLeft`/`offsetTop` rather than
 * `getBoundingClientRect`, deliberately: the letters are sitting under a
 * transform when the measurement runs, and rects include transforms while
 * offsets do not. Measuring the rect would lock every letter's gradient to
 * wherever it happened to be parked before the animation started.
 */

// Per-letter stagger. Must match the 26ms in `.rise-in .split-char`.
const CHAR_MS = 26;
// How long after the last letter lands before the swash paints itself in.
const SWASH_LAG_MS = 180;

const words = (text) => String(text ?? "").split(/\s+/).filter(Boolean);

export default function SplitHeading({
  as: Tag = "h2",
  title,
  accent,
  swash = false,
  gradient = true,
  delay = 0,
  className = "",
}) {
  const rootRef = useRef(null);

  // Letters are numbered across the whole heading, so the stagger runs
  // unbroken from the first word of the title into the accent word.
  let n = 0;
  // The word separator is emitted *before* each word after the first, never
  // after the last. A trailing space inside the accent group would widen its
  // wrapper past the final letter, and the swash — which is sized to that
  // wrapper — would run on past the end of the word it underlines.
  const build = (text) =>
    words(text).map((word, wi) => (
      <Fragment key={`${word}-${wi}`}>
        {wi > 0 && " "}
        <span className="split-word">
          {Array.from(word).map((ch, ci) => (
            // eslint-disable-next-line react/no-array-index-key
            <span key={ci} className="split-char" style={{ "--i": n++ }}>
              {ch}
            </span>
          ))}
        </span>
      </Fragment>
    ));

  const titleNodes = build(title);
  const accentNodes = accent ? build(accent) : null;
  const swashDelay = delay + n * CHAR_MS + SWASH_LAG_MS;

  useEffect(() => {
    if (!gradient) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const chars = Array.from(root.querySelectorAll(".split-char"));
    if (chars.length === 0) return undefined;

    // Walks the offset chain rather than assuming the letter's offsetParent is
    // the heading — the accent word sits inside a positioned wrapper so that
    // the swash has something to hang off.
    const offsetIn = (el) => {
      let x = 0;
      let y = 0;
      let node = el;
      while (node && node !== root) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent;
      }
      return [x, y];
    };

    const paint = () => {
      const w = root.offsetWidth;
      const h = root.offsetHeight;
      if (!w || !h) return;
      for (const el of chars) {
        const [x, y] = offsetIn(el);
        el.style.backgroundSize = `${w}px ${h}px`;
        el.style.backgroundPosition = `${-x}px ${-y}px`;
      }
    };

    paint();

    // Re-runs on anything that can reflow the line: a viewport change, a
    // rewrap, and the display font landing late — which moves every letter.
    const ro = new ResizeObserver(paint);
    ro.observe(root);
    document.fonts?.ready.then(paint).catch(() => {});

    return () => ro.disconnect();
  }, [gradient, title, accent]);

  return (
    <Tag
      ref={rootRef}
      className={`split ${gradient ? "split-fest" : ""} ${className}`}
      style={{ "--rise-delay": `${delay}ms`, "--swash-delay": `${swashDelay}ms` }}
    >
      {/* A heading chopped into one element per glyph is a heading some screen
          readers will spell out. The real string is given once, here, and the
          decorative version is hidden from the accessibility tree — `contents`
          because the wrapper must not introduce a box that the layout, or the
          offset walk above, would have to account for. */}
      <span className="sr-only">{[title, accent].filter(Boolean).join(" ")}</span>

      <span aria-hidden className="contents">
        {titleNodes}
        {accentNodes && " "}
        {accentNodes && (
          <span className="relative inline-block">
            {accentNodes}
            {swash && (
              <span
                className="split-swash absolute -bottom-1 left-0 w-full"
                style={{ color: "var(--accent)" }}
              >
                <BrushRule width="100%" />
              </span>
            )}
          </span>
        )}
      </span>
    </Tag>
  );
}
