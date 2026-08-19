import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { festival } from "@/data/site";
import { FAVICON_SRC, OG_SRC } from "@/lib/assets";
import AmbientBackground from "@/components/AmbientBackground";
import IntroCurtain from "@/components/IntroCurtain";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { WordmarkFlightProvider } from "@/components/WordmarkFlight";

/* Display. A soft old-style serif with real character in the letterforms —
   chosen because the wordmark is hand-painted, and a neutral grotesque next
   to it just looks like the artwork and the site were made by two people who
   never spoke. Variable, so headings and the flip clock both get the weight
   they need from one file. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased">
        <IntroCurtain />
        <AmbientBackground />
        <ScrollProgress />
        <WordmarkFlightProvider>
          <Navbar />
          <main className="relative z-10">{children}</main>
        </WordmarkFlightProvider>
        <Footer />
      </body>
    </html>
  );
}
