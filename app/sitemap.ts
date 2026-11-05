import type { MetadataRoute } from "next";
import site from "@/data/site.json";
import { defaultLocale, locales, PAGES } from "@/lib/locales";

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((path) =>
    locales.map((lang) => ({
      url: `${site.url}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? (lang === defaultLocale ? 1 : 0.8) : path === "/legal" ? 0.2 : lang === defaultLocale ? 0.9 : 0.7,
      alternates: { languages: { ...Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}`])), "x-default": `${site.url}/${defaultLocale}${path}` } },
    })),
  );
}
