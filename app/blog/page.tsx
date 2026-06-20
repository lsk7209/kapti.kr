import type { Metadata } from "next";
import Link from "next/link";
import { DataQualityBlock, Header, Footer } from "@/components/layout";
import { posts } from "@/lib/posts";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "관리비 가이드",
  description:
    "공동주택 관리비 고지서, K-apt 비교, 장기수선충당금, 난방비, 공용관리비를 기준월과 비교군 중심으로 해석하는 케이아파티 가이드입니다.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "케이아파티 관리비 가이드",
    description: "기준월, 출처, 비교군을 함께 읽는 공동주택 관리비 가이드 모음입니다.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${siteConfig.name} 관리비 가이드`,
    description: metadata.description,
    url: absoluteUrl("/blog"),
    inLanguage: "ko-KR",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(post.canonicalPath),
        name: post.title,
      })),
    },
  };

  return (
    <div className="app">
      <Header />
      <JsonLd data={jsonLd} />
      <main className="blog-wrap">
        <section className="blog-hero">
          <span className="badge badge--info">케이아파티 콘텐츠</span>
          <h1>관리비를 수치와 맥락으로 읽는 가이드</h1>
          <p>
            단지별 관리비 비교에서 단정 표현을 줄이고, 기준월·출처·비교군을 함께 확인하는 방법을 정리합니다.
          </p>
        </section>

        <section className="blog-grid" aria-label="글 목록">
          {posts.map((post) => (
            <Link className="post-card" href={post.canonicalPath} key={post.slug}>
              <div className="post-card-media" aria-hidden="true">
                <span>{post.category.slice(0, 2)}</span>
              </div>
              <div className="post-card-body">
                <div className="post-card-meta">
                  <span>{post.category}</span>
                  <span>{post.updatedAt}</span>
                </div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <div className="post-card-foot">
                  <span>{post.author}</span>
                  <span>{post.readingMinutes}분 읽기</span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <DataQualityBlock variant="blog" />
      </main>
      <Footer />
    </div>
  );
}
