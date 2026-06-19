import { sampleApartment } from "./sample-data";

export const regionOverview = {
  title: "지역별 공동주택 관리비",
  description:
    "시도와 시군구 단위로 공동주택 관리비 분포, 중앙값, 비교군 조건을 확인하는 지역 허브입니다.",
  baseMonth: sampleApartment.baseMonth,
  source: sampleApartment.source,
  regions: [
    { name: "서울", slug: "seoul", count: 1840, median: 1680, heating: "개별·지역 혼합" },
    { name: "부산", slug: "busan", count: 1120, median: 1430, heating: "개별난방 중심" },
    { name: "인천", slug: "incheon", count: 980, median: 1510, heating: "지역난방 포함" },
    { name: "경기", slug: "gyeonggi", count: 4120, median: 1540, heating: "지역난방 다수" },
    { name: "대전", slug: "daejeon", count: 480, median: 1380, heating: "개별난방 중심" },
    { name: "경남", slug: "gyeongnam", count: 1080, median: 1320, heating: "개별난방 중심" },
  ],
};

export const regionDetail = {
  sido: "경기",
  sigungu: "수원시 영통구",
  slug: ["gyeonggi", "suwon-yeongtong"],
  title: "경기 수원시 영통구 관리비 비교",
  description:
    "수원시 영통구 공동주택을 난방방식, 세대수, ㎡당 공용관리비 기준으로 중립 비교합니다.",
  median: 1540,
  baseMonth: sampleApartment.baseMonth,
  source: sampleApartment.source,
  peerGroup: "같은 시군구 · 지역난방 · 1,000세대+ 단지 32곳",
  distribution: [
    { label: "하위 25%", value: 1280 },
    { label: "중앙값", value: 1540 },
    { label: "상위 25%", value: 1760 },
  ],
  apartments: [
    {
      name: sampleApartment.name,
      href: `/apt/${sampleApartment.region.path}/${sampleApartment.slug}`,
      households: sampleApartment.meta.households,
      heating: sampleApartment.meta.heating,
      perM2: sampleApartment.perM2,
      peerMedian: sampleApartment.peerMedian,
      builtYear: sampleApartment.meta.builtYear,
    },
    {
      name: "광교 센트럴파크 아파트",
      href: `/apt/${sampleApartment.region.path}/${sampleApartment.slug}`,
      households: 1008,
      heating: "지역난방",
      perM2: 1610,
      peerMedian: 1540,
      builtYear: 2011,
    },
    {
      name: "광교 마을 호반베르디움",
      href: `/apt/${sampleApartment.region.path}/${sampleApartment.slug}`,
      households: 1430,
      heating: "지역난방",
      perM2: 1495,
      peerMedian: 1540,
      builtYear: 2014,
    },
    {
      name: "영통 푸른마을 신성아파트",
      href: `/apt/${sampleApartment.region.path}/${sampleApartment.slug}`,
      households: 980,
      heating: "개별난방",
      perM2: 1380,
      peerMedian: 1460,
      builtYear: 2002,
    },
  ],
};

