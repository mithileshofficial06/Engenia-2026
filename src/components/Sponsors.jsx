"use client";

import Image from "next/image";
import { sponsors, titleSponsor } from "@/data/site";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Flourish from "@/components/Flourish";
import { sectionAccent } from "@/lib/accents";

function Logo({ sponsor, size = "md" }) {
  const box = size === "lg" ? "h-24 w-52 sm:h-32 sm:w-72" : "h-14 w-32 sm:h-16 sm:w-40";

  return (
    <div className="mx-3 shrink-0 sm:mx-5">
      <div
        className={`glass group relative flex ${box} items-center justify-center rounded-2xl px-5 transition-colors duration-500 hover:border-white/25`}
        title={sponsor.name}
      >
        <Image
          src={sponsor.logo}
          alt={sponsor.name}
          fill
          sizes="288px"
          className="object-contain p-4 opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
        />
      </div>
      <p className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/35">{sponsor.name}</p>
    </div>
  );
}

export default function Sponsors() {
  return (
    <section id="sponsors" {...sectionAccent("gold")} className="relative overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Flourish className="mx-auto mb-6 h-5 w-full max-w-md text-[var(--accent)] opacity-55" />

        <SectionHeading
          eyebrow="With thanks"
          title="Our"
          accent="Sponsors"
          subtitle="The partners who make the extravaganza possible."
        />

        {/* Title sponsor */}
        <Reveal from="scale" delay={0.1} className="mt-10">
          <div className="glass relative mx-auto flex max-w-2xl flex-col items-center overflow-hidden rounded-3xl px-6 py-10 sm:px-12">
            <span className="bg-arc absolute inset-x-0 top-0 h-px" />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-48 rounded-full bg-[radial-gradient(circle,rgb(var(--accent-rgb)_/_.3),transparent_65%)] blur-2xl"
            />
            <span className="bg-fest relative px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-ink-950">
              {titleSponsor.label}
            </span>

            <div className="relative mt-8 h-24 w-56 sm:h-32 sm:w-80">
              <Image
                src={titleSponsor.logo}
                alt={titleSponsor.name}
                fill
                sizes="320px"
                className="object-contain"
              />
            </div>

            <p className="font-display relative mt-6 text-2xl font-bold text-cream-100 sm:text-3xl">
              {titleSponsor.name}
            </p>
          </div>
        </Reveal>
      </div>

      {/* Marquee of other sponsors */}
      <div className="mt-12">
        <p className="mb-8 text-center text-[10px] font-medium uppercase tracking-[0.34em] text-white/35">
          Other Sponsors
        </p>
        <Marquee speed="slow">
          {sponsors.map((s) => (
            <Logo key={s.name} sponsor={s} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
