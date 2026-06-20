import Link from "next/link";
import { DataQualityBlock, Footer, Header, Section } from "@/components/layout";
import { HomeSearch } from "@/components/home-search";

const regions = [
  ["서울", "1,840"],
  ["부산", "1,120"],
  ["대구", "760"],
  ["인천", "980"],
  ["광주", "520"],
  ["대전", "480"],
  ["울산", "360"],
  ["세종", "210"],
  ["경기", "4,120"],
  ["강원", "430"],
  ["충북", "520"],
  ["충남", "640"],
  ["전북", "560"],
  ["전남", "470"],
  ["경북", "690"],
  ["경남", "1,080"],
  ["제주", "240"],
];

const popularApartments = [
  {
    rank: 1,
    name: "광교 호수마을 한빛아파트",
    meta: "수원시 영통구 · 1,240세대",
    me: "1,820",
    peer: "1,540",
    width: 32,
    tone: "above",
  },
  {
    rank: 2,
    name: "동탄 린스트라우스",
    meta: "화성시 · 1,560세대",
    me: "1,390",
    peer: "1,480",
    width: 22,
    tone: "below",
  },
  {
    rank: 3,
    name: "송도 더샵 센트럴파크",
    meta: "인천 연수구 · 1,820세대",
    me: "1,710",
    peer: "1,620",
    width: 18,
    tone: "above",
  },
  {
    rank: 4,
    name: "위례 자연앤래미안",
    meta: "성남시 수정구 · 1,142세대",
    me: "1,480",
    peer: "1,505",
    width: 10,
    tone: "below",
  },
];

export default function HomePage() {
  return (
    <div className="app home-page">
      <Header active="home" />
      <main className="wrap">
        <section className="home-hero">
          <span className="home-eyebrow">공공데이터 기반 비교·진단</span>
          <h1>
            우리 단지 관리비,
            <br />
            <b>또래 단지와 비교</b>해보세요
          </h1>
          <p>
            이사·매수를 검토 중이라면 같은 지역·난방·규모의 단지와 ㎡당 관리비를
            나란히 놓고 어디쯤인지 먼저 확인하세요.
          </p>

          <HomeSearch />

          <div className="home-compare-link">
            <Link href="/apt/gyeonggi-suwon-yeongtong/hanbit-kapt-A000001">
              샘플 단지 비교 화면 보기 →
            </Link>
          </div>

          <div className="trust" aria-label="서비스 신뢰 지표">
            <div className="trust-stat">
              <div className="trust-v tnum">18,420</div>
              <div className="trust-l">커버 단지</div>
            </div>
            <div className="trust-stat">
              <div className="trust-v tnum">2026.04</div>
              <div className="trust-l">갱신 기준월</div>
            </div>
            <div className="trust-stat">
              <div className="trust-v">K-apt</div>
              <div className="trust-l">데이터 출처</div>
            </div>
          </div>
        </section>

        <div className="home-ad">
          <div className="adslot" style={{ height: 90 }}>
            <span>광고</span>
          </div>
          <div className="adslot-note">헤더 하단 리더보드 · 고정 높이 예약</div>
        </div>

        <Section title="지역별로 보기" note="시도 → 시군구">
          <div className="sido-grid">
            {regions.map(([name, count]) => (
              <Link className="sido" href="/region/gyeonggi/suwon-yeongtong" key={name}>
                <span className="sido-n">{name}</span>
                <span className="sido-c tnum">{count}곳</span>
              </Link>
            ))}
          </div>
        </Section>

        <Section title="지금 많이 본 단지" note="최근 7일">
          <div className="popcards">
            {popularApartments.map((item) => (
              <Link
                className="popcard"
                href="/apt/gyeonggi-suwon-yeongtong/hanbit-kapt-A000001"
                key={item.name}
              >
                <div className="popcard-top">
                  <div className="popcard-n">{item.name}</div>
                  <div className="popcard-rank">#{item.rank}</div>
                </div>
                <div className="popcard-meta tnum">{item.meta}</div>
                <div className="popcard-bar">
                  <div className="pcb-track">
                    <div className="pcb-mid" />
                    <div
                      className={`pcb-fill pcb-fill--${item.tone}`}
                      style={{ width: `${item.width}%` }}
                    />
                  </div>
                  <div className="pcb-cap tnum">
                    <span>{item.me}원/㎡</span>
                    <span>또래 {item.peer}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <Section title="관리비, 제대로 읽는 법">
          <Link className="guidecard" href="/guide/management-fee-items">
            <span className="badge badge--info">가이드</span>
            <span className="guidecard-t">관리비 항목을 총액보다 먼저 분해해서 보는 방법</span>
            <span className="ilink-arr">→</span>
          </Link>
          <Link className="guidecard" href="/guide/heating-comparison">
            <span className="badge badge--info">비교</span>
            <span className="guidecard-t">지역난방 단지는 같은 난방방식끼리 비교해야 하는 이유</span>
            <span className="ilink-arr">→</span>
          </Link>
          <Link className="guidecard" href="/learn/long-term-repair-reserve">
            <span className="badge badge--neutral">제도</span>
            <span className="guidecard-t">장기수선충당금을 높고 낮음보다 계획 맥락으로 읽기</span>
            <span className="ilink-arr">→</span>
          </Link>
        </Section>

        <Section title="블로그" note="데이터 인사이트">
          <Link className="guidecard" href="/blog">
            <span className="badge badge--neutral">전체</span>
            <span className="guidecard-t">관리비 비교와 K-apt 데이터 읽기 글 모두 보기</span>
            <span className="ilink-arr">→</span>
          </Link>
        </Section>

        <DataQualityBlock variant="home" />
      </main>
      <Footer />
    </div>
  );
}
