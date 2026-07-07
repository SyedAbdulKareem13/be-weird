import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BE WEIRD — Syed Abdul Kareem",
    short_name: "SYD/13",
    description:
      "The specimen archive of one (1) weird developer. Enterprise CRM by day, weird internet by night.",
    start_url: "/",
    display: "standalone",
    background_color: "#0E0C15",
    theme_color: "#0E0C15",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
