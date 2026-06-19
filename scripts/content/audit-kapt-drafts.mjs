import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const manifestPath = "output/kapt/manifest.json";
const reportPath = "output/kapt/reports/publication-gate-report.md";

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
  "확인하는 법 {#",
];

function koreanChars(value) {
  return (value.match(/[가-힣]/g) || []).length;
}

function duplicateCount(values) {
  const seen = new Set();
  let duplicates = 0;
  for (const value of values) {
    if (seen.has(value)) duplicates += 1;
    seen.add(value);
  }
  return duplicates;
}

if (!existsSync(manifestPath)) {
  console.error(`Missing manifest: ${manifestPath}`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const rows = (manifest.articles || []).map((article) => {
  const draft = existsSync(article.draftPath) ? readFileSync(article.draftPath, "utf8") : "";
  const inspect = `${article.title}\n${article.subtitle || ""}\n${article.seoDescription || ""}\n${draft.slice(0, 6000)}`;
  const risks = [];

  if (article.status !== "done") risks.push("status_not_done");
  if (article.score < 90) risks.push("score_below_90");
  if (article.bodyKoreanChars < 3500 || koreanChars(draft) < 3500) risks.push("body_under_3500_korean_chars");
  for (const pattern of malformedParticles) {
    if (inspect.includes(pattern)) risks.push(`malformed_phrase:${pattern}`);
  }
  if ((draft.match(/숫자를 하나만 보지 않고 세 가지 층/g) || []).length >= 3) risks.push("repeated_body_frame");
  if ((draft.match(/비교군을 어떻게 만들었는가/g) || []).length >= 3) risks.push("repeated_body_frame");

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    scheduledAt: article.scheduledAt,
    status: risks.length ? "review_needed" : "publishable",
    risks,
  };
});

const publishable = rows.filter((row) => row.status === "publishable");
const reviewNeeded = rows.filter((row) => row.status === "review_needed");
const duplicateTitles = duplicateCount(rows.map((row) => row.title));
const duplicateSlugs = duplicateCount(rows.map((row) => row.slug));

const report = [
  "# K-apt 초안 공개 게이트 리포트",
  "",
  `- 전체 초안: ${rows.length}`,
  `- 공개 가능: ${publishable.length}`,
  `- 검수 필요: ${reviewNeeded.length}`,
  `- 중복 제목: ${duplicateTitles}`,
  `- 중복 slug: ${duplicateSlugs}`,
  `- 생성 시각: ${new Date().toISOString()}`,
  "",
  "## 검수 필요 상위 30개",
  "",
  ...reviewNeeded.slice(0, 30).map((row) => `- ${row.id} · ${row.title} · ${row.risks.join(", ")}`),
  "",
  "## 공개 가능 상위 30개",
  "",
  ...publishable.slice(0, 30).map((row) => `- ${row.id} · ${row.title} · ${row.scheduledAt}`),
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
      reportPath,
    },
    null,
    2,
  ),
);
