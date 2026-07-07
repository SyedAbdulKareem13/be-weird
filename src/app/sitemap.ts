import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://be-weird-syed.vercel.app",
      lastModified: new Date(),
    },
  ];
}
