/**
 * The black the site opens on.
 *
 * Sits above everything except the wordmark, so the logo reveals against an
 * empty screen and the page is only uncovered once the letters have landed.
 * See `.intro-curtain` in globals.css — the lift is a CSS animation with no
 * client component behind it, so a hydration failure cannot leave the site
 * blacked out.
 */
export default function IntroCurtain() {
  return <div aria-hidden className="intro-curtain fixed inset-0 z-[75] bg-ink-950" />;
}
