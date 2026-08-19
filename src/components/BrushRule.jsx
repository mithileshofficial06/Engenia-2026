/**
 * A painted rule — undulating, tapered, with a couple of dry-brush specks —
 * standing in for the flat gradient hairlines. Takes `currentColor`, so a
 * section's accent drives it.
 */
export default function BrushRule({ className = "", width = 128 }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      style={{ width, height: 9 }}
      className={className}
      fill="currentColor"
    >
      <path d="M2 6.4C28 3.2 52 8.6 78 5.7c26-2.8 50 2.3 74-.6 12-1.4 30 2.1 46 .4v2.6c-16 1.9-34-1.6-46-.2-24 2.9-48-2.2-74 .6-26 2.9-50-2.5-76 .7z" />
      <ellipse cx="188" cy="4.2" rx="4.5" ry="0.9" opacity=".55" />
      <ellipse cx="196" cy="7.6" rx="2.6" ry="0.7" opacity=".35" />
      <ellipse cx="7" cy="9.4" rx="3.4" ry="0.8" opacity=".4" />
    </svg>
  );
}
