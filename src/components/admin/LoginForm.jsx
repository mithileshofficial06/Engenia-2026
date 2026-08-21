"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AlertCircle, ArrowLeft, Loader2, Lock } from "lucide-react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { festival } from "@/data/site";
import { LOGO_SRC } from "@/lib/assets";

/**
 * The way in.
 *
 * Signing in happens on the client, through the Supabase SDK, because that is
 * what writes the session into cookies the browser and the server will both
 * read afterwards. `router.refresh()` then re-renders the server tree with
 * that session in place — without it the redirect lands on an admin page that
 * was rendered a moment earlier, signed out, and bounces straight back here.
 */
function LoginFields() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  // Where proxy.js was sending them before it found no session. Only relative
  // paths are honoured: an absolute URL in a query parameter is how a login
  // form gets turned into an open redirect.
  const next = (() => {
    const raw = params.get("next");
    return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/admin";
  })();

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        // Supabase says "Invalid login credentials" for both a wrong password
        // and an address that has no account, and that is the right amount to
        // say — telling an outsider which half they got right turns the form
        // into a way to test whether an address is registered.
        setError(
          /invalid/i.test(authError.message)
            ? "That email and password do not match an account."
            : authError.message,
        );
        setBusy(false);
        return;
      }

      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err?.message ?? "Something went wrong. Try again.");
      setBusy(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="glass relative z-10 w-full max-w-md rounded-2xl p-8 text-center">
        <span className="bg-arc absolute inset-x-0 top-0 h-px" />
        <AlertCircle className="mx-auto text-gold-400" size={26} />
        <h1 className="font-display mt-4 text-xl font-semibold">Supabase is not connected</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Add <code className="text-gold-400">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-gold-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
          <code className="text-gold-400">.env.local</code>, then restart the dev server. The steps
          are in <code className="text-gold-400">supabase/SETUP.md</code>.
        </p>
        <Link href="/" className="btn btn-ghost mt-6 inline-block px-6 py-3 text-sm font-semibold">
          Back to the site
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass relative w-full max-w-md overflow-hidden rounded-2xl p-8">
      <span aria-hidden className="bg-arc absolute inset-x-0 top-0 h-px" />

      <div className="flex flex-col items-center text-center">
        <div className="relative h-10 w-32">
          <Image src={LOGO_SRC} alt="" fill sizes="128px" className="object-contain" />
        </div>
        <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
          <Lock size={11} className="text-gold-500" />
          Organisers only
        </span>
        <h1 className="font-display mt-3 text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-white/45">
          Results, points and updates for {festival.name} {festival.year}.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
            Email
          </span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-cream-100 outline-none transition focus:border-[var(--color-gold-500)] focus:bg-white/[0.06]"
            placeholder="organisers@licet.ac.in"
          />
        </label>

        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
            Password
          </span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-cream-100 outline-none transition focus:border-[var(--color-gold-500)] focus:bg-white/[0.06]"
            placeholder="••••••••"
          />
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2 rounded-lg border border-crimson-500/30 bg-crimson-500/10 px-4 py-3 text-sm text-crimson-400"
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="btn btn-solid mt-7 flex w-full items-center justify-center gap-2 px-6 py-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy && <Loader2 size={15} className="animate-spin" />}
        {busy ? "Signing in…" : "Sign in"}
      </button>

      <Link
        href="/"
        className="mt-6 flex items-center justify-center gap-1.5 text-xs text-white/40 transition-colors hover:text-cream-100"
      >
        <ArrowLeft size={12} />
        Back to the site
      </Link>
    </form>
  );
}

export default function LoginForm() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center px-4 py-24">
      {/* useSearchParams needs a Suspense boundary above it, or the whole
          route opts out of static rendering. */}
      <Suspense fallback={<div className="h-96 w-full max-w-md" />}>
        <LoginFields />
      </Suspense>
    </div>
  );
}
