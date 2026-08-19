"use client";

import { motion } from "motion/react";
import BrushRule from "@/components/BrushRule";

export default function SectionHeading({ eyebrow, title, accent, subtitle, align = "center" }) {
  const alignment = align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <div className={`flex flex-col ${alignment} gap-4`}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-cream-300/75"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }}
          />
          {eyebrow}
        </motion.span>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-fest font-display text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
      >
        {title}{" "}
        {accent && (
          <span className="relative inline-block">
            {/* Inherits the transparent fill, so the heading gradient paints
                straight through this word. The section hue still shows, in
                the swash underneath. */}
            <span>{accent}</span>
            {/* Painted swash under the accent word, in the section's hue. */}
            <motion.span
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 0.75 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-1 left-0 block w-full origin-left"
              style={{ color: "var(--accent)" }}
            >
              <BrushRule width="100%" />
            </motion.span>
          </span>
        )}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className={`max-w-2xl text-pretty text-base leading-relaxed text-cream-300/60 sm:text-lg ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
