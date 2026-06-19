import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { AdSlot, SourceCap } from "@/components/data-ui";
import { getPost, getPostHeadings, posts } from "@/lib/posts";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: {
      canonical: post.canonicalPath,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: post.canonicalPath,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      siteName: siteConfig.name,
      locale: "ko_KR",
    },
  };
}

function MarkdownTable({ value }: { value: string }) {
  const rows = value
    .split(/\r?\n/)
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    )
    .filter((row) => row.length > 0);
  const [head, , ...body] = rows;

  if (!head?.length || body.length === 0) return <p>{value}</p>;

  return (
    <div className="article-table-wrap">
      <table className="article-table">
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell) => (
                <td key={cell}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ArticleParagraph({ value }: { value: string }) {
  if (value.trim().startsWith("|")) return <MarkdownTable value={value} />;
  return <p>{value}</p>;
}

const sourceUrlMap: Record<string, string> = {
  "data.go.kr": "https://www.data.go.kr/",
  "K-apt": "https://www.k-apt.go.kr/",
  "공동주택관리정보시스템": "https://www.k-apt.go.kr/",
  "국토교통부": "https://www.molit.go.kr/",
  "공동주택관리법": "https://www.law.go.kr/",
  "국가법령정보센터": "https://www.law.go.kr/",
  "한국소비자원": "https://www.kca.go.kr/",
};

function getSourceUrl(source: string) {
  const explicit = source.match(/\((https?:\/\/[^)]+)\)$/)?.[1];
  if (explicit) return explicit;
  const key = Object.keys(sourceUrlMap).find((candidate) => source.includes(candidate));
  return key ? sourceUrlMap[key] : undefined;
}

function cleanSourceLabel(source: string) {
  return source.replace(/\s*\(https?:\/\/[^)]+\)$/, "");
}

function SourceItem({ source }: { source: string }) {
  const url = getSourceUrl(source);
  return (
    <li>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {cleanSourceLabel(source)}
        </a>
      ) : (
        cleanSourceLabel(source)
      )}
    </li>
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const headings = getPostHeadings(post);
  const citationUrls = [...new Set(post.sources.map((source) => getSourceUrl(source)).filter(Boolean))];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: absoluteUrl(post.canonicalPath),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: "ko-KR",
    isAccessibleForFree: true,
    articleSection: post.category,
    keywords: post.keywords.join(", "),
    wordCount: Math.max(900, post.readingMinutes * 700),
    citation: citationUrls,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    reviewedBy: {
      "@type": "Organization",
      name: post.reviewer,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: absoluteUrl(post.canonicalPath),
    about: post.keywords.slice(0, 5).map((keyword) => ({
      "@type": "Thing",
      name: keyword,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "관리비 가이드", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: absoluteUrl(post.canonicalPath) },
    ],
  };

  return (
    <div className="app">
      <Header />
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />
      <main className="article-shell">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/blog">관리비 가이드</Link>
          <span className="sep">/</span>
          <span className="cur">{post.title}</span>
        </nav>

        <article className="article-layout">
          <aside className="toc" aria-label="글 목차">
            <div className="toc-title">목차</div>
            <ol>
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a href={`#${heading.id}`}>{heading.text}</a>
                </li>
              ))}
            </ol>
          </aside>

          <div className="article-main">
            <header className="article-head">
              <span className="badge badge--info">{post.category}</span>
              <h1>{post.title}</h1>
              <p>{post.excerpt}</p>
              <div className="article-meta">
                <span>{post.author}</span>
                <span>검토 기준: {post.reviewer}</span>
                <span>수정일 {post.updatedAt}</span>
                <span>{post.readingMinutes}분 읽기</span>
              </div>
            </header>

            <AdSlot height={90} note="본문 상단 광고 영역" />

            <div className="article-note">
              <b>읽기 전 확인</b>
              <span>
                이 글은 공개 관리비 자료를 해석하는 방법을 설명합니다. 특정 단지의 적정성, 거래 판단, 법률
                자문을 대신하지 않습니다.
              </span>
            </div>

            <nav className="article-cta" aria-label="관리비 비교 바로가기">
              <div>
                <b>관리비 수치를 직접 대조해 보세요</b>
                <span>글에서 확인한 기준은 단지 상세와 지역 비교 화면에서 이어서 확인할 수 있습니다.</span>
              </div>
              <div className="article-cta-links">
                <Link className="btn btn--primary" href="/apt/gyeonggi-suwon-yeongtong/hanbit-kapt-A000001">
                  샘플 단지 비교
                </Link>
                <Link className="btn btn--ghost" href="/region/gyeonggi/suwon-yeongtong">
                  지역 관리비 보기
                </Link>
              </div>
            </nav>

            {post.sections.map((section, index) => (
              <section className="article-section" id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <ArticleParagraph value={paragraph} key={paragraph} />
                ))}
                {section.points ? (
                  <ul className="article-checklist">
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}
                {index === 1 ? <AdSlot height={100} note="본문 중간 광고 영역" /> : null}
              </section>
            ))}

            <section className="article-section">
              <h2>출처와 업데이트 기준</h2>
              <p>
                아래 출처는 글의 방향과 용어 기준을 정리하기 위한 참고 자료입니다. 실제 단지별 수치는 서비스의
                기준월과 원천 데이터 갱신 상태에 따라 달라질 수 있습니다.
              </p>
              <ul className="source-list">
                {post.sources.map((source) => (
                  <SourceItem source={source} key={source} />
                ))}
              </ul>
              <SourceCap month={post.updatedAt.replaceAll("-", ".")} src={post.sources.join(" · ")} />
            </section>

            <nav className="related-posts" aria-label="관련 글">
              <h2>관련 글</h2>
              <div>
                {posts
                  .filter((item) => item.slug !== post.slug)
                  .slice(0, 2)
                  .map((item) => (
                    <Link className="guidecard" href={item.canonicalPath} key={item.slug}>
                      <span className="badge badge--neutral">{item.category}</span>
                      <span className="guidecard-t">{item.title}</span>
                      <span className="ilink-arr" style={{ marginLeft: "auto" }}>
                        →
                      </span>
                    </Link>
                  ))}
              </div>
            </nav>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
