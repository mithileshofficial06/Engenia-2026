"use client";

import { motion, useScroll, useSpring } from "motion/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="bg-arc fixed inset-x-0 top-0 z-[70] h-[3px] origin-left shadow-[0_0_18px_rgba(211,19,62,.65)]"
    />
  );
}
