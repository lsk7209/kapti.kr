import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "@/components/layout";
import { JsonLd } from "@/components/json-ld";
import { getGuide, guidePages } from "@/lib/seo-pages";
import { absoluteUrl, siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return guidePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getGuide(slug);
  if (!page) {
    return {};
  }

  const canonical = `/guide/${page.slug}`;
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

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const page = getGuide(slug);
  if (!page) {
    notFound();
  }

  const canonicalPath = `/guide/${page.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    dateModified: page.updatedAt,
    url: absoluteUrl(canonicalPath),
  };

  return (
    <div className="app">
      <Header active="guide" />
      <JsonLd data={jsonLd} />
      <main className="article-wrap">
        <nav className="crumb" aria-label="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/blog">가이드</Link>
          <span className="sep">/</span>
          <span className="cur">{page.title}</span>
        </nav>

        <article className="article-layout">
          <aside className="toc" aria-label="목차">
            <div className="toc-title">목차</div>
            <ol>
              {page.sections.map((section, index) => (
                <li key={section.title}>
                  <a href={`#section-${index + 1}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </aside>

          <div className="article-main">
            <header className="article-head">
              <span className="badge badge--info">{page.category}</span>
              <h1>{page.title}</h1>
              <p>{page.subtitle}</p>
              <div className="source-strip">
                <span>수정일: {page.updatedAt}</span>
                <span>출처: data.go.kr · K-apt</span>
                <span>정보 제공용</span>
              </div>
            </header>

            <div className="article-note">
              <b>읽기 기준</b>
              <span>
                이 글은 관리비를 평가하거나 매수·임대 결정을 권유하지 않습니다. 기준월,
                출처, 비교군 조건을 함께 확인하는 방법만 정리합니다.
              </span>
            </div>

            {page.sections.map((section, index) => (
              <section className="article-section" id={`section-${index + 1}`} key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
