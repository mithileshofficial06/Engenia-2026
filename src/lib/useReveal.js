"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One observer, one class.
 *
 * Returns a ref to put on a block and a flag that flips the first time that
 * block enters the viewport. Spread the flag onto the block as the `rise-in`
 * class and everything inside it — headings, letters, swashes, banners —
 * starts on its own CSS delay.
 *
 * The point of doing it this way is that a section's entrance costs exactly
 * one IntersectionObserver, not one per animated element, and nothing runs on
 * the main thread once the class is on. `once` is implicit: the observer
 * disconnects the moment it fires, because none of these entrances play twice.
 */
export default function useReveal({ immediate = false, amount = 0.25 } = {}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(immediate);

  useEffect(() => {
    if (immediate) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    // No observer means no trigger, and an untriggered block never becomes
    // visible — so show it outright rather than leave a hole in the page.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      // Pulled up from the bottom edge so a heading starts its letters once it
      // is properly on screen, not the instant its first pixel appears.
      { threshold: amount, rootMargin: "0px 0px -10% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [immediate, amount]);

  return [ref, shown ? "rise-in" : ""];
}
