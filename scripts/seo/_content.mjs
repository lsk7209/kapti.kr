import { existsSync, readFileSync } from "node:fs";
import { getSiteUrl } from "./_env.mjs";

const manifestPath = "output/kapt/manifest.json";
const malformedParticles = [
  "비교과",
  "관리비을",
  "기준월와",
  "전용면적를",
  "극단값로",
  "일반관리비을",
  "공용시설를",
  "관리방식를",
  "난방방식를",
  "항목 분해을",
  "비교군 좁히기을",
  "문의 질문 정리을",
];

export function readPostPaths() {
  const source = readFileSync("lib/posts.ts", "utf8");
  const matches = [...source.matchAll(/canonicalPath:\s*"([^"]+)"/g)].map((match) => match[1]);
  return [...new Set(matches)].sort();
}

function generatedPostPaths() {
  if (!existsSync(manifestPath)) return [];
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const now = new Date();
  return (manifest.articles || [])
    .filter((article) => {
      if (article.status !== "done") return false;
      if (article.score < 90 || article.bodyKoreanChars < 3500) return false;
      if (new Date(article.scheduledAt) > now) return false;
      const draft = existsSync(article.draftPath) ? readFileSync(article.draftPath, "utf8") : "";
      const inspect = `${article.title}\n${article.subtitle || ""}\n${article.seoDescription}\n${draft.slice(0, 5000)}`;
      return !malformedParticles.some((pattern) => inspect.includes(pattern));
    })
    .map((article) => `/blog/${article.slug}`);
}

export function absolutePath(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

export function currentContentUrls() {
  const paths = [...new Set(["/blog", "/feed.xml", ...readPostPaths(), ...generatedPostPaths()])].sort();
  return paths.map(absolutePath);
}
