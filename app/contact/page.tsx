import type { Metadata } from "next";
import { Footer, Header, Section } from "@/components/layout";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "문의 및 정정 요청",
  description: "케이아파티의 관리비 데이터 정정, 개인정보, 광고, 운영 문의 접수 기준을 안내합니다.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "케이아파티 문의 및 정정 요청",
    url: absoluteUrl("/contact"),
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
          <span className="badge badge--info">Contact</span>
          <h1>문의 및 정정 요청</h1>
          <p>
            관리비 데이터 오류, 출처 변경, 개인정보, 광고, 운영 관련 문의는 아래 기준에
            맞춰 접수해 주세요.
          </p>
        </section>

        <Section title="연락처">
          <div className="method-card">
            <b>이메일</b>
            <span>contact@kapti.kr</span>
          </div>
        </Section>

        <Section title="정정 요청에 포함할 내용">
          <div className="method-card">
            <b>검토에 필요한 정보</b>
            <span>
              페이지 주소, 문제가 되는 문장이나 수치, 확인 가능한 공공 데이터 출처,
              변경된 기준일을 함께 보내 주세요. 주민등록번호, 계좌번호, 민감한 개인
              정보는 보내지 마세요.
            </span>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
