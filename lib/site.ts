export const siteConfig = {
  name: "케이아파티",
  tagline: "공동주택 관리비 비교와 점검",
  description:
    "공공데이터와 K-apt 공개자료를 바탕으로 공동주택 관리비, 기준월, 비교군, 항목별 차이를 쉽게 점검하는 정보 서비스입니다.",
  defaultUrl: "https://kapti.kr",
  adsenseClient: "ca-pub-3050601904412736",
  adsTxtLine: "google.com, pub-3050601904412736, DIRECT, f08c47fec0942fa0",
};

export function getSiteUrl() {
  return (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || siteConfig.defaultUrl).replace(/\/$/, "");
}

export function hasConfiguredSiteUrl() {
  return Boolean(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL);
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function getAdsenseClient() {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT || siteConfig.adsenseClient;
}
