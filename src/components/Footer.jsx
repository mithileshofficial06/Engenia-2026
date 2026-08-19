import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { contact, festival, navLinks } from "@/data/site";
import { LOGO_SRC } from "@/lib/assets";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-10 border-t border-white/[0.07] bg-ink-950/60 backdrop-blur-xl">
      <span aria-hidden className="bg-arc absolute inset-x-0 top-0 h-px opacity-70" />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <Link href="/" className="relative block h-11 w-36">
            <Image src={LOGO_SRC} alt={`${festival.name} ${festival.year}`} fill sizes="144px" className="object-contain object-left" />
          </Link>
          <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-white/50">
            {festival.edition} at {festival.college}.
          </p>
          <p className="text-fest font-display mt-5 text-lg font-bold">{festival.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">Explore</h2>
          <ul className="mt-5 space-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-cream-100"
                >
                  <span className="bg-fest h-px w-0 transition-all duration-300 group-hover:w-4" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">Reach us</h2>
          <ul className="mt-5 space-y-4 text-sm text-white/60">
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-crimson-500" />
              <span className="text-pretty">{contact.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={15} className="shrink-0 text-gold-500" />
              <a href={`mailto:${contact.email}`} className="transition-colors hover:text-cream-100">
                {contact.email}
              </a>
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {contact.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="glass rounded-full px-3.5 py-1.5 text-[11px] font-medium text-white/65 transition-colors hover:text-cream-100"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-[11px] text-white/35 sm:flex-row md:px-8">
          <p>
            © {new Date().getFullYear()} {festival.name} {festival.year} · {festival.collegeShort}
          </p>
          <p>{festival.dates}</p>
        </div>
      </div>
    </footer>
  );
}
