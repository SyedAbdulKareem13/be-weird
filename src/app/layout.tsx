import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Archivo,
  Space_Mono,
  Roboto_Flex,
} from "next/font/google";
import "./globals.css";
import ArchiveChrome from "@/components/ArchiveChrome";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://be-weird-syed.vercel.app"),
  title: "Syed Abdul Kareem — Full Stack Developer · BE WEIRD",
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
      className={`${bricolage.variable} ${archivo.variable} ${spaceMono.variable} ${robotoFlex.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body>
        <a href="#specimen" className="skip-link">
          SKIP TO CONTENT
        </a>
        <ArchiveChrome>{children}</ArchiveChrome>
      </body>
    </html>
  );
}
