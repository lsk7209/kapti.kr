import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "@/components/layout";
import { JsonLd } from "@/components/json-ld";
import { getLearn, learnPages } from "@/lib/seo-pages";
import { absoluteUrl, siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return learnPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getLearn(slug);
  if (!page) {
    return {};
  }

  const canonical = `/learn/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    openGraph: {
      title: `${page.title} · ${siteConfig.name}`,
      description: page.description,
      url: canonical,
      type: "article",
    },
  };
}

export default async function LearnPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getLearn(slug);
  if (!page) {
    notFound();
  }

  const canonicalPath = `/learn/${page.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: page.title,
    description: page.description,
    dateModified: page.updatedAt,
    url: absoluteUrl(canonicalPath),
  };

  return (
    <div className="app">
      <Header active="learn" />
      <JsonLd data={jsonLd} />
      <main className="article-wrap">
        <nav className="crumb" aria-label="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <span className="cur">전문 가이드</span>
        </nav>

        <article className="learn-shell">
          <header className="article-head">
            <span className="badge badge--neutral">에버그린</span>
            <h1>{page.title}</h1>
            <p>{page.subtitle}</p>
            <div className="source-strip">
              <span>수정일: {page.updatedAt}</span>
              <span>출처: K-apt · 공동주택관리법 관련 공개자료</span>
              <span>법률 자문 아님</span>
            </div>
          </header>

          <div className="method-card">
            <b>확인 원칙</b>
            <span>
              공개 데이터는 질문을 정리하는 출발점입니다. 실제 판단에는 관리주체 공지,
              고지서, 관리규약, 관계 법령 확인이 함께 필요할 수 있습니다.
            </span>
          </div>

          {page.sections.map((section, index) => (
            <section className="article-section" id={`section-${index + 1}`} key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </div>
  );
}
