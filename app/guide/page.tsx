import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, Section } from "@/components/layout";
import { guidePages } from "@/lib/seo-pages";

export const metadata: Metadata = {
  title: "관리비 가이드",
  description: "공동주택 관리비를 기준월, 출처, 비교군과 함께 읽는 필러 가이드 모음입니다.",
  alternates: {
    canonical: "/guide",
  },
};

export default function GuideIndexPage() {
  return (
    <div className="app">
      <Header active="guide" />
      <main className="seo-wrap">
        <section className="seo-hero">
          <span className="badge badge--info">필러 가이드</span>
          <h1>관리비 비교 전에 읽어야 할 핵심 가이드</h1>
          <p>
            총액, 항목, 난방방식, 비교군을 단정 없이 읽는 방법을 정리했습니다.
            각 문서는 기준월과 출처를 함께 확인하는 흐름을 기준으로 구성됩니다.
          </p>
        </section>

        <Section title="가이드 목록" note={`${guidePages.length}개`}>
          <div className="content-card-grid">
            {guidePages.map((page) => (
              <Link className="content-card" href={`/guide/${page.slug}`} key={page.slug}>
                <span className="badge badge--info">{page.category}</span>
                <strong>{page.title}</strong>
                <span>{page.subtitle}</span>
                <small>수정일 {page.updatedAt}</small>
              </Link>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
