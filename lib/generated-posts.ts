import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import type { BlogPost, BlogSection } from "./posts";

type GeneratedArticle = {
  title: string;
  subtitle?: string;
  slug: string;
  category: string;
  mainKeyword: string;
  expandedKeywords: string[];
  scheduledAt: string;
  score: number;
  seoDescription: string;
  status: string;
  bodyKoreanChars: number;
  draftPath: string;
};

type GeneratedManifest = {
  sources?: Array<{
    name: string;
    url?: string;
  }>;
  articles?: GeneratedArticle[];
};

const defaultPackages = ["kapti-20260619-new100", "kapti-20260619-extra100"];
const outputRoot = join(/* turbopackIgnore: true */ process.cwd(), "output");
const generatedContentPackages = (process.env.GENERATED_CONTENT_PACKAGES || process.env.GENERATED_CONTENT_PACKAGE || defaultPackages.join(","))
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean);

const malformedParticles = [
  "관리비을",
  "관리비이",
  "단지을",
  "신뢰이",
  "방법과 관리사무소에를",
  "가능성과 줄일을",
  "순위보다를",
  "비교과",
  "기준월의?",
];

function readManifests(): Array<{ manifest: GeneratedManifest; root: string }> {
  return generatedContentPackages
    .map((packageName) => {
      const root = join(outputRoot, packageName);
      const manifestPath = join(root, "manifest.json");
      if (!existsSync(manifestPath)) return null;
      return { manifest: JSON.parse(readFileSync(manifestPath, "utf8")) as GeneratedManifest, root };
    })
    .filter((entry): entry is { manifest: GeneratedManifest; root: string } => Boolean(entry));
}

function draftFilePath(root: string, article: GeneratedArticle) {
  const filename = basename(article.draftPath.replaceAll("\\", "/"));
  if (!filename) return null;
  return join(root, "drafts", filename);
}

function stripFrontmatter(markdown: string) {
  return markdown.replace(/^---[\s\S]*?---\s*/, "");
}

function stripInlineAnchor(value: string) {
  return value.replace(/\s*\{#[^}]+\}\s*$/, "").trim();
}

function sectionId(title: string, index: number) {
  const anchor = title.match(/\{#([^}]+)\}/)?.[1];
  if (anchor) return anchor;
  return `section-${index + 1}`;
}

function parseSections(markdown: string): BlogSection[] {
  const body = stripFrontmatter(markdown).replace(/^# .*(\r?\n)+/, "");
  const blocks = body.split(/\r?\n(?=## )/).filter((block) => block.trim().startsWith("## "));

  return blocks
    .map((block, index) => {
      const lines = block.split(/\r?\n/);
      const rawTitle = lines.shift()?.replace(/^##\s*/, "").trim() || `본문 ${index + 1}`;
      const title = stripInlineAnchor(rawTitle);
      const paragraphs: string[] = [];
      const points: string[] = [];
      let tableBuffer: string[] = [];

      const flushTable = () => {
        if (tableBuffer.length === 0) return;
        paragraphs.push(tableBuffer.join("\n"));
        tableBuffer = [];
      };

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
          flushTable();
          continue;
        }
        if (trimmed.startsWith("|")) {
          tableBuffer.push(trimmed);
          continue;
        }
        flushTable();
        if (trimmed.startsWith("- ")) {
          points.push(trimmed.replace(/^-\s*/, ""));
        } else if (!trimmed.startsWith("> ")) {
          paragraphs.push(trimmed);
        }
      }
      flushTable();

      return {
        id: sectionId(rawTitle, index),
        title,
        body: paragraphs.slice(0, 5),
        points: points.length ? points.slice(0, 8) : undefined,
      };
    })
    .filter((section) => section.title !== "목차" && section.body.length > 0)
    .slice(0, 8);
}

function hasQualityRisk(article: GeneratedArticle, markdown: string) {
  if (article.status !== "done") return true;
  if (article.score < 90 || article.bodyKoreanChars < 3500) return true;
  const inspect = `${article.title}\n${article.subtitle || ""}\n${article.seoDescription}\n${markdown.slice(0, 5000)}`;
  return malformedParticles.some((pattern) => inspect.includes(pattern));
}

export function getGeneratedPosts(now = new Date()): BlogPost[] {
  const manifests = readManifests();
  const mapped: Array<BlogPost | null> = [];

  for (const { manifest, root } of manifests) {
    const sources = [
      ...new Set(
        (manifest.sources || [])
          .map((source) => (source.url ? `${source.name} (${source.url})` : source.name))
          .filter(Boolean),
      ),
    ];

    for (const article of manifest.articles || []) {
      if (new Date(article.scheduledAt) > now) continue;
      const draftPath = draftFilePath(root, article);
      if (!draftPath || !existsSync(draftPath)) continue;
      const markdown = readFileSync(draftPath, "utf8");
      if (hasQualityRisk(article, markdown)) continue;

      const scheduledDate = article.scheduledAt.slice(0, 10);
      mapped.push({
        title: article.title,
        slug: article.slug,
        excerpt: article.seoDescription,
        category: article.category,
        publishedAt: scheduledDate,
        updatedAt: scheduledDate,
        author: "케이아파티 데이터 편집팀",
        reviewer: "케이아파티 페르소나·공공데이터 품질 게이트",
        readingMinutes: Math.max(6, Math.ceil(article.bodyKoreanChars / 700)),
        canonicalPath: `/blog/${article.slug}`,
        keywords: [article.mainKeyword, ...article.expandedKeywords],
        sources,
        scheduledAt: article.scheduledAt,
        sections: parseSections(markdown),
      } satisfies BlogPost);
    }
  }

  return mapped.filter((post): post is BlogPost => Boolean(post));
}

export function getGeneratedPostAudit() {
  const manifests = readManifests();
  const now = new Date();
  let total = 0;
  let publishableNow = 0;
  let reviewNeeded = 0;

  for (const { manifest, root } of manifests) {
    for (const article of manifest.articles || []) {
      total += 1;
      const draftPath = draftFilePath(root, article);
      const markdown = draftPath && existsSync(draftPath) ? readFileSync(draftPath, "utf8") : "";
      const risky = hasQualityRisk(article, markdown);
      if (risky) reviewNeeded += 1;
      if (new Date(article.scheduledAt) <= now && !risky) publishableNow += 1;
    }
  }

  return { total, publishableNow, reviewNeeded };
}
