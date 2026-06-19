import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, Section } from "@/components/layout";
import { JsonLd } from "@/components/json-ld";
import { regionOverview } from "@/lib/seo-pages";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "지역별 관리비 비교",
  description: regionOverview.description,
  alternates: {
    canonical: "/region",
  },
  openGraph: {
    title: `지역별 공동주택 관리비 · ${siteConfig.name}`,
    description: regionOverview.description,
    url: "/region",
    type: "website",
  },
};

export default function RegionIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: regionOverview.title,
    url: absoluteUrl("/region"),
    description: regionOverview.description,
  };

  return (
    <div className="app">
      <Header active="region" />
      <JsonLd data={jsonLd} />
      <main className="seo-wrap">
        <section className="seo-hero">
          <span className="badge badge--info">지역 허브</span>
          <h1>지역별 공동주택 관리비를 같은 기준으로 봅니다</h1>
          <p>
            시도별 단지 수, ㎡당 중앙값, 난방방식 맥락을 함께 확인하세요. 모든 수치는
            기준월과 출처를 함께 표시하는 정보 제공용 자료입니다.
          </p>
          <div className="source-strip">
            <span>기준월: {regionOverview.baseMonth}</span>
            <span>출처: {regionOverview.source}</span>
            <span>단위: ㎡당 공용관리비</span>
          </div>
        </section>

        <div className="adslot" style={{ height: 90 }}>
          <span>광고</span>
        </div>

        <Section title="시도별 빠른 진입" note="샘플 데이터">
          <div className="region-card-grid">
            {regionOverview.regions.map((region) => (
              <Link
                className="region-card"
                href={
                  region.slug === "gyeonggi"
                    ? "/region/gyeonggi/suwon-yeongtong"
                    : "/region/gyeonggi/suwon-yeongtong"
                }
                key={region.slug}
              >
                <span className="region-name">{region.name}</span>
                <span className="region-count tnum">{region.count.toLocaleString("ko-KR")}곳</span>
                <span className="region-meta">{region.heating}</span>
                <span className="region-median tnum">중앙값 {region.median.toLocaleString("ko-KR")}원/㎡</span>
              </Link>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
