export type DataState = "normal" | "fallback" | "empty";
export type PositionViz = "bar" | "gauge";

export type ApartmentItem = {
  key: string;
  me: number;
  peer: number;
  unit: string;
};

export type ApartmentDetailData = {
  name: string;
  kaptCode: string;
  slug: string;
  region: {
    sido: string;
    sigungu: string;
    dong: string;
    path: string;
  };
  addr: string;
  meta: {
    households: number;
    heating: string;
    builtYear: number;
    buildings: number;
    area: string;
  };
  baseMonth: string;
  source: string;
  perM2: number;
  peerMedian: number;
  diffPct: number;
  percentile: number;
  peerRank: number;
  peerCount: number;
  peerGroup: {
    sigungu: string;
    heating: string;
    size: string;
    count: number;
    fallbackCount: number;
  };
  items: ApartmentItem[];
  trend: number[];
  trendMonths: string[];
  reserve: {
    perM2: number;
    peerPerM2: number;
    balance: string;
    note: string;
  };
  neighbors: Array<{
    name: string;
    perM2: number;
    households: number;
    heating: string;
  }>;
  guides: Array<{
    tag: string;
    title: string;
    slug: string;
  }>;
};
