"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
];

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

export default function Countdown({ target }) {
  // null until mounted so server and client markup agree.
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(diff(target));
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="flex items-stretch gap-2 sm:gap-3">
      {UNITS.map((unit, i) => (
        <motion.div
          key={unit.key}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative flex min-w-[68px] flex-col items-center rounded-xl px-3 py-3 sm:min-w-[86px] sm:px-4 sm:py-4"
        >
          <span className="font-display text-2xl font-bold leading-none tabular-nums text-cream-100 sm:text-4xl">
            {time ? String(time[unit.key]).padStart(2, "0") : "--"}
          </span>
          <span className="mt-2 text-[9px] font-medium uppercase tracking-[0.22em] text-white/45 sm:text-[10px]">
            {unit.label}
          </span>
          <span className="bg-fest absolute inset-x-3 bottom-0 h-px opacity-60" />
        </motion.div>
      ))}
    </div>
  );
}
