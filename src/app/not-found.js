import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80svh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-fest text-7xl font-black sm:text-9xl">404</p>
      <h1 className="font-display mt-4 text-2xl font-bold sm:text-3xl">This page missed its cue</h1>
      <p className="mt-3 max-w-md text-pretty text-sm text-white/50">
        The page you are looking for is not on the programme.
      </p>
      <Link
        href="/"
        className="btn btn-solid mt-8 inline-block px-8 py-4 text-sm font-semibold"
      >
        Back to Home
      </Link>
    </div>
  );
}
