"use client";

import { motion } from "motion/react";

const variants = {
  up: { y: 40, opacity: 0 },
  down: { y: -40, opacity: 0 },
  left: { x: 48, opacity: 0 },
  right: { x: -48, opacity: 0 },
  fade: { opacity: 0 },
  scale: { scale: 0.92, opacity: 0 },
};

/** Scroll-triggered entrance. Fires once, respects reduced motion via CSS. */
export default function Reveal({
  children,
  from = "up",
  delay = 0,
  duration = 0.7,
  className = "",
  amount = 0.25,
  as = "div",
}) {
  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      className={className}
      initial={variants[from] ?? variants.up}
      whileInView={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
