import IntroCurtain from "@/components/IntroCurtain";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { WordmarkFlightProvider } from "@/components/WordmarkFlight";

/**
 * The public site's chrome.
 *
 * Split out of the root layout when the admin arrived. A route group changes
 * no URLs — /events is still /events — it only decides which layouts wrap
 * what, and the admin has no business inheriting the fest's navbar, its
 * footer, or the two-and-a-half-second opening curtain. Without this the
 * control room rendered with two navigation bars stacked on top of each other
 * and two footers underneath.
 *
 * The ambient backdrop stays at the root, deliberately: it is the ground the
 * whole product sits on, and the admin looks like part of the same site rather
 * than a bolted-on tool because of it.
 */
export default function SiteLayout({ children }) {
  return (
    <>
      <IntroCurtain />
      <ScrollProgress />
      <WordmarkFlightProvider>
        <Navbar />
        <main className="relative z-10">{children}</main>
      </WordmarkFlightProvider>
      <Footer />
    </>
  );
}
