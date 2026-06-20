import type { Metadata } from "next";
import { Footer, Header, Section } from "@/components/layout";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "이용약관",
  description: "케이아파티의 정보 제공 범위, 공공 데이터 한계, 광고와 외부 링크, 정정 기준을 안내합니다.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "케이아파티 이용약관",
    url: absoluteUrl("/terms"),
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
  };

  return (
    <div className="app">
      <Header />
      <JsonLd data={jsonLd} />
      <main className="seo-wrap">
        <section className="seo-hero">
          <span className="badge badge--info">Terms</span>
          <h1>이용약관</h1>
          <p>
            케이아파티는 공동주택 관리비와 공공 데이터를 이해하기 쉽게 정리하는 참고용
            정보 사이트입니다.
          </p>
        </section>

        <Section title="정보 제공 범위">
          <div className="method-card">
            <b>최종 판단 전 확인 필요</b>
            <span>
              사이트의 비교, 순위, 설명은 일반 정보이며 법률, 회계, 부동산, 투자,
              관리업무 자문이 아닙니다. 실제 의사결정 전에는 관리주체, 입주자대표회의,
              공공기관 원문, 전문가 안내를 함께 확인해야 합니다.
            </span>
          </div>
        </Section>

        <Section title="데이터와 광고">
          <div className="method-card">
            <b>출처와 독립성</b>
            <span>
              공공 데이터는 갱신 시점, 누락, 정정에 따라 실제 고지서와 차이가 있을 수
              있습니다. 광고가 표시되더라도 광고는 편집 판단이나 데이터 설명을 통제하지
              않습니다.
            </span>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
