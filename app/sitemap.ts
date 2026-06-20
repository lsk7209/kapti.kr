import type { MetadataRoute } from "next";
import { posts } from "@/lib/posts";
import { sampleApartment } from "@/lib/sample-data";
import { guidePages, learnPages, regionDetail } from "@/lib/seo-pages";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/feed.xml"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/region"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: absoluteUrl("/guide"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.78,
    },
    {
      url: absoluteUrl("/learn"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.72,
    },
    {
      url: absoluteUrl("/search"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.35,
    },
    {
      url: absoluteUrl(`/region/${regionDetail.slug.join("/")}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.78,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.45,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.45,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.45,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.45,
    },
    {
      url: absoluteUrl(`/apt/${sampleApartment.region.path}/${sampleApartment.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(post.canonicalPath),
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guidePages.map((page) => ({
    url: absoluteUrl(`/guide/${page.slug}`),
    lastModified: new Date(page.updatedAt),
    changeFrequency: "monthly",
    priority: 0.82,
  }));

  const learnRoutes: MetadataRoute.Sitemap = learnPages.map((page) => ({
    url: absoluteUrl(`/learn/${page.slug}`),
    lastModified: new Date(page.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...guideRoutes, ...learnRoutes, ...postRoutes];
}
