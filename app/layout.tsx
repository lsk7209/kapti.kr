import type { Metadata } from "next";
import "./globals.css";
import { JsonLd } from "@/components/json-ld";
import { ThirdPartyScripts } from "@/components/third-party";
import { absoluteUrl, getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "케이아파티 관리비 비교",
    template: "%s · 케이아파티",
  },
  description: siteConfig.description,
  verification: {
    google: "ssWwtck48YkugOBDprJekJBPgx7c9KJrst9trE7ohSY",
    other: {
      "naver-site-verification": "16a21b2151347dc923e222b88b70e0cbe749189c",
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "케이아파티 관리비 비교",
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "케이아파티 관리비 비교",
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: getSiteUrl(),
    description: siteConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial corrections and privacy questions",
      email: "contact@kapti.kr",
      availableLanguage: "ko-KR",
    },
    sameAs: ["https://www.k-apt.go.kr/", "https://www.data.go.kr/"],
  };
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: getSiteUrl(),
    description: siteConfig.description,
    inLanguage: "ko-KR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/search")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="ko">
      <body>
        <JsonLd data={organizationLd} />
        <JsonLd data={websiteLd} />
        {children}
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
