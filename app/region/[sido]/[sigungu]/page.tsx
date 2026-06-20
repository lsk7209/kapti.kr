import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DataQualityBlock, Footer, Header, Section } from "@/components/layout";
import { JsonLd } from "@/components/json-ld";
import { regionDetail } from "@/lib/seo-pages";
import { absoluteUrl, siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{
    sido: string;
    sigungu: string;
  }>;
};

export function generateStaticParams() {
  return [{ sido: regionDetail.slug[0], sigungu: regionDetail.slug[1] }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  if (resolved.sido !== regionDetail.slug[0] || resolved.sigungu !== regionDetail.slug[1]) {
    return {};
  }

  const canonical = `/region/${regionDetail.slug.join("/")}`;
  return {
    title: regionDetail.title,
    description: regionDetail.description,
    alternates: { canonical },
    openGraph: {
      title: `${regionDetail.title} · ${siteConfig.name}`,
      description: regionDetail.description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function RegionDetailPage({ params }: PageProps) {
  const resolved = await params;
  if (resolved.sido !== regionDetail.slug[0] || resolved.sigungu !== regionDetail.slug[1]) {
    notFound();
  }

  const canonicalPath = `/region/${regionDetail.slug.join("/")}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: regionDetail.title,
    url: absoluteUrl(canonicalPath),
    description: regionDetail.description,
  };

  return (
    <div className="app">
      <Header active="region" />
      <JsonLd data={jsonLd} />
      <main className="seo-wrap">
        <nav className="crumb" aria-label="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/region">지역별</Link>
          <span className="sep">/</span>
          <span className="cur">{regionDetail.sigungu}</span>
        </nav>

        <section className="seo-hero">
          <span className="badge badge--info">시군구 허브</span>
          <h1>{regionDetail.title}</h1>
          <p>
            {regionDetail.peerGroup}을 기준으로 ㎡당 공용관리비 분포와 단지별 수치를
            확인합니다. 순위는 판단이 아니라 비교 조건을 좁히기 위한 보조 정보입니다.
          </p>
          <div className="source-strip">
            <span>기준월: {regionDetail.baseMonth}</span>
            <span>출처: {regionDetail.source}</span>
            <span>{regionDetail.peerGroup}</span>
          </div>
        </section>

        <Section title="지역 분포" note="단정 없는 분포 요약">
          <div className="distribution-card">
            {regionDetail.distribution.map((item) => (
              <div className="dist-item" key={item.label}>
                <span>{item.label}</span>
                <b className="tnum">{item.value.toLocaleString("ko-KR")}원/㎡</b>
              </div>
            ))}
          </div>
        </Section>

        <div className="adslot" style={{ height: 90 }}>
          <span>광고</span>
        </div>

        <Section title="단지 리스트" note="세대수·난방방식·㎡당">
          <div className="apt-table">
            {regionDetail.apartments.map((apt) => {
              const diff = Math.round(((apt.perM2 - apt.peerMedian) / apt.peerMedian) * 100);
              return (
                <Link className="apt-row" href={apt.href} key={apt.name}>
                  <span className="apt-name">{apt.name}</span>
                  <span className="apt-meta">
                    {apt.households.toLocaleString("ko-KR")}세대 · {apt.heating} · {apt.builtYear}
                  </span>
                  <span className="apt-value tnum">{apt.perM2.toLocaleString("ko-KR")}원/㎡</span>
                  <span className={`badge ${diff >= 0 ? "badge--above" : "badge--below"}`}>
                    또래 대비 {diff >= 0 ? "+" : ""}
                    {diff}%
                  </span>
                </Link>
              );
            })}
          </div>
        </Section>

        <DataQualityBlock variant="region-detail" />
      </main>
      <Footer />
    </div>
  );
}
