import type { Metadata } from "next";
import Link from "next/link";
import { DataQualityBlock, Footer, Header, Section } from "@/components/layout";
import { learnPages } from "@/lib/seo-pages";

export const metadata: Metadata = {
  title: "전문 가이드",
  description: "장기수선충당금과 공동주택 관리 제도를 공개 데이터 맥락에서 설명합니다.",
  alternates: {
    canonical: "/learn",
  },
};

export default function LearnIndexPage() {
  return (
    <div className="app">
      <Header active="learn" />
      <main className="seo-wrap">
        <section className="seo-hero">
          <span className="badge badge--neutral">에버그린</span>
          <h1>공동주택 관리비 제도를 차분하게 확인합니다</h1>
          <p>
            장기수선충당금처럼 단정하기 쉬운 제도형 주제를 공개 자료의 범위와 한계를
            나누어 설명합니다. 법률 자문이나 투자 판단으로 사용하지 않습니다.
          </p>
        </section>

        <Section title="전문 문서" note={`${learnPages.length}개`}>
          <div className="content-card-grid">
            {learnPages.map((page) => (
              <Link className="content-card" href={`/learn/${page.slug}`} key={page.slug}>
                <span className="badge badge--neutral">전문 가이드</span>
                <strong>{page.title}</strong>
                <span>{page.subtitle}</span>
                <small>수정일 {page.updatedAt}</small>
              </Link>
            ))}
          </div>
        </Section>

        <DataQualityBlock variant="learn" />
      </main>
      <Footer />
    </div>
  );
}
