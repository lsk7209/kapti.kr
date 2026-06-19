import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { AdSlot, SourceCap } from "@/components/data-ui";

export const metadata: Metadata = {
  title: "디자인 시스템",
  description: "케이아파티 관리비 비교 화면의 디자인 토큰과 핵심 컴포넌트입니다.",
  alternates: {
    canonical: "/design-system",
  },
  robots: {
    index: false,
    follow: true,
  },
};

const swatches = [
  ["primary-900", "#102C7A", "var(--primary-900)"],
  ["primary-700", "#1539A8", "var(--primary-700)"],
  ["primary", "#1B4DDB", "var(--primary)"],
  ["primary-100", "#E6EDFD", "var(--primary-100)"],
  ["primary-50", "#F1F5FE", "var(--primary-50)"],
  ["ink-900", "#0E1726", "var(--ink-900)"],
  ["ink-500", "#5C6B85", "var(--ink-500)"],
  ["bg", "#F4F6F9", "var(--bg)"],
];

export default function DesignSystemPage() {
  return (
    <div className="app">
      <Header />
      <div className="ds-top">
        <div className="ds-top-inner">
          <div className="ds-kicker">Design System</div>
          <div className="ds-title">케이아파티 관리비 비교·진단</div>
          <p className="ds-sub">
            전국 공동주택 관리비를 또래 단지와 비교하는 정보 서비스의 토큰과 컴포넌트입니다. 단정하지 않고 항상 <b>수치 + 중립 맥락 + 기준월 + 출처</b>로 표현합니다.
          </p>
        </div>
      </div>

      <main className="ds-wrap">
        <section className="ds-section">
          <div className="ds-h">
            <h2>타이포그래피</h2>
            <span>Pretendard · tabular numerals</span>
          </div>
          <div className="ds-panel">
            <div className="type-row">
              <div className="type-meta">Display · 30</div>
              <div style={{ fontSize: "var(--fs-display)", fontWeight: "var(--fw-bold)" }} className="tnum">
                1,820원<span style={{ fontSize: 15, color: "var(--ink-400)" }}> /㎡</span>
              </div>
            </div>
            <div className="type-row">
              <div className="type-meta">H1 · 23</div>
              <div style={{ fontSize: "var(--fs-h1)", fontWeight: "var(--fw-bold)" }}>광교 호수마을 한빛아파트</div>
            </div>
            <div className="type-row">
              <div className="type-meta">Body · 15</div>
              <div>이 단지의 ㎡당 공용관리비는 같은 비교군 중앙값 대비 높은 편입니다.</div>
            </div>
            <div className="type-row">
              <div className="type-meta">Caption</div>
              <SourceCap />
            </div>
          </div>
        </section>

        <section className="ds-section">
          <div className="ds-h">
            <h2>컬러 토큰</h2>
            <span>중립 베이스 + 단일 프라이머리 + 중립 diverging</span>
          </div>
          <div className="ds-grid">
            <div className="ds-panel">
              <div className="ds-label">Core palette</div>
              <div className="sw-row">
                {swatches.map(([name, value, css]) => (
                  <div className="sw" key={name}>
                    <div className="sw-chip" style={{ background: css }} />
                    <div className="sw-meta">
                      <div className="sw-name">{name}</div>
                      <div className="sw-val">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="ds-panel">
              <div className="ds-label">Diverging · 가치판단 아님</div>
              <p style={{ color: "var(--ink-500)", fontSize: "var(--fs-sm)", marginBottom: 14 }}>
                빨강=나쁨/초록=좋음을 피하고 블루(또래보다 낮음) ↔ 앰버(또래보다 높음)로 위치만 표현합니다.
              </p>
              <div className="div-strip">
                <span style={{ color: "var(--below-strong)", fontSize: "var(--fs-xs)", fontWeight: 650 }}>또래보다 낮음</span>
                <div className="div-bar" />
                <span style={{ color: "var(--above-strong)", fontSize: "var(--fs-xs)", fontWeight: 650 }}>또래보다 높음</span>
              </div>
            </div>
          </div>
        </section>

        <section className="ds-section">
          <div className="ds-h">
            <h2>컴포넌트</h2>
            <span>상세 페이지 공통 부품</span>
          </div>
          <div className="ds-grid">
            <div className="ds-panel">
              <div className="ds-label">배지 · 칩 · 출처</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 16 }}>
                <span className="badge badge--neutral">대단지</span>
                <span className="badge badge--info">지역난방</span>
                <span className="badge badge--above">또래보다 높음</span>
                <span className="badge badge--below">또래보다 낮음</span>
                <span className="chip chip--primary">같은 시군구</span>
                <span className="chip">1,000세대+</span>
                <span className="chip chip--outline">32곳 비교</span>
              </div>
              <SourceCap />
            </div>

            <div className="comp-grid">
              <div className="ds-panel">
                <div className="ds-label">포지션 바</div>
                <div className="posbar">
                  <div className="posbar-track">
                    <div className="posbar-marker" style={{ left: "82%" }} />
                  </div>
                  <div className="posbar-scale">
                    <span>낮음</span>
                    <span>중앙값</span>
                    <span>높음</span>
                  </div>
                </div>
                <p style={{ marginTop: 14, color: "var(--ink-700)", fontSize: "var(--fs-sm)" }}>
                  같은 비교군 중 <b>관리비 상위 18%</b>
                </p>
                <div className="cap" style={{ marginTop: 4 }}>32곳 중 6위 수준 · 기준 2026.04</div>
              </div>
              <div className="ds-panel">
                <div className="ds-label">비교 막대</div>
                <div className="cmp">
                  <div className="cmp-row">
                    <div className="cmp-name">이 단지</div>
                    <div className="cmp-track">
                      <div className="cmp-fill cmp-fill--above" style={{ width: "84%" }} />
                    </div>
                    <div className="cmp-val tnum">1,820</div>
                  </div>
                  <div className="cmp-row">
                    <div className="cmp-name" style={{ color: "var(--ink-500)" }}>또래 중앙값</div>
                    <div className="cmp-track">
                      <div className="cmp-fill cmp-fill--mid" style={{ width: "71%" }} />
                    </div>
                    <div className="cmp-val tnum" style={{ color: "var(--ink-500)" }}>1,540</div>
                  </div>
                </div>
                <div className="cap" style={{ marginTop: 12 }}>단위: 원/㎡ · 차이 +18%</div>
              </div>
            </div>

            <div className="comp-grid">
              <div className="ds-panel">
                <div className="ds-label">광고 슬롯</div>
                <AdSlot height={90} />
              </div>
              <div className="ds-panel">
                <div className="ds-label">내부링크 카드</div>
                <Link className="ilink" href="/apt/gyeonggi-suwon-yeongtong/hanbit-kapt-A000001">
                  <div className="ilink-body">
                    <div className="ilink-t">광교 센트럴파크 아파트</div>
                    <div className="ilink-s tnum">1,610원/㎡ · 1,008세대 · 지역난방</div>
                  </div>
                  <div className="ilink-arr">→</div>
                </Link>
              </div>
            </div>

            <div className="comp-grid">
              <div className="ds-panel">
                <div className="ds-label">비교군 부족 폴백</div>
                <div className="fallback" style={{ marginBottom: 0 }}>
                  <div className="fallback-ic">ℹ</div>
                  <div>
                    <div className="fallback-t">같은 조건 단지가 적어 상위 지역 기준으로 비교했어요</div>
                    <div className="cap" style={{ marginTop: 3 }}>시군구(8곳) → 시도(41곳)로 확장 · 기준 2026.04</div>
                  </div>
                </div>
              </div>
              <div className="ds-panel">
                <div className="ds-label">빈 상태</div>
                <div className="empty" style={{ padding: "22px 14px" }}>
                  <div className="empty-ic">◷</div>
                  <div style={{ fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-sm)" }}>아직 비교할 관리비 데이터가 없어요</div>
                  <div className="cap" style={{ marginTop: 4 }}>공개되는 대로 업데이트됩니다</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
