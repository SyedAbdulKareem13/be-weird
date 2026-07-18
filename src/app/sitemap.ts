import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/case-studies";

const BASE = "https://be-weird-syed.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
    },
    ...caseStudies
      .filter((study) => !study.unlisted)
      .map((study) => ({
        url: `${BASE}/exhibits/${study.slug}`,
        lastModified: new Date(),
      })),
  ];
}
