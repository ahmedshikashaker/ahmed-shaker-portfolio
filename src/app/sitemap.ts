import type { MetadataRoute } from "next";
import { getAllPosts, SITE_URL } from "@/lib/blog";
import { SERIES, seriesUrl } from "@/lib/series";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await getAllPosts()).filter((p) => !p.draft && !p.canonicalUrl);
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: posts[0] ? new Date(posts[0].publishedDate) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...SERIES.filter((s) => s.parts.some((part) => posts.some((p) => p.slug === part.slug))).map((s) => ({
      url: seriesUrl(s.slug),
      lastModified: new Date(
        posts
          .filter((p) => s.parts.some((part) => part.slug === p.slug))
          .map((p) => p.updatedDate ?? p.publishedDate)
          .sort()
          .at(-1)!
      ),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...posts.map((p) => ({
      url: p.url,
      lastModified: new Date(p.updatedDate ?? p.publishedDate),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
