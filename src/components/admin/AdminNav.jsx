"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CalendarCheck, LayoutDashboard, LogOut, Megaphone, Menu, Trophy, X } from "lucide-react";
import { signOut } from "@/app/admin/actions";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events & results", icon: CalendarCheck },
  { href: "/admin/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/admin/announcements", label: "Updates", icon: Megaphone },
];

/**
 * The admin bar.
 *
 * Same glass and hairline vocabulary as the public navbar, minus the flying
 * wordmark — the letters belong to the fest, and an organiser opening this at
 * 9pm to publish a result does not want a two-second entrance first.
 */
export default function AdminNav({ email }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);

  const active = (href) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  const leave = () =>
    start(async () => {
      await signOut();
      router.replace("/admin/login");
      router.refresh();
    });

  return (
    <header className="fixed inset-x-0 top-0 z-[60] px-4 pt-4 md:px-8">
      <nav className="glass glass-blur mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 md:px-5">
        <div className="flex items-center gap-2 md:gap-5">
          <Link
            href="/admin"
            className="font-display shrink-0 text-sm font-semibold tracking-tight text-cream-100"
          >
            ENGENIA<span className="text-gold-500"> admin</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                    active(link.href)
                      ? "bg-white/[0.09] text-cream-100 ring-1 ring-white/10"
                      : "text-white/55 hover:text-cream-100"
                  }`}
                >
                  <link.icon size={14} />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-white/35 xl:inline">{email}</span>
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden px-3 py-2 text-xs text-white/45 transition-colors hover:text-cream-100 sm:inline"
          >
            View site ↗
          </Link>
          <button
            type="button"
            onClick={leave}
            disabled={pending}
            className="glass flex h-10 items-center gap-2 px-3 text-xs font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-cream-100 disabled:opacity-50"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">{pending ? "Signing out…" : "Sign out"}</span>
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="glass flex h-10 w-10 items-center justify-center text-cream-100 lg:hidden"
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass glass-blur mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl p-2 lg:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                active(link.href) ? "bg-white/[0.09] text-cream-100" : "text-white/60"
              }`}
            >
              <link.icon size={15} />
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
