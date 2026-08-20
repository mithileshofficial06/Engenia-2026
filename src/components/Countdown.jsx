"use client";

import { Fragment, useEffect, useState } from "react";

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
];

// Must match the two 0.28s halves of the flip in globals.css.
const FLIP_MS = 560;

function diff(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
    done: ms === 0,
  };
}

/** Two cards, or three once a unit runs past 99 — days will, if the target is
 *  far enough out. Pre-mount the value is null and the cards read as dashes. */
function digitsOf(value) {
  if (value == null) return ["-", "-"];
  return String(value).padStart(2, "0").split("");
}

/**
 * One digit of the counter.
 *
 * While a flip is in flight the component holds two values at once: `shown`
 * is what the static cards still display, `incoming` is what the leaves are
 * bringing in. The leaves carry a React key so a new tick remounts them and
 * restarts the CSS animation from the top — without it a flip landing while
 * the previous one is still running would simply not play.
 */
function FlipDigit({ digit }) {
  const [shown, setShown] = useState(digit);
  const [incoming, setIncoming] = useState(null);

  useEffect(() => {
    if (digit === shown) return;

    // Coming out of the pre-mount dash there is nothing to flip away from,
    // so the first real value is swapped in rather than animated.
    if (!/\d/.test(shown)) {
      setShown(digit);
      return;
    }

    setIncoming(digit);
    const id = setTimeout(() => {
      setShown(digit);
      setIncoming(null);
    }, FLIP_MS);
    return () => clearTimeout(id);
  }, [digit, shown]);

  // The static top already carries the new numeral; the falling leaf is what
  // hides it until the flip completes.
  const next = incoming ?? shown;

  return (
    <div className="flip" aria-hidden>
      <div className="flip-half flip-half-top">
        <span>{next}</span>
      </div>
      <div className="flip-half flip-half-bottom">
        <span>{shown}</span>
      </div>

      {incoming !== null && (
        <>
          <div key={`out-${incoming}`} className="flip-half flip-half-top flip-leaf flip-leaf-top">
            <span>{shown}</span>
          </div>
          <div
            key={`in-${incoming}`}
            className="flip-half flip-half-bottom flip-leaf flip-leaf-bottom"
          >
            <span>{incoming}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function Countdown({ target }) {
  // null until mounted so server and client markup agree.
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(diff(target));
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  // The cards are decorative markup — split glyphs across four elements read
  // as nonsense aloud — so the whole counter is announced as one line here.
  const spoken = time
    ? `${time.days} days, ${time.hours} hours, ${time.minutes} minutes and ${time.seconds} seconds until the festival opens`
    : "Counting down to the festival";

  return (
    <div role="timer" aria-label={spoken}>
      <span className="sr-only">{spoken}</span>

      {/* .flip-clock holds the card dimensions the digits and the colons both
          measure from, so the separators stay on the cards' centre line at
          every breakpoint without repeating the numbers. */}
      <div aria-hidden className="flip-clock flex items-start justify-center gap-1 sm:gap-2">
        {UNITS.map((unit, i) => (
          <Fragment key={unit.key}>
            {i > 0 && <span className="flip-sep">:</span>}
            <div className="flex flex-col items-center gap-2.5">
              <div className="flex gap-1 sm:gap-1.5">
                {digitsOf(time?.[unit.key]).map((d, j) => (
                  <FlipDigit key={j} digit={d} />
                ))}
              </div>
              <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/40">
                {unit.label}
              </span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
