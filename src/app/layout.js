import { Syne, Manrope } from "next/font/google";
import "./globals.css";
import { festival } from "@/data/site";
import { FAVICON_SRC, OG_SRC } from "@/lib/assets";
import AmbientBackground from "@/components/AmbientBackground";

/* Display. Syne — the face drawn for an arts centre, and it shows: wide
   counters, angular joins, and an extrabold that reads as a poster rather
   than as a paragraph. That is the register a cultural fest wants, and it
   stops the site from looking like a journal set beside a hand-painted
   wordmark. Variable, so headings, pennant codes and the flip clock all pull
   the weight they need from one file. */
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

/* Everything else. Quiet, wide apertures, and proper tabular figures, which
   the leaderboard and the counter both lean on. */
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://engenia.vercel.app"),
  title: {
    default: `${festival.name} ${festival.year} — ${festival.tagline}`,
    template: `%s · ${festival.name} ${festival.year}`,
  },
  description: `${festival.name} ${festival.year} at ${festival.college}. ${festival.dates}.`,
  keywords: ["Engenia", "Engenia 2026", "LICET", "cultural fest", "Chennai", "Loyola ICAM"],
  icons: { icon: FAVICON_SRC, apple: FAVICON_SRC },
  openGraph: {
    title: `${festival.name} ${festival.year} — ${festival.tagline}`,
    description: `${festival.college} · ${festival.dates}`,
    images: [OG_SRC],
    type: "website",
  },
};

export const viewport = {
  themeColor: "#070403",
  width: "device-width",
  initialScale: 1,
};

/**
 * The root holds only what is true of every route: the document, the fonts,
 * and the backdrop.
 *
 * The navbar, the footer, the scroll rail and the opening curtain moved down
 * into the (site) group when the admin was added — see src/app/(site)/layout.js
 * for why. Anything put back here appears in the control room too.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased">
        <AmbientBackground />
        {children}
      </body>
    </html>
  );
}
