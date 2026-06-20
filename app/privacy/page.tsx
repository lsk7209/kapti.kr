import type { Metadata } from "next";
import { Footer, Header, Section } from "@/components/layout";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "케이아파티의 접속 기록, 분석 도구, 광고 쿠키, 문의 접수 정보 처리 기준을 안내합니다.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    name: "케이아파티 개인정보처리방침",
    url: absoluteUrl("/privacy"),
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
          <span className="badge badge--info">Privacy</span>
          <h1>개인정보처리방침</h1>
          <p>
            케이아파티는 공공 관리비 데이터를 이해하기 쉽게 정리하는 정보 제공
            사이트입니다. 문의 처리와 서비스 개선에 필요한 범위에서만 정보를 다룹니다.
          </p>
        </section>

        <Section title="처리할 수 있는 정보">
          <div className="method-card">
            <b>기술 정보와 문의 정보</b>
            <span>
              접속 로그, 브라우저 정보, 페이지 조회 기록, 대략적인 지역, 참조 URL 같은
              기술 정보가 보안, 통계, 오류 분석 목적으로 처리될 수 있습니다. 문의를 보낼
              경우 이메일 주소와 문의 내용이 답변과 정정 검토에 사용됩니다.
            </span>
          </div>
        </Section>

        <Section title="광고와 쿠키">
          <div className="method-card">
            <b>Google AdSense</b>
            <span>
              광고가 설정된 경우 Google을 포함한 광고 사업자는 쿠키나 유사 기술을
              사용해 광고 측정, 부정 사용 방지, 맞춤 또는 문맥 광고를 제공할 수
              있습니다. 사용자는 브라우저와 Google 광고 설정에서 관련 선택을 관리할 수
              있습니다.
            </span>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
