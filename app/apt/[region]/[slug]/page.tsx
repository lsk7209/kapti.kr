import type { Metadata } from "next";
import Link from "next/link";
import { sampleApartment, formatNumber } from "@/lib/sample-data";
import type { DataState, PositionViz } from "@/lib/types";
import { Header, Footer, Section } from "@/components/layout";
import {
  AdSlot,
  EmptyState,
  FAQ,
  ItemBars,
  NeighborCard,
  PositionBar,
  PositionGauge,
  SourceCap,
  TrendChart,
} from "@/components/data-ui";

type PageProps = {
  params: Promise<{
    region: string;
    slug: string;
  }>;
  searchParams: Promise<{
    state?: string;
    viz?: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, slug } = await params;
  const title =
    slug === sampleApartment.slug
      ? `${sampleApartment.name} 관리비 비교·진단`
      : "단지 관리비 비교·진단";
  const canonical = `/apt/${region}/${slug}`;
  const description = `${sampleApartment.baseMonth} 기준 ㎡당 공용관리비, 또래 중앙값, 항목별 비교, 출처를 함께 확인합니다.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
    },
  };
}

function parseState(value?: string): DataState {
  if (value === "fallback" || value === "empty") return value;
  return "normal";
}

function parseViz(value?: string): PositionViz {
  return value === "gauge" ? "gauge" : "bar";
}

const faqItems = [
  {
    q: "이 단지 관리비가 또래보다 높다는 건 무슨 뜻인가요?",
    a: "같은 시군구·난방방식·세대 규모로 묶은 비교군의 중앙값과 비교했을 때 ㎡당 단가가 더 높다는 사실 진술입니다. 관리 품질이나 적정성에 대한 평가가 아니며, 단지별 시설·서비스 수준에 따라 달라질 수 있습니다.",
  },
  {
    q: "비교군(또래)은 어떻게 정해지나요?",
    a: `현재 비교군은 '${sampleApartment.peerGroup.sigungu} · ${sampleApartment.peerGroup.heating} · ${sampleApartment.peerGroup.size}' 조건의 ${sampleApartment.peerGroup.count}곳입니다. 같은 조건 단지가 적으면 상위 지역으로 단계적으로 확장하며, 그 경우 화면 상단에 안내합니다.`,
  },
  {
    q: "㎡당 공용관리비는 어떻게 계산하나요?",
    a: "월별 공용관리비 총액을 단지 전체 전용면적 합으로 나눈 값입니다. 세대 면적 차이를 보정해 단지 간 비교가 가능하도록 정규화합니다. 개별 사용료(전기·수도·난방 등)는 제외한 공용 부분 기준입니다.",
  },
  {
    q: "관리비가 또래보다 높으면 관리가 부실한 건가요?",
    a: "그렇게 단정할 수 없습니다. 경비 인력 운영 방식, 시설 노후도, 부대시설 규모 등 여러 요인이 단가에 영향을 줍니다. 본문의 항목별 분해에서 어떤 항목이 차이를 만드는지 사실 위주로 확인해 보세요.",
  },
];

export default async function ApartmentDetailPage({ params, searchParams }: PageProps) {
  const [{ region, slug }, query] = await Promise.all([params, searchParams]);
  const state = parseState(query.state);
  const viz = parseViz(query.viz);
  const data = sampleApartment;
  const fallback = state === "fallback";
  const empty = state === "empty";
  const percentile = fallback ? 74 : data.percentile;
  const rank = fallback ? 11 : data.peerRank;
  const count = fallback ? data.peerGroup.fallbackCount : data.peerCount;
  const above = data.diffPct >= 0;

  return (
    <div className="app">
      <Header />
      <div className="leaderboard">
        <AdSlot height={90} note="헤더 하단 리더보드 · 고정 높이 예약(CLS 방지)" />
      </div>

      <main className="wrap">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">›</span>
          <Link href="/">{data.region.sido}</Link>
          <span className="sep">›</span>
          <Link href="/">{data.region.sigungu}</Link>
          <span className="sep">›</span>
          <span className="cur">{data.name}</span>
        </nav>

        <div className="titleblock">
          <h1>{data.name}</h1>
          <div className="addr">{data.addr}</div>
          <div className="meta-chips">
            <span className="chip">{formatNumber(data.meta.households)}세대</span>
            <span className="chip">{data.meta.heating}</span>
            <span className="chip">{data.meta.builtYear}년 준공</span>
            <span className="chip chip--outline">{data.meta.buildings}개 동</span>
            <span className="chip chip--outline">{data.meta.area}</span>
            <span className="chip chip--outline">kaptCode {data.kaptCode}</span>
          </div>
        </div>

        {empty ? (
          <EmptyState />
        ) : (
          <>
            <Section>
              {fallback ? (
                <div className="fallback">
                  <div className="fallback-ic" aria-hidden="true">
                    ℹ
                  </div>
                  <div>
                    <div className="fallback-t">같은 조건 단지가 적어 상위 지역 기준으로 비교했어요</div>
                    <div className="cap" style={{ marginTop: 3 }}>
                      {data.region.sigungu}(8곳) → {data.region.sido} 전체({data.peerGroup.fallbackCount}곳)로 비교군을 확장 · 기준 {data.baseMonth}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="diag">
                <div className="diag-lead">
                  이 단지의 ㎡당 공용관리비는 같은 비교군 중앙값 대비 <b>{above ? "높은" : "낮은"} 편</b>입니다. 아래는 수치와 출처입니다.
                </div>

                {viz === "gauge" ? (
                  <PositionGauge percentile={percentile} rank={rank} count={count} />
                ) : (
                  <PositionBar percentile={percentile} rank={rank} count={count} />
                )}

                <div className="diag-divider" />

                <div className="cap" style={{ marginBottom: 4 }}>
                  ㎡당 공용관리비
                </div>
                <div className="diag-num">
                  <div className="big tnum">
                    {formatNumber(data.perM2)}
                    <small>원/㎡</small>
                  </div>
                  <span className={`diff-pill ${above ? "diff-pill--above" : "diff-pill--below"}`}>
                    {above ? "▲" : "▼"} {Math.abs(data.diffPct)}%
                  </span>
                </div>
                <div className="cap">
                  또래 중앙값 <b className="tnum">{formatNumber(data.peerMedian)}원/㎡</b> 대비 {above ? "+" : "-"}
                  {Math.abs(data.diffPct)}%
                </div>

                <div className="peergroup">
                  <div className="peergroup-label">▣ 비교군 ({fallback ? `${data.region.sido} 전체 · ${count}곳` : `${data.peerGroup.count}곳`})</div>
                  <div className="peergroup-chips">
                    <span className="chip chip--primary">{fallback ? "같은 시도" : "같은 시군구"}</span>
                    <span className="chip chip--primary">{data.peerGroup.heating}</span>
                    <span className="chip chip--primary">{data.peerGroup.size}</span>
                    <span className="chip chip--outline">{count}곳 비교</span>
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <SourceCap />
                </div>
              </div>
            </Section>

            <Section>
              <AdSlot height={100} note="진단 결과 카드 직후" />
            </Section>

            <Section title="항목별 관리비 비교" note="또래 평균 대비">
              <div className="card" style={{ padding: 20 }}>
                <ItemBars items={data.items} />
              </div>
            </Section>

            <Section>
              <AdSlot height={100} note="항목 분해 직후" />
            </Section>

            <Section title="최근 12개월 추이" note="㎡당 공용관리비">
              <div className="card" style={{ padding: 18 }}>
                <TrendChart data={data.trend} months={data.trendMonths} />
              </div>
            </Section>

            <Section title="이 단지 특성" note="데이터에 따라 표시">
              <div className="infoblock">
                <div className="ib-ic ib-ic--gray" aria-hidden="true">
                  ▦
                </div>
                <div>
                  <div className="infoblock-t">
                    대단지 <span className="badge badge--neutral" style={{ marginLeft: 6 }}>1,000세대+</span>
                  </div>
                  <div className="infoblock-d">
                    <b>{formatNumber(data.meta.households)}세대</b> 규모로, 세대당 고정비가 분산되는 편입니다. 동일 규모대 단지끼리 비교했습니다.
                  </div>
                </div>
              </div>
              <div className="infoblock">
                <div className="ib-ic ib-ic--blue" aria-hidden="true">
                  ♨
                </div>
                <div>
                  <div className="infoblock-t">지역난방 단지</div>
                  <div className="infoblock-d">
                    난방방식이 다른 단지와는 난방·급탕 항목의 비교 해석에 주의가 필요해, 비교군을 <b>지역난방</b>으로 한정했습니다.
                  </div>
                </div>
              </div>
              <div className="infoblock">
                <div className="ib-ic ib-ic--amber" aria-hidden="true">
                  ⚒
                </div>
                <div>
                  <div className="infoblock-t">준공 {data.meta.builtYear}년 · 경과 {2026 - data.meta.builtYear}년</div>
                  <div className="infoblock-d">
                    설비 교체 주기가 도래하는 시기로, 수선유지비가 또래 평균보다 <b>높게 나타날 수 있는</b> 구간입니다. 사실 진술이며 적정성 판단은 아닙니다.
                  </div>
                </div>
              </div>
              <div className="infoblock">
                <div className="ib-ic ib-ic--blue" aria-hidden="true">
                  ↗
                </div>
                <div>
                  <div className="infoblock-t">최근 변동 알림</div>
                  <div className="infoblock-d">
                    최근 3개월 ㎡당 공용관리비가 <b className="tnum">1,712 → 1,820원</b>으로 변동했습니다. 기준 {data.baseMonth} · 출처 K-apt
                  </div>
                </div>
              </div>
            </Section>

            <Section title="장기수선충당금 적립 현황" note="사실 진술">
              <div className="card" style={{ padding: 20 }}>
                <div className="infoblock-d" style={{ fontSize: "var(--fs-sm)", color: "var(--ink-700)" }}>
                  최근 12개월 ㎡당 적립액은 또래 평균과 비교해 다음과 같습니다. 적립액의 적정 수준은 단지 장기수선계획에 따라 다르므로, 수치는 참고용입니다.
                </div>
                <div className="reserve-row">
                  <div className="reserve-stat">
                    <div className="rs-l">이 단지 ㎡당 적립</div>
                    <div className="rs-v tnum">
                      {formatNumber(data.reserve.perM2)}
                      <small> 원/㎡</small>
                    </div>
                  </div>
                  <div className="reserve-stat">
                    <div className="rs-l">또래 평균 ㎡당</div>
                    <div className="rs-v tnum" style={{ color: "var(--ink-500)" }}>
                      {formatNumber(data.reserve.peerPerM2)}
                      <small> 원/㎡</small>
                    </div>
                  </div>
                  <div className="reserve-stat">
                    <div className="rs-l">적립금 잔액</div>
                    <div className="rs-v tnum">{data.reserve.balance}</div>
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <SourceCap>{data.reserve.note}</SourceCap>
                </div>
              </div>
            </Section>
          </>
        )}

        <Section title="자주 묻는 질문">
          <div className="card" style={{ padding: "4px 18px" }}>
            <FAQ items={faqItems} />
          </div>
        </Section>

        <Section title={`${data.region.sigungu}의 다른 단지`} note="관리비 비교">
          {data.neighbors.map((neighbor) => (
            <NeighborCard key={neighbor.name} {...neighbor} />
          ))}
        </Section>

        <Section title="관련 가이드">
          {data.guides.map((guide) => (
            <Link className="guidecard" key={guide.slug} href={guide.slug}>
              <span className="badge badge--info">{guide.tag}</span>
              <span className="guidecard-t">{guide.title}</span>
              <span className="ilink-arr" style={{ marginLeft: "auto" }}>→</span>
            </Link>
          ))}
        </Section>

        <div className="cap" style={{ marginTop: 18 }}>
          현재 경로: /apt/{region}/{slug} · 샘플 데이터 기반 UI
        </div>
      </main>

      <Footer />

      {!empty ? (
        <div className="anchor-ad">
          <div className="adslot">
            <span>광고</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
