import type { Metadata } from "next";
import { Footer, Header, Section } from "@/components/layout";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "데이터 방법론과 면책",
  description:
    "케이아파티의 공동주택 관리비 데이터 출처, 비교군 정의, 갱신주기, 정정 요청 기준을 설명합니다.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "케이아파티 데이터 방법론",
    description: "관리비 비교 화면의 출처, 기준월, 비교군, 공개 데이터 한계를 안내합니다.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `${siteConfig.name} 데이터 방법론`,
    url: absoluteUrl("/about"),
  };

  return (
    <div className="app">
      <Header active="about" />
      <JsonLd data={jsonLd} />
      <main className="seo-wrap">
        <section className="seo-hero">
          <span className="badge badge--info">방법론</span>
          <h1>케이아파티는 관리비를 평가하지 않고, 비교 기준을 보여줍니다</h1>
          <p>
            케이아파티는 공공데이터 기반 관리비 정보를 사용자가 직접 확인할 수 있도록
            기준월, 출처, 비교군, 정규화 단위를 함께 표시합니다.
          </p>
        </section>

        <Section title="데이터 출처">
          <div className="method-grid">
            <div className="method-card">
              <b>K-apt 공동주택관리정보시스템</b>
              <span>단지별 관리비 공개 정보와 기준월 확인에 사용합니다.</span>
            </div>
            <div className="method-card">
              <b>공공데이터포털</b>
              <span>단지 기본정보, 세대수, 난방방식, 지역 정보를 비교군 정의에 참고합니다.</span>
            </div>
          </div>
        </Section>

        <Section title="비교군 정의">
          <div className="method-card">
            <b>같은 조건을 우선합니다</b>
            <span>
              같은 시군구, 난방방식, 세대수 범위를 우선 적용합니다. 표본이 부족하면 상위
              지역으로 넓히고, 그 사실을 화면에 표시해야 합니다.
            </span>
          </div>
        </Section>

        <Section title="면책과 정정 요청">
          <div className="method-card">
            <b>정보 제공용입니다</b>
            <span>
              케이아파티의 화면은 매수, 임대, 법률, 투자 판단을 대신하지 않습니다. 공개
              데이터와 실제 고지서가 다를 수 있으므로 최종 확인은 관리주체 자료와 원문
              데이터를 함께 확인해야 합니다.
            </span>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
