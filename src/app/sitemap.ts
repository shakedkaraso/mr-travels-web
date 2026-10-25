import type { MetadataRoute } from "next";
import { ALL_DESTINATIONS } from "@/lib/hot-deals";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/deals`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/destinations`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/accessibility`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const dealRoutes: MetadataRoute.Sitemap = ALL_DESTINATIONS.map((dest) => ({
    url: `${SITE_URL}/deals/${dest.code}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...dealRoutes];
}
