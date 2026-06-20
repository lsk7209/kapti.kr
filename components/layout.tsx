import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site";

type HeaderActive = "home" | "region" | "guide" | "learn" | "blog" | "design" | "about";
type DataQualityBlockVariant =
  | "home"
  | "blog"
  | "region"
  | "guide"
  | "learn"
  | "search"
  | "region-detail";

const dataQualityCopy: Record<
  DataQualityBlockVariant,
  {
    title: string;
    lead: string;
    contextTitle: string;
    context: string[];
  }
> = {
  home: {
    title: "관리비 비교를 시작하기 전 확인할 기준",
    lead:
      "케이아파티는 단지명 검색을 빠르게 시작점으로 제공하지만, 관리비 숫자는 검색 결과 하나만으로 판단하지 않습니다. 같은 기준월, 같은 단위, 같은 비교군을 먼저 맞춘 뒤 단지 상세와 지역 허브, 관리비 가이드를 이어서 확인해야 과한 해석을 줄일 수 있습니다.",
    contextTitle: "홈 화면에서 다음으로 이어갈 읽기 순서",
    context: [
      "홈 검색에서 단지를 찾았다면 먼저 ㎡당 공용관리비, 세대수, 난방방식, 기준월을 함께 확인하세요. 총액은 면적 구성과 세대 규모에 영향을 받기 때문에 바로 좋고 나쁨을 말하기 어렵습니다.",
      "샘플 단지 화면은 비교 흐름을 보여 주기 위한 예시입니다. 실제 공개 데이터는 원천 갱신 주기, 항목 정의, 단지 신고 상태에 따라 지연되거나 보정될 수 있으므로 K-apt 원문과 관리주체 공지를 함께 확인하는 것이 좋습니다.",
    ],
  },
  blog: {
    title: "블로그 글을 관리비 판단 자료로 읽는 방법",
    lead:
      "케이아파티 블로그는 특정 단지를 추천하거나 평가하기보다 공개 관리비 자료를 읽는 순서를 설명합니다. 글 본문을 읽은 뒤에는 관련 지역 허브, 단지 상세, 공식 원천 페이지를 열어 같은 기준월과 항목 정의가 맞는지 확인하는 흐름을 권장합니다.",
    contextTitle: "본문에서 확인해야 할 세 가지",
    context: [
      "첫째, 글이 설명하는 항목이 공용관리비인지, 개별 사용료인지, 장기수선충당금인지 구분해야 합니다. 둘째, 비교군이 같은 지역과 난방방식으로 묶였는지 확인해야 합니다.",
      "셋째, 글에서 제시하는 체크리스트를 실제 단지 상세와 대조하세요. 글은 해석의 틀을 제공하고, 최종 판단은 원천 데이터와 관리주체의 공개 자료를 함께 확인할 때 더 안정적입니다.",
    ],
  },
  region: {
    title: "지역별 관리비를 해석하는 기준",
    lead:
      "지역 허브는 시도와 시군구 단위에서 관리비 분포를 살펴보는 출발점입니다. 한 지역의 중앙값은 단지별 적정성을 단정하는 기준이 아니라, 사용자가 비교 대상을 좁히고 질문을 정리하기 위한 참고 지표로 보아야 합니다.",
    contextTitle: "지역 비교에서 과해석을 줄이는 방법",
    context: [
      "지역 평균이나 중앙값은 같은 지역 안에서도 세대수, 준공연도, 난방방식, 부대시설, 관리 방식에 따라 달라질 수 있습니다. 그래서 단지 상세 화면에서는 또래 비교군 수와 기준월을 함께 읽어야 합니다.",
      "특정 지역이 높거나 낮아 보일 때는 항목별 구성도 함께 확인하세요. 경비비, 청소비, 승강기 유지비, 수선유지비처럼 세부 항목을 분해하면 단순 총액 비교보다 더 실용적인 질문을 만들 수 있습니다.",
    ],
  },
  guide: {
    title: "가이드를 실제 관리비 비교에 적용하는 방법",
    lead:
      "가이드 문서는 관리비 항목을 읽는 순서, 비교군을 고르는 기준, 기준월을 확인하는 습관을 정리합니다. 단지의 좋고 나쁨을 결론내기보다 사용자가 공개 자료를 확인할 때 놓치기 쉬운 조건을 먼저 점검하도록 설계했습니다.",
    contextTitle: "가이드 활용 순서",
    context: [
      "먼저 총액과 ㎡당 금액을 구분하고, 그다음 공용관리비와 개별 사용료를 분리하세요. 같은 문서 안에서도 관리비, 장기수선충당금, 난방비는 서로 다른 질문에 답합니다.",
      "가이드를 읽은 뒤에는 지역 허브나 샘플 단지 화면으로 이동해 체크한 기준을 실제 표와 비교하세요. 기준월이 오래되었거나 비교군이 작다면 단정 표현을 피하고 원문 확인을 우선해야 합니다.",
    ],
  },
  learn: {
    title: "전문 가이드를 읽을 때의 검증 기준",
    lead:
      "전문 가이드는 장기수선충당금, 공동주택 관리 제도, 공개 데이터의 한계처럼 단정하기 쉬운 주제를 천천히 설명합니다. 제도 설명은 법률 자문이 아니며, 실제 분쟁이나 계약 판단은 관련 법령과 관리주체 자료를 함께 확인해야 합니다.",
    contextTitle: "제도형 주제에서 확인할 것",
    context: [
      "장기수선충당금은 금액이 높다고 곧바로 문제라는 뜻도, 낮다고 곧바로 안전하다는 뜻도 아닙니다. 장기수선계획, 단지 연식, 예정 공사, 적립금 잔액, 최근 조정 여부를 함께 보아야 합니다.",
      "전문 가이드는 이런 확인 질문을 정리하는 역할입니다. 사용자는 글을 읽은 뒤 공식 법령, 관리규약, 입주자대표회의 자료, K-apt 공개 항목을 차례로 대조해 보는 것이 좋습니다.",
    ],
  },
  search: {
    title: "검색 결과를 안전하게 좁히는 방법",
    lead:
      "검색 페이지는 단지명, 지역명, 관리비 항목으로 관련 문서를 빠르게 찾는 도구입니다. 검색 결과의 순서가 단지 평가나 추천을 의미하지 않으며, 사용자는 결과를 클릭한 뒤 기준월, 출처, 비교군을 다시 확인해야 합니다.",
    contextTitle: "검색어를 바꾸며 확인할 질문",
    context: [
      "단지명이 바로 나오지 않으면 시군구, 도로명, 관리비 항목명으로 검색 범위를 넓혀 보세요. 같은 이름의 단지가 여러 지역에 있을 수 있으므로 지역과 세대수까지 함께 확인하는 편이 안전합니다.",
      "검색 결과에서 바로 결론을 내리기보다 관련 가이드와 지역 허브를 함께 열어 보세요. 관리비 비교는 숫자 하나보다 항목 정의, 기준월, 비교군 설명이 함께 있을 때 의미가 분명해집니다.",
    ],
  },
  "region-detail": {
    title: "시군구 단지 목록을 읽는 방법",
    lead:
      "시군구 상세 페이지는 같은 지역 안에서 단지별 관리비를 비교하기 위한 중간 허브입니다. 목록의 수치는 단지의 품질을 평가하는 점수가 아니라, 사용자가 비슷한 조건의 단지를 찾고 항목별 질문을 만들기 위한 출발점입니다.",
    contextTitle: "단지 목록에서 함께 볼 조건",
    context: [
      "단지별 ㎡당 금액은 세대수, 준공연도, 난방방식, 관리 방식, 부대시설 규모에 따라 다르게 보일 수 있습니다. 그래서 목록에서는 또래 대비 차이를 보되, 단지 상세에서 세부 항목과 기준월을 다시 확인해야 합니다.",
      "차이가 큰 단지를 발견했다면 관리비 고지서의 항목별 구성, 관리주체 공지, 장기수선계획, 최근 공사 여부를 함께 보세요. 케이아파티는 이런 추가 확인을 돕는 정보 탐색 도구입니다.",
    ],
  },
};

