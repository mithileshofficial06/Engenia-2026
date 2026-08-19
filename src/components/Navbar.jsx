"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { festival, navLinks } from "@/data/site";
import geometry from "@/data/wordmark.json";
import { useWordmarkFlight } from "@/components/WordmarkFlight";

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
              ? "glass shadow-[0_18px_60px_-24px_rgba(211,19,62,.5)]"
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
                    className={`relative rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                      active ? "text-cream-100" : "text-white/60 hover:text-cream-100"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-white/[0.09] ring-1 ring-white/10"
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
              className="bg-fest hidden rounded-full px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-[0_8px_28px_-8px_rgba(244,113,21,.9)] transition-transform duration-300 hover:scale-[1.04] active:scale-95 md:inline-block"
            >
              Explore Events
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="glass flex h-10 w-10 items-center justify-center rounded-full text-cream-100 md:hidden"
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
            className="fixed inset-0 z-[55] bg-ink-950/95 backdrop-blur-xl md:hidden"
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
                    className="font-display block border-b border-white/10 py-4 text-center text-3xl font-bold text-white/90 transition-colors hover:text-crimson-400"
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
