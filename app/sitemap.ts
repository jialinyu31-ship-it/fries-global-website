import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return ["/zh", "/en", "/privacy", "/terms"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/zh" || path === "/en" ? "weekly" : "yearly",
    priority: path === "/zh" ? 1 : path === "/en" ? 0.8 : 0.3,
  }));
}
