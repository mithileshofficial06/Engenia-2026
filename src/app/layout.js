import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { festival } from "@/data/site";
import { FAVICON_SRC, OG_SRC } from "@/lib/assets";
import AmbientBackground from "@/components/AmbientBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { WordmarkFlightProvider } from "@/components/WordmarkFlight";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://engenia.vercel.app"),
  title: {
    default: `${festival.name} ${festival.year} — ${festival.tagline}`,
    template: `%s · ${festival.name} ${festival.year}`,
  },
  description: `${festival.name} ${festival.year} is the ${festival.edition.toLowerCase()} of ${festival.college}. ${festival.dates}.`,
  keywords: ["Engenia", "Engenia 2026", "LICET", "cultural fest", "Chennai", "Loyola ICAM"],
  icons: { icon: FAVICON_SRC, apple: FAVICON_SRC },
  openGraph: {
    title: `${festival.name} ${festival.year} — ${festival.tagline}`,
    description: `${festival.edition} · ${festival.dates}`,
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
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
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
