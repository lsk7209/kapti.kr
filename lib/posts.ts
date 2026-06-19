import { absoluteUrl } from "./site";
import { getGeneratedPosts } from "./generated-posts";

export type BlogHeading = {
  id: string;
  level: 2 | 3;
  text: string;
};

export type BlogSection = {
  id: string;
  title: string;
  body: string[];
  points?: string[];
};

export type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  reviewer: string;
  readingMinutes: number;
  canonicalPath: string;
  keywords: string[];
  sources: string[];
  scheduledAt?: string;
  sections: BlogSection[];
};

export const editorialPosts: BlogPost[] = [
  {
    title: "관리비 비교 전에 확인할 5가지 기준",
    slug: "apartment-fee-comparison-checkpoints",
    excerpt:
      "㎡당 공용관리비, 비교군, 기준월, 난방방식, 세대 규모를 함께 봐야 단지 간 관리비 차이를 중립적으로 해석할 수 있습니다.",
    category: "관리비 기초",
    publishedAt: "2026-06-06",
    updatedAt: "2026-06-06",
    author: "케이아파티 데이터 편집팀",
    reviewer: "공공데이터 검수 기준",
    readingMinutes: 6,
    canonicalPath: "/blog/apartment-fee-comparison-checkpoints",
    keywords: ["관리비 비교", "아파트 관리비", "공동주택 관리비", "K-apt"],
    sources: ["data.go.kr", "K-apt 공동주택관리정보시스템", "국토교통부 공동주택 관리비 공개 기준"],
    sections: [
      {
        id: "unit",
        title: "1. 같은 단위로 환산된 금액인지 먼저 확인",
        body: [
          "관리비 비교의 출발점은 단위입니다. 총액, 세대당 금액, ㎡당 금액은 서로 다른 질문에 답합니다. 단지 규모와 전용면적 구성이 다르면 총액만으로는 단지 간 비교가 어렵습니다.",
          "케이아파티 화면은 샘플 기준으로 ㎡당 공용관리비를 우선 노출합니다. 실제 데이터 연동 단계에서는 공개 원천의 정규화 단위를 확인한 뒤 같은 단위끼리만 비교해야 합니다.",
        ],
        points: ["총액과 ㎡당 금액을 섞지 않기", "개별 사용료와 공용관리비 범위 구분", "기준월을 함께 확인"],
      },
      {
        id: "peer-group",
        title: "2. 또래 비교군이 충분한지 확인",
        body: [
          "같은 시군구, 난방방식, 세대 규모를 기준으로 묶으면 생활 조건이 비슷한 단지끼리 볼 수 있습니다. 다만 조건이 많아지면 비교군 수가 너무 적어져 수치가 흔들릴 수 있습니다.",
          "비교군이 부족하면 상위 지역으로 확장하고, 화면에는 폴백 사실을 명시해야 합니다. 사용자는 숫자뿐 아니라 어떤 집단과 비교했는지를 함께 알아야 합니다.",
        ],
        points: ["최소 표본 수 기준 마련", "폴백 시 지역 단위 표시", "비교군 수를 숨기지 않기"],
      },
      {
        id: "items",
        title: "3. 항목별 차이를 분해해서 보기",
        body: [
          "관리비 총액이 또래 중앙값보다 높아도 그 이유는 단지마다 다릅니다. 경비비, 청소비, 승강기 유지비, 수선유지비처럼 항목을 나눠 보면 차이가 어디서 생겼는지 더 명확해집니다.",
          "항목별 비교는 평가가 아니라 맥락입니다. 특정 항목이 높다는 사실은 시설, 인력 운영, 노후도, 계약 방식 등 다양한 원인과 함께 해석해야 합니다.",
        ],
      },
      {
        id: "month",
        title: "4. 기준월과 갱신 시점을 같이 보기",
        body: [
          "관리비는 계절과 계약 변경, 수선 일정에 따라 움직입니다. 한 달치 수치만 보고 추세를 판단하면 과도한 해석이 될 수 있습니다.",
          "최근 12개월 추이를 함께 보면 일시적 변동인지, 몇 달 동안 이어진 변화인지 확인할 수 있습니다. 모든 데이터 블록에는 기준월과 출처가 같이 있어야 합니다.",
        ],
      },
      {
        id: "neutral",
        title: "5. 단정 대신 수치와 출처로 판단하기",
        body: [
          "공공데이터 기반 비교 화면은 단지를 평가하거나 매수 결정을 권유하는 공간이 아닙니다. '비싸다', '부실하다' 같은 단정 대신 중앙값 대비 차이, 비교군, 기준월, 출처를 제시하는 방식이 안전합니다.",
          "사용자는 숫자를 통해 질문을 정리하고, 필요한 경우 관리주체의 공지나 장기수선계획 등 추가 자료를 확인해야 합니다.",
        ],
      },
    ],
  },
  {
    title: "지역난방 단지 관리비를 볼 때 놓치기 쉬운 점",
    slug: "district-heating-fee-context",
    excerpt:
      "지역난방 단지는 난방·급탕 비용 해석이 개별난방 단지와 달라 같은 난방방식 비교군을 우선 확인해야 합니다.",
    category: "난방방식",
    publishedAt: "2026-06-06",
    updatedAt: "2026-06-06",
    author: "케이아파티 데이터 편집팀",
    reviewer: "공공데이터 검수 기준",
    readingMinutes: 5,
    canonicalPath: "/blog/district-heating-fee-context",
    keywords: ["지역난방 관리비", "난방방식 비교", "아파트 관리비"],
    sources: ["K-apt 공동주택관리정보시스템", "data.go.kr"],
    sections: [
      {
        id: "same-heating",
        title: "같은 난방방식끼리 비교해야 하는 이유",
        body: [
          "난방방식은 관리비 항목의 구조에 영향을 줍니다. 지역난방, 개별난방, 중앙난방 단지를 같은 기준으로만 보면 항목별 차이를 과도하게 해석할 수 있습니다.",
          "따라서 단지 상세 화면의 비교군은 난방방식을 함께 표시해야 합니다. 비교군이 충분하지 않으면 상위 지역으로 확장하되, 확장 사실을 화면에 남겨야 합니다.",
        ],
      },
      {
        id: "season",
        title: "계절 변동과 최근 12개월 추이",
        body: [
          "난방 관련 비용은 월별 편차가 클 수 있습니다. 한 달 수치보다 최근 12개월 추이를 함께 보는 편이 더 안정적입니다.",
          "추이 차트는 판단 문구를 대신하지 않습니다. 사용자가 기준월과 변동 폭을 확인할 수 있도록 돕는 보조 정보입니다.",
        ],
      },
      {
        id: "copy",
        title: "사용자에게 보여줄 중립 문구",
        body: [
          "지역난방 단지에서는 '난방방식이 다른 단지와는 해석에 주의가 필요합니다'처럼 정보 범위를 설명하는 문구가 적절합니다.",
          "특정 단지의 관리 품질이나 거주 만족도를 관리비 수치만으로 단정하지 않는 것이 핵심입니다.",
        ],
      },
    ],
  },
  {
    title: "장기수선충당금 수치를 읽는 기본 방법",
    slug: "long-term-repair-reserve-reading",
    excerpt:
      "장기수선충당금은 단지의 계획과 설비 상태에 따라 해석이 달라지므로 또래 평균과 함께 사실 중심으로 확인해야 합니다.",
    category: "장기수선충당금",
    publishedAt: "2026-06-06",
    updatedAt: "2026-06-06",
    author: "케이아파티 데이터 편집팀",
    reviewer: "공공데이터 검수 기준",
    readingMinutes: 7,
    canonicalPath: "/blog/long-term-repair-reserve-reading",
    keywords: ["장기수선충당금", "아파트 수선유지비", "관리비 항목"],
    sources: ["공동주택관리법 관련 공개 자료", "K-apt 공동주택관리정보시스템", "data.go.kr"],
    sections: [
      {
        id: "what",
        title: "장기수선충당금은 무엇을 위한 항목인가",
        body: [
          "장기수선충당금은 공동주택의 주요 시설을 장기적으로 보수하거나 교체하기 위해 적립하는 금액입니다. 월별 관리비에서 별도 항목으로 보이는 경우가 많습니다.",
          "이 금액은 단지의 연식, 시설 구성, 장기수선계획에 따라 달라질 수 있습니다. 단순히 높고 낮음만으로 적정성을 판단하기 어렵습니다.",
        ],
      },
      {
        id: "compare",
        title: "또래 평균과 비교할 때의 주의점",
        body: [
          "또래 평균보다 높은 적립액은 향후 공사 계획, 설비 노후도, 세대 규모 등과 함께 봐야 합니다. 반대로 낮은 적립액도 자동으로 문제가 있다는 뜻은 아닙니다.",
          "케이아파티의 표현 기준은 사실 진술입니다. '㎡당 적립액이 또래 평균보다 얼마 차이난다'는 정보와 기준월, 출처를 함께 보여주는 방식이 적절합니다.",
        ],
      },
      {
        id: "questions",
        title: "입주 전 확인하면 좋은 질문",
        body: [
          "최근 장기수선계획 조정 여부, 예정된 주요 공사, 적립금 잔액, 최근 수선유지비 변동을 함께 확인하면 숫자를 더 안전하게 읽을 수 있습니다.",
          "공개 데이터 화면은 질문을 정리해 주는 도구입니다. 최종 해석은 관리주체의 공지, 회의록, 장기수선계획 등 원자료 확인과 함께 이뤄져야 합니다.",
        ],
        points: ["최근 계획 조정 여부", "대규모 공사 예정", "적립금 잔액과 월 적립액", "기준월과 출처"],
      },
    ],
  },
];

export const posts: BlogPost[] = [...editorialPosts, ...getGeneratedPosts()].sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
);

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getPostHeadings(post: BlogPost): BlogHeading[] {
  return post.sections.map((section) => ({
    id: section.id,
    level: 2,
    text: section.title,
  }));
}

export function getPostUrls() {
  return posts.map((post) => absoluteUrl(post.canonicalPath));
}
