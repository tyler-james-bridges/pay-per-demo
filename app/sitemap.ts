import type { MetadataRoute } from "next";

const siteUrl = process.env.BASE_URL ?? "https://pay-per-demo.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
