import type { MetadataRoute } from "next";
import { navLinks, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return navLinks.map(({ href }) => ({
    url: `${site.url}${href === "/" ? "" : href}`,
    lastModified,
    changeFrequency: href === "/" ? "weekly" : "monthly",
    priority: href === "/" ? 1 : href === "/contact" || href === "/services" ? 0.9 : 0.7,
  }));
}
