"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { festival, navLinks } from "@/data/site";
import geometry from "@/data/wordmark.json";
import { COLLEGE_LOGO } from "@/lib/assets";
import { useWordmarkFlight } from "@/components/WordmarkFlight";

/* The crest waits for the fest wordmark to finish arriving before it appears.
   The letters land at 2.07s (WordmarkFlight staggers seven of them at
   0.3 + i * 0.12 with a 1.05s drop) and the curtain is off them shortly
   after; showing the college mark in the same breath as the opening would
   read as two logos competing for the same moment. Same number the hero
   sequences its own content off — if the stagger changes, both move. */
const LOGO_SETTLED = 2.4;

export default function Navbar() {
  const pathname = usePathname();
  const { dockSlot } = useWordmarkFlight();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[60] px-4 pt-4 md:px-8"
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 md:px-6 ${
            scrolled
              ? "glass glass-blur"
              : "border border-transparent bg-transparent"
          }`}
        >
          {/* Where the letters land. The slot stays empty and simply reserves
              the space — WordmarkFlight draws the letters over it once they
              arrive, and this link stays clickable underneath throughout. */}
          <Link
            href="/"
            aria-label={`${festival.name} ${festival.year} home`}
            className="group relative block w-[92px] shrink-0 sm:w-[112px]"
          >
            <span
              ref={dockSlot}
              aria-hidden
              className="block w-full"
              style={{ aspectRatio: geometry.aspect }}
            />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                      active ? "text-cream-100" : "text-white/60 hover:text-cream-100"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 bg-white/[0.09] ring-1 ring-white/10"
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/events"
              className="btn btn-solid hidden px-6 py-3 text-sm font-semibold md:inline-block"
            >
              Explore Events
            </Link>

            {/* The college the fest belongs to. It sits past the call to
                action deliberately: the crest is provenance, not navigation,
                and putting it before the button would make it compete with
                the fest's own wordmark at the other end of the bar. */}
            <motion.div
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: LOGO_SETTLED, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 md:gap-3"
            >
              <span aria-hidden className="hidden h-6 w-px bg-white/12 md:block" />
              <Image
                src={COLLEGE_LOGO.src}
                alt={festival.college}
                width={COLLEGE_LOGO.width}
                height={COLLEGE_LOGO.height}
                priority
                className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
              />
            </motion.div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="glass flex h-10 w-10 items-center justify-center text-cream-100 transition-colors hover:bg-white/[0.08] md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[55] bg-ink-950/97 md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-2 px-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-xs"
                >
                  <Link
                    href={link.href}
                    className="font-display block border-b border-white/10 py-4 text-center text-2xl font-semibold text-white/90 transition-colors hover:text-crimson-400"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42 }}
                className="mt-8 text-xs uppercase tracking-[0.35em] text-white/40"
              >
                {festival.dates}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
