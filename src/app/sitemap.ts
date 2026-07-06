import type { MetadataRoute } from "next";
import { getAllProjects, getSiteConfig } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig();
  const projects = getAllProjects();

  return [
    { url: site.domain, changeFrequency: "monthly", priority: 1 },
    { url: `${site.domain}/projects`, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((p) => ({
      url: `${site.domain}/projects/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
