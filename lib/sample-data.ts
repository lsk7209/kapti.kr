import type { ApartmentDetailData } from "./types";

export const sampleApartment: ApartmentDetailData = {
  name: "광교 호수마을 한빛아파트",
  kaptCode: "A000001",
  slug: "hanbit-kapt-A000001",
  region: {
    sido: "경기",
    sigungu: "수원시 영통구",
    dong: "이의동",
    path: "gyeonggi-suwon-yeongtong",
  },
  addr: "경기 수원시 영통구 이의동 광교호수로 123",
  meta: {
    households: 1240,
    heating: "지역난방",
    builtYear: 2009,
    buildings: 12,
    area: "84·101·114㎡",
  },
  baseMonth: "2026.04",
  source: "data.go.kr · K-apt",
  perM2: 1820,
  peerMedian: 1540,
  diffPct: 18,
  percentile: 82,
  peerRank: 6,
  peerCount: 32,
  peerGroup: {
    sigungu: "수원시 영통구",
    heating: "지역난방",
    size: "1,000세대+",
    count: 32,
    fallbackCount: 41,
  },
  items: [
    { key: "경비비", me: 612, peer: 470, unit: "원/㎡" },
    { key: "청소비", me: 198, peer: 205, unit: "원/㎡" },
    { key: "승강기 유지비", me: 96, peer: 88, unit: "원/㎡" },
    { key: "수선유지비", me: 340, peer: 286, unit: "원/㎡" },
    { key: "장기수선충당금", me: 410, peer: 372, unit: "원/㎡" },
    { key: "기타 공용", me: 164, peer: 119, unit: "원/㎡" },
  ],
  trend: [1612, 1648, 1690, 1705, 1672, 1640, 1598, 1655, 1712, 1758, 1796, 1820],
  trendMonths: ["'25.05", "06", "07", "08", "09", "10", "11", "12", "'26.01", "02", "03", "04"],
  reserve: {
    perM2: 410,
    peerPerM2: 372,
    balance: "12.4억원",
    note: "최근 12개월 ㎡당 적립액 기준",
  },
  neighbors: [
    { name: "광교 센트럴파크 아파트", perM2: 1610, households: 1008, heating: "지역난방" },
    { name: "광교 마을 호반베르디움", perM2: 1495, households: 1430, heating: "지역난방" },
    { name: "영통 푸른마을 신성아파트", perM2: 1380, households: 980, heating: "개별난방" },
  ],
  guides: [
    { tag: "가이드", title: "관리비 항목 완전정복: 무엇이 ㎡당 단가를 가르나", slug: "/guide/management-fee-items" },
    { tag: "비교", title: "지역난방 vs 개별난방, 관리비는 어떻게 달라질까", slug: "/guide/heating-comparison" },
  ],
};

export function formatNumber(value: number) {
  return value.toLocaleString("ko-KR");
}