export function Header({ active }: { active?: HeaderActive }) {
  return (
    <header className="hd">
      <div className="hd-in">
        <Link className="brand" href="/">
          <div className="brand-mark">K</div>
          <div className="brand-name">
            {siteConfig.name}
            <small>관리비 비교</small>
          </div>
        </Link>
        <nav className="nav-desktop" aria-label="주요 메뉴">
          <Link className={active === "home" ? "is-active" : ""} href="/">
            홈
          </Link>
          <Link className={active === "region" ? "is-active" : ""} href="/region">
            지역 통계
          </Link>
          <Link className={active === "guide" ? "is-active" : ""} href="/guide">
            가이드
          </Link>
          <Link className={active === "learn" ? "is-active" : ""} href="/learn">
            전문
          </Link>
          <Link className={active === "blog" ? "is-active" : ""} href="/blog">
            블로그
          </Link>
          <Link className={active === "design" ? "is-active" : ""} href="/design-system">
            디자인 시스템
          </Link>
        </nav>
        <SearchBox />
        <Link className="btn btn--ghost hd-cta" href="/blog">
          관리비 가이드
        </Link>
        <Link className="btn btn--ghost hd-cta" href="/design-system">
          디자인 시스템
        </Link>
        <details className="hd-mobile-nav">
          <summary aria-label="메뉴">
            <span />
            <span />
            <span />
          </summary>
          <nav aria-label="모바일 메뉴">
            <Link className={active === "home" ? "is-active" : ""} href="/">
              홈
            </Link>
            <Link className={active === "region" ? "is-active" : ""} href="/region">
              지역 통계
            </Link>
            <Link className={active === "guide" ? "is-active" : ""} href="/guide">
              가이드
            </Link>
            <Link className={active === "learn" ? "is-active" : ""} href="/learn">
              전문
            </Link>
            <Link className={active === "blog" ? "is-active" : ""} href="/blog">
              블로그
            </Link>
            <Link className={active === "design" ? "is-active" : ""} href="/design-system">
              디자인 시스템
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function SearchBox({ compact = false }: { compact?: boolean }) {
  return (
    <form action="/search" className="search" role="search" style={compact ? { maxWidth: 360, margin: "0 auto" } : undefined}>
      <svg className="search-ic" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input aria-label="단지명 또는 지역 검색" name="q" placeholder="단지명, 도로명, 지역으로 검색" />
    </form>
  );
}

export function Footer() {
  return (
    <footer className="ft">
      <div className="ft-in">
        <div className="ft-links">
          <Link href="/about">소개</Link>
          <Link href="/guide">관리비 가이드</Link>
          <Link href="/learn">전문 가이드</Link>
          <Link href="/contact">문의</Link>
          <Link href="/privacy">개인정보처리방침</Link>
          <Link href="/terms">이용약관</Link>
        </div>
        <p className="ft-note">
          공공 데이터를 가공한 정보로 원본과 차이가 있을 수 있습니다. 일부 콘텐츠는 AI 작성 보조를 거치며 출처는 data.go.kr / K-apt입니다.
        </p>
      </div>
    </footer>
  );
}

export function Section({
  title,
  note,
  children,
}: {
  title?: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="section">
      {title ? (
        <div className="section-h">
          <h2>{title}</h2>
          {note ? <span className="h-note">{note}</span> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function DataQualityBlock({ variant }: { variant: DataQualityBlockVariant }) {
  const copy = dataQualityCopy[variant];

  return (
    <Section title={copy.title} note="출처·검증·다음 행동">
      <div className="guidecard" style={{ display: "block" }}>
        <p>{copy.lead}</p>

        <h3>공개 데이터 해석 순서</h3>
        <p>
          관리비 비교는 먼저 단위를 맞추는 일에서 시작합니다. 총액, 세대당 금액, ㎡당 금액은
          서로 다른 질문에 답합니다. 단지 규모와 면적 구성이 다르면 총액만으로는 비교가 어렵고,
          같은 지역이라도 난방방식이나 부대시설 규모가 다르면 항목별 차이가 생길 수 있습니다.
          케이아파티의 문서와 허브 페이지는 이런 차이를 숨기지 않고 기준월, 출처, 비교군을 함께
          보도록 안내합니다.
        </p>
        <p>
          두 번째 단계는 비교군을 확인하는 것입니다. 같은 시군구, 비슷한 세대수, 같은 난방방식,
          비슷한 준공연도에 가까울수록 비교 질문이 선명해집니다. 비교군이 너무 작으면 상위 지역으로
          넓혀 보되, 그 사실을 함께 기록해야 합니다. 중앙값이나 평균은 결론이 아니라 질문을 좁히는
          신호입니다.
        </p>
        <p>
          세 번째 단계는 항목을 분해하는 것입니다. 공용관리비, 경비비, 청소비, 승강기 유지비,
          수선유지비, 장기수선충당금, 난방비는 서로 다른 원인으로 움직입니다. 한 항목이 높게 보이면
          시설 규모, 계약 방식, 계절성, 예정 공사, 관리규약, 최근 고지서 공지를 함께 확인해야 합니다.
          공개 데이터 화면은 질문을 만드는 도구이고, 최종 판단은 원천 자료와 현장 공지 확인이 필요합니다.
        </p>
        <p>
          네 번째 단계는 기간을 넓혀 보는 것입니다. 관리비는 한 달치 고지서만으로 추세를 말하기 어렵습니다.
          여름과 겨울의 냉난방 사용, 계약 갱신, 대수선 공사, 입주 초기 하자 보수, 승강기나 주차장 설비
          교체처럼 일시적인 요인이 섞일 수 있습니다. 가능하다면 최근 3개월, 6개월, 12개월 흐름을 나누어
          보고, 기준월이 서로 다른 자료를 같은 표에서 비교하지 않는 편이 안전합니다.
        </p>
        <p>
          다섯 번째 단계는 단지 특성을 확인하는 것입니다. 세대수가 큰 단지는 일부 고정비를 넓게 나눌 수
          있지만, 커뮤니티 시설이나 보안 인력 운영 방식에 따라 총액이 달라질 수 있습니다. 준공연도가 오래된
          단지는 수선유지비와 장기수선충당금 질문이 중요해질 수 있고, 신축 단지는 초기 관리 방식이나
          무상보수 범위가 해석에 영향을 줄 수 있습니다. 숫자 하나보다 조건을 함께 보는 이유가 여기에 있습니다.
        </p>
        <p>
          여섯 번째 단계는 원문과 서비스 화면의 역할을 분리하는 것입니다. K-apt와 공공데이터포털은 원천
          확인의 출발점이고, 케이아파티는 그 자료를 사용자가 읽기 쉬운 질문으로 바꾸는 보조 도구입니다.
          원천 자료가 늦게 갱신되었거나 단지 신고 내용이 바뀌었거나 항목 정의가 달라졌다면 화면의 설명도
          달라져야 합니다. 그래서 페이지마다 출처와 기준월, 비교군을 반복해서 보여 주는 것이 필요합니다.
        </p>
        <p>
          마지막 단계는 결론을 서두르지 않는 것입니다. 관리비가 또래 중앙값보다 높아 보이면 먼저 항목별
          차이를 확인하고, 낮아 보이면 필요한 적립이나 유지보수가 빠진 것은 아닌지 질문해야 합니다. 이사,
          매수, 임대, 관리비 민원처럼 실제 행동으로 이어질 때는 고지서 원문, 관리주체 공지, 입주자대표회의
          자료, 장기수선계획, 관리규약을 함께 확인하세요. 케이아파티의 목표는 단지에 점수를 매기는 것이
          아니라 사용자가 확인해야 할 질문을 빠뜨리지 않게 돕는 것입니다.
        </p>

        <h3>{copy.contextTitle}</h3>
        {copy.context.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        <h3>공식 확인 경로</h3>
        <p>
          원문 확인은 항상 공식 경로를 우선합니다. K-apt 공동주택관리정보시스템에서는 단지별 공개
          항목과 기준월을 확인할 수 있고, 공공데이터포털은 데이터 제공 항목과 갱신 범위를 확인하는
          데 유용합니다. 법령이나 제도 해석이 필요한 경우에는 국가법령정보센터와 국토교통부 자료를
          함께 확인하세요.
        </p>
        <ul className="article-checklist">
          <li>
            <a href="https://www.k-apt.go.kr/" target="_blank" rel="noopener noreferrer">
              K-apt 공동주택관리정보시스템에서 단지별 원문 확인
            </a>
          </li>
          <li>
            <a href="https://www.data.go.kr/" target="_blank" rel="noopener noreferrer">
              공공데이터포털에서 공동주택 관리비 데이터 제공 범위 확인
            </a>
          </li>
          <li>
            <a href="https://www.law.go.kr/" target="_blank" rel="noopener noreferrer">
              국가법령정보센터에서 공동주택관리법과 관련 규정 확인
            </a>
          </li>
          <li>
            <a href="https://www.molit.go.kr/" target="_blank" rel="noopener noreferrer">
              국토교통부 공개 자료와 정책 안내 확인
            </a>
          </li>
        </ul>

        <h3>다음 행동</h3>
        <p>
          지금 보는 페이지에서 기준을 확인했다면 실제 단지 비교, 지역 통계, 관리비 항목 가이드를
          이어서 열어 보세요. 숫자가 예상과 다르면 단지명을 다시 검색하고, 기준월이 맞는지 확인한 뒤,
          필요하면 관리주체 공지나 고지서 원문을 대조하는 순서가 안전합니다.
        </p>
        <div className="home-compare-link">
          <Link href="/apt/gyeonggi-suwon-yeongtong/hanbit-kapt-A000001">샘플 단지 비교 확인</Link>
          <Link href="/region/gyeonggi/suwon-yeongtong">지역 관리비 분포 보기</Link>
          <Link href="/guide/management-fee-items">관리비 항목 가이드 읽기</Link>
          <Link href="/learn/long-term-repair-reserve">장기수선충당금 전문 가이드 확인</Link>
        </div>
      </div>
    </Section>
  );
}
