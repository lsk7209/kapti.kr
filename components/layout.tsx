import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site";

type HeaderActive = "home" | "region" | "guide" | "learn" | "blog" | "design" | "about";

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
