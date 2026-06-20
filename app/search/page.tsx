import type { Metadata } from "next";
import Link from "next/link";
import { DataQualityBlock, Footer, Header, SearchBox } from "@/components/layout";
import { searchItems } from "@/lib/seo-pages";

type PageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export const metadata: Metadata = {
  title: "검색",
  description: "케이아파티의 단지, 지역, 관리비 가이드 문서를 검색합니다.",
  alternates: {
    canonical: "/search",
  },
};

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const normalized = query.toLowerCase();
  const results = normalized
    ? searchItems.filter((item) =>
        [item.title, item.description, ...item.keywords].join(" ").toLowerCase().includes(normalized)
      )
    : searchItems;

  return (
    <div className="app">
      <Header />
      <main className="seo-wrap">
        <section className="seo-hero">
          <span className="badge badge--info">검색</span>
          <h1>{query ? `"${query}" 검색 결과` : "단지명 또는 지역을 검색하세요"}</h1>
          <p>
            단지 상세, 지역 허브, 관리비 가이드 문서를 한 번에 찾습니다. 검색 결과의
            수치는 정보 제공용이며 기준월과 출처를 함께 확인해야 합니다.
          </p>
          <SearchBox compact />
        </section>

        <section className="search-results" aria-label="검색 결과">
          {results.length > 0 ? (
            results.map((item) => (
              <Link className="search-result-card" href={item.href} key={`${item.type}-${item.title}`}>
                <span className="badge badge--neutral">{item.type}</span>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </Link>
            ))
          ) : (
            <div className="empty">
              <div className="empty-t">검색 결과가 없습니다</div>
              <div className="empty-d">다른 단지명, 지역명, 관리비 항목으로 다시 검색해 보세요.</div>
            </div>
          )}
        </section>

        <DataQualityBlock variant="search" />
      </main>
      <Footer />
    </div>
  );
}
