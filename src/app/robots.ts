import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/content";
import { routing } from "@/i18n/routing";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteConfig(routing.defaultLocale);
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.domain}/sitemap.xml`,
  };
}