export const guidePages = [
  {
    slug: "management-fee-items",
    title: "관리비 항목 완전정복",
    subtitle: "총액보다 먼저 경비비, 청소비, 승강기, 수선유지비를 나눠 읽는 법",
    description:
      "공동주택 관리비 항목을 기준월, 출처, 비교군과 함께 해석하는 필러 가이드입니다.",
    updatedAt: "2026-06-06",
    category: "필러 가이드",
    sections: [
      {
        title: "총액은 출발점일 뿐입니다",
        body:
          "총액은 빠르게 눈에 들어오지만 단지 규모, 난방방식, 공용시설, 관리방식이 섞인 결과입니다. 먼저 ㎡당 공용관리비처럼 단위를 맞추고, 같은 기준월 자료끼리 비교해야 합니다.",
      },
      {
        title: "항목별 차이가 원인 후보를 좁힙니다",
        body:
          "경비비, 청소비, 승강기 유지비, 수선유지비는 서로 다른 운영 조건을 반영합니다. 특정 항목이 또래 중앙값보다 높거나 낮아 보이면 그 항목의 계약 방식과 시설 조건을 확인해야 합니다.",
      },
      {
        title: "비교군을 공개해야 신뢰가 생깁니다",
        body:
          "같은 시군구, 난방방식, 세대수 범위처럼 비교군 조건을 밝히면 독자가 숫자의 한계를 이해할 수 있습니다. 비교군이 부족하면 상위 지역으로 폴백했다는 안내가 필요합니다.",
      },
    ],
  },
  {
    slug: "heating-comparison",
    title: "지역난방 vs 개별난방 관리비 비교",
    subtitle: "난방방식이 다른 단지를 같은 표에 놓기 전 확인할 기준",
    description:
      "지역난방과 개별난방 단지의 관리비 수치를 과장 없이 비교하는 방법을 정리합니다.",
    updatedAt: "2026-06-06",
    category: "비교 가이드",
    sections: [
      {
        title: "난방방식은 비교군의 핵심 조건입니다",
        body:
          "난방방식이 다르면 공용관리비와 사용료가 나타나는 방식도 달라질 수 있습니다. 같은 난방방식끼리 먼저 보고, 다른 방식은 보조 비교로 분리하는 편이 안전합니다.",
      },
      {
        title: "계절 변동은 12개월 흐름으로 봅니다",
        body:
          "겨울철 한 달 자료만으로 단지의 관리비 성격을 단정하기 어렵습니다. 최근 12개월 추이와 기준월을 함께 표시해야 검색자가 숫자의 시점을 이해할 수 있습니다.",
      },
      {
        title: "절감이나 과다 표현은 피합니다",
        body:
          "공개 데이터는 원인을 확정하지 않습니다. 특정 단지를 좋다거나 나쁘다고 말하기보다 난방방식, 공급 조건, 사용량 확인 질문을 남기는 방식이 적절합니다.",
      },
    ],
  },
];

export const learnPages = [
  {
    slug: "long-term-repair-reserve",
    title: "장기수선충당금이란?",
    subtitle: "적립, 사용, 점검 자료를 공개 데이터와 함께 확인하는 법",
    description:
      "장기수선충당금과 장기수선계획을 정보 제공 관점에서 설명하는 에버그린 문서입니다.",
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "장기수선충당금은 장기 시설 보수 재원입니다",
        body:
          "장기수선충당금은 공동주택 주요 시설의 교체와 보수를 위해 적립하는 금액입니다. 금액의 높고 낮음만으로 단지를 평가하기보다 장기수선계획, 시설 연식, 예정 공사를 같이 봐야 합니다.",
      },
      {
        title: "공개 자료와 현장 자료를 나눠 확인합니다",
        body:
          "K-apt 공개 자료는 확인의 출발점입니다. 실제 판단에는 관리사무소 공지, 장기수선계획 조정 내역, 최근 공사 자료처럼 현장 문서가 함께 필요할 수 있습니다.",
      },
      {
        title: "질문으로 끝내는 것이 안전합니다",
        body:
          "수치가 또래보다 다르게 보이면 부족이나 위험으로 단정하지 말고 최근 계획 변경, 대형 공사 예정, 적립 기준을 질문 목록으로 정리하는 편이 적절합니다.",
      },
    ],
  },
];

export const searchItems = [
  {
    type: "단지",
    title: sampleApartment.name,
    description: `${sampleApartment.region.sigungu} · ${sampleApartment.meta.households.toLocaleString("ko-KR")}세대 · ${sampleApartment.meta.heating}`,
    href: `/apt/${sampleApartment.region.path}/${sampleApartment.slug}`,
    keywords: ["광교", "호수마을", "한빛", "수원", "영통", "지역난방"],
  },
  {
    type: "지역",
    title: regionDetail.title,
    description: regionDetail.description,
    href: `/region/${regionDetail.slug.join("/")}`,
    keywords: ["경기", "수원", "영통구", "지역", "관리비"],
  },
  ...guidePages.map((page) => ({
    type: page.category,
    title: page.title,
    description: page.subtitle,
    href: `/guide/${page.slug}`,
    keywords: [page.title, page.subtitle, "관리비", "가이드"],
  })),
  ...learnPages.map((page) => ({
    type: "전문 가이드",
    title: page.title,
    description: page.subtitle,
    href: `/learn/${page.slug}`,
    keywords: [page.title, page.subtitle, "장기수선", "충당금"],
  })),
];

export function getGuide(slug: string) {
  return guidePages.find((page) => page.slug === slug);
}

export function getLearn(slug: string) {
  return learnPages.find((page) => page.slug === slug);
}
