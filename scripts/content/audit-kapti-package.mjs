import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const packageName = process.argv[2];
if (!packageName) {
  console.error("Usage: node scripts/content/audit-kapti-package.mjs <package-name>");
  process.exit(1);
}

const root = join("output", packageName);
const manifestPath = join(root, "manifest.json");
const reportPath = join(root, "reports", "publication-gate-report.md");
const malformed = [
  "관리비을",
  "관리비이",
  "단지을",
  "신뢰이",
  "비교과",
  "가능성과 줄일을",
  "관리사무소에를",
  "순위보다를",
  "기준월의?",
  "항목를",
  "방식를",
  "자료을",
];

function koreanChars(value) {
  return (value.match(/[가-힣]/g) || []).length;
}

function duplicateCount(values) {
  const seen = new Set();
  let count = 0;
  for (const value of values) {
    if (seen.has(value)) count += 1;
    seen.add(value);
  }
  return count;
}

function sourceUrlCount(draft) {
  return (draft.match(/https?:\/\//g) || []).length;
}

if (!existsSync(manifestPath)) {
  console.error(`Missing manifest: ${manifestPath}`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const rows = (manifest.articles || []).map((article) => {
  const risks = [];
  const draft = existsSync(article.draftPath) ? readFileSync(article.draftPath, "utf8") : "";
  const research = article.researchPath && existsSync(article.researchPath) ? JSON.parse(readFileSync(article.researchPath, "utf8")) : null;
  const inspect = `${article.title}\n${article.subtitle || ""}\n${article.seoDescription || ""}\n${draft}`;
  const expandedKeywords = article.expandedKeywords || [];

  if (article.status !== "done") risks.push("status_not_done");
  if (article.score < 90) risks.push("score_below_90");
  if (article.bodyKoreanChars < 3500 || koreanChars(draft) < 3500) risks.push("body_under_3500_korean_chars");
  if (!article.title?.includes(article.mainKeyword)) risks.push("title_missing_main_keyword");
  if (!article.subtitle?.includes(article.mainKeyword)) risks.push("subtitle_missing_main_keyword");
  if (!expandedKeywords.some((keyword) => article.title?.includes(keyword) || article.subtitle?.includes(keyword))) risks.push("title_or_subtitle_missing_expanded_keyword");
  if (!research?.factTraceabilityPass) risks.push("research_traceability_missing");
  if ((research?.sources || []).length < 5) risks.push("source_count_under_5");
  if ((research?.officialSourceCount || 0) < 3) risks.push("official_source_count_under_3");
  if ((draft.match(/\]\(\/blog\//g) || []).length < 3) risks.push("internal_links_under_3");
  if (sourceUrlCount(draft) < 5) risks.push("external_source_links_under_5");
  for (const pattern of malformed) {
    if (inspect.includes(pattern)) risks.push(`malformed_phrase:${pattern}`);
  }

  return { id: article.id, title: article.title, slug: article.slug, status: risks.length ? "review_needed" : "publishable", risks };
});

const duplicateTitles = duplicateCount(rows.map((row) => row.title));
const duplicateSlugs = duplicateCount(rows.map((row) => row.slug));
const duplicateKeywords = duplicateCount((manifest.articles || []).map((article) => article.mainKeyword));
const duplicateHeadingPatterns = duplicateCount((manifest.articles || []).map((article) => article.headingPattern).filter(Boolean));
const publishable = rows.filter((row) => row.status === "publishable");
const reviewNeeded = rows.filter((row) => row.status === "review_needed");
const report = [
  "# 케이아파티 신규 글 공개 게이트 리포트",
  "",
  `- 전체 초안: ${rows.length}`,
  `- 공개 가능: ${publishable.length}`,
  `- 검수 필요: ${reviewNeeded.length}`,
  `- 중복 제목: ${duplicateTitles}`,
  `- 중복 slug: ${duplicateSlugs}`,
  `- 중복 메인키워드: ${duplicateKeywords}`,
  `- 반복 H2 패턴 수: ${duplicateHeadingPatterns}`,
  `- 생성 시각: ${new Date().toISOString()}`,
  "",
  "## 검수 필요",
  "",
  ...reviewNeeded.slice(0, 80).map((row) => `- ${row.id} · ${row.title} · ${row.risks.join(", ")}`),
  "",
  "## 공개 가능 샘플",
  "",
  ...publishable.slice(0, 20).map((row) => `- ${row.id} · ${row.title}`),
  "",
].join("\n");

mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, report, "utf8");
console.log(
  JSON.stringify(
    {
      status: reviewNeeded.length ? "review_needed" : "all_publishable",
      total: rows.length,
      publishable: publishable.length,
      reviewNeeded: reviewNeeded.length,
      duplicateTitles,
      duplicateSlugs,
      duplicateKeywords,
      duplicateHeadingPatterns,
      reportPath,
    },
    null,
    2,
  ),
);
if (reviewNeeded.length || duplicateTitles || duplicateSlugs || duplicateKeywords) process.exit(1);
