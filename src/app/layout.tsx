import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { identity } from "@/data/content";
import {
  Bricolage_Grotesque,
  Archivo,
  Space_Mono,
  Roboto_Flex,
  Source_Serif_4,
} from "next/font/google";
import "./globals.css";
import ArchiveChrome from "@/components/ArchiveChrome";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import CommandPalette from "@/components/CommandPalette";
import KonamiWatcher from "@/components/KonamiWatcher";
import Nav from "@/components/Nav";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

// Hero pressure type. The brief specified Compressa VF, but its only known
// hosted copy (Cloudinary) is dead and the font is not freely licensed —
// Roboto Flex is React Bits' own current TextPressure default, SIL-OFL, and
// its wdth axis (25–151) is even more elastic. Deviation noted.
const robotoFlex = Roboto_Flex({
  variable: "--font-flex",
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// BORING mode masthead + headings — the consulting-document voice.
const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://be-weird-syed.vercel.app"),
  title: "Syed Abdul Kareem — Forward Deployed Engineer · BE WEIRD",
  description:
    "The specimen archive of one (1) weird developer. Enterprise CRM platforms by day, weird internet things by night. Angular · React · Next.js · Node.js · GenAI.",
  keywords: [
    "Syed Abdul Kareem",
    "Full Stack Developer",
    "Angular",
    "React",
    "Next.js",
    "Node.js",
    "GenAI",
    "Portfolio",
  ],
  openGraph: {
    title: "SYED ABDUL KAREEM — BE WEIRD",
    description:
      "The specimen archive of one (1) weird developer. Handle with curiosity.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0C15",
  width: "device-width",
  initialScale: 1,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Syed Abdul Kareem",
  jobTitle: "Forward Deployed Engineer",
  worksFor: {
    "@type": "Organization",
    name: "KEBS (Kaar Enterprise Business Suites)",
  },
  email: `mailto:${identity.email}`,
  url: "https://be-weird-syed.vercel.app",
  sameAs: [identity.github, identity.linkedin],
};

/**
 * Runs before hydration: resolves mode from localStorage, falling back to
 * prefers-reduced-motion (reduce → boring). Prevents a flash of wrong mode.
 */
const modeScript = `
(function () {
  try {
    var stored = localStorage.getItem("archive-mode");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var mode = stored === "weird" || stored === "boring" ? stored : reduced ? "boring" : "weird";
    document.documentElement.setAttribute("data-mode", mode);
    if (!stored && reduced) document.documentElement.setAttribute("data-auto-calmed", "1");
  } catch (e) {
    document.documentElement.setAttribute("data-mode", "weird");
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-mode="weird"
      className={`${bricolage.variable} ${archivo.variable} ${spaceMono.variable} ${robotoFlex.variable} ${sourceSerif.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>
        <a href="#specimen" className="skip-link">
          SKIP TO CONTENT
        </a>
        <ArchiveChrome>
          <Preloader />
          <CustomCursor />
          <CommandPalette />
          <KonamiWatcher />
          <Nav />
          {children}
        </ArchiveChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
