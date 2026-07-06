import type { MetadataRoute } from "next";
import { getAllProjects, getSiteConfig } from "@/lib/content";
import { routing } from "@/i18n/routing";

function localizedPath(domain: string, locale: string, path: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${domain}${prefix}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig(routing.defaultLocale);
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const projects = getAllProjects(locale);
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, localizedPath(site.domain, l, "")])
    );

    entries.push({
      url: localizedPath(site.domain, locale, ""),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    });
    entries.push({
      url: localizedPath(site.domain, locale, "/projects"),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, localizedPath(site.domain, l, "/projects")])
        ),
      },
    });
    for (const project of projects) {
      entries.push({
        url: localizedPath(site.domain, locale, `/projects/${project.slug}`),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, localizedPath(site.domain, l, `/projects/${project.slug}`)])
          ),
        },
      });
    }
  }

  return entries;
}
