import { posts } from "@/lib/posts";
import { guidePages, learnPages, regionDetail } from "@/lib/seo-pages";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function GET() {
  const lines = [
    `# ${siteConfig.name}`,
    "",
    siteConfig.description,
    "",
    "## Core pages",
    `- Home: ${absoluteUrl("/")}`,
    `- Search: ${absoluteUrl("/search")}`,
    `- Region index: ${absoluteUrl("/region")}`,
    `- Region sample: ${absoluteUrl(`/region/${regionDetail.slug.join("/")}`)}`,
    `- Guide index: ${absoluteUrl("/guide")}`,
    `- Learn index: ${absoluteUrl("/learn")}`,
    `- Blog: ${absoluteUrl("/blog")}`,
    `- RSS feed: ${absoluteUrl("/feed.xml")}`,
    `- About and methodology: ${absoluteUrl("/about")}`,
    `- Design system: ${absoluteUrl("/design-system")}`,
    "",
    "## Pillar guides",
    ...guidePages.map((page) => `- ${page.title}: ${absoluteUrl(`/guide/${page.slug}`)}`),
    "",
    "## Evergreen references",
    ...learnPages.map((page) => `- ${page.title}: ${absoluteUrl(`/learn/${page.slug}`)}`),
    "",
    "## Guides",
    ...posts.map((post) => `- ${post.title}: ${absoluteUrl(post.canonicalPath)}`),
    "",
    "## Content policy",
    "- Use public-data context carefully.",
    "- Do not treat 케이아파티 pages as purchase, legal, or financial advice.",
    "- Preserve 기준월, 출처, and comparison-group context when summarizing.",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
