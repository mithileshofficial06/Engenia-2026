/**
 * The ornament the logo itself uses either side of "2026" — a hairline with
 * leaf curls and a centre diamond. Used as a section divider so the page
 * carries the same decorative vocabulary as the artwork.
 */
export default function Flourish({ className = "", flip = false }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 420 24"
      className={className}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
      fill="none"
      stroke="currentColor"
    >
      <path d="M10 12h150" strokeWidth="1.1" opacity=".55" />
      <path d="M260 12h150" strokeWidth="1.1" opacity=".55" />

      {/* leaf curls turning in towards the centre */}
      <path d="M160 12c10-7 21-7 28-1-9 3-19 4-28 1z" fill="currentColor" stroke="none" opacity=".85" />
      <path d="M260 12c-10-7-21-7-28-1 9 3 19 4 28 1z" fill="currentColor" stroke="none" opacity=".85" />
      <path d="M166 15c7 5 15 6 21 3" strokeWidth="1.1" opacity=".5" />
      <path d="M254 15c-7 5-15 6-21 3" strokeWidth="1.1" opacity=".5" />

      {/* centre diamond */}
      <path d="M210 5l6 7-6 7-6-7 6-7z" fill="currentColor" stroke="none" />
      <path d="M196 12h5M219 12h5" strokeWidth="1.1" opacity=".7" />
    </svg>
  );
}
