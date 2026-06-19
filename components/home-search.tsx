"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SearchItem = {
  type: "apt" | "region";
  name: string;
  region: string;
  sub?: string;
  href: string;
};

const directory: SearchItem[] = [
  {
    type: "apt",
    name: "광교 호수마을 한빛아파트",
    region: "경기 수원시 영통구",
    sub: "1,240세대 · 지역난방",
    href: "/apt/gyeonggi-suwon-yeongtong/hanbit-kapt-A000001",
  },
  {
    type: "apt",
    name: "광교 센트럴파크 아파트",
    region: "경기 수원시 영통구",
    sub: "1,008세대 · 지역난방",
    href: "/apt/gyeonggi-suwon-yeongtong/hanbit-kapt-A000001",
  },
  {
    type: "apt",
    name: "동탄 린스트라우스",
    region: "경기 화성시",
    sub: "1,560세대 · 지역난방",
    href: "/apt/gyeonggi-suwon-yeongtong/hanbit-kapt-A000001",
  },
  {
    type: "apt",
    name: "송도 더샵 센트럴파크",
    region: "인천 연수구",
    sub: "1,820세대 · 지역난방",
    href: "/apt/gyeonggi-suwon-yeongtong/hanbit-kapt-A000001",
  },
  {
    type: "region",
    name: "수원시 영통구",
    region: "지역 전체 단지 보기",
    href: "/apt/gyeonggi-suwon-yeongtong/hanbit-kapt-A000001",
  },
  {
    type: "region",
    name: "화성시",
    region: "지역 전체 단지 보기",
    href: "/apt/gyeonggi-suwon-yeongtong/hanbit-kapt-A000001",
  },
];

const recentSeed: SearchItem[] = [
  {
    type: "apt",
    name: "광교 센트럴파크 아파트",
    region: "경기 수원시 영통구",
    sub: "1,008세대 · 지역난방",
    href: "/apt/gyeonggi-suwon-yeongtong/hanbit-kapt-A000001",
  },
  {
    type: "apt",
    name: "동탄 린스트라우스",
    region: "경기 화성시",
    sub: "1,560세대 · 지역난방",
    href: "/apt/gyeonggi-suwon-yeongtong/hanbit-kapt-A000001",
  },
];

const storageKey = "kapt_recent_v1";

function iconFor(type: SearchItem["type"]) {
  return type === "region" ? "⌖" : "⌂";
}

export function HomeSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<SearchItem[]>(() => {
    if (typeof window === "undefined") {
      return recentSeed;
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as SearchItem[]) : recentSeed;
    } catch {
      return recentSeed;
    }
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        window.localStorage.setItem(storageKey, JSON.stringify(recentSeed));
      }
    } catch {
      // localStorage can be unavailable in hardened browser modes.
    }
  }, []);

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return {
        groups: [
          { label: "최근 본 단지", items: recent.slice(0, 3) },
          { label: "추천 검색", items: directory.slice(0, 3) },
        ].filter((group) => group.items.length > 0),
        empty: false,
      };
    }

    const hits = directory.filter((item) =>
      `${item.name} ${item.region} ${item.sub ?? ""}`.toLowerCase().includes(normalized)
    );
    return { groups: [{ label: "검색 결과", items: hits }], empty: hits.length === 0 };
  }, [query, recent]);

  function clearRecent() {
    window.localStorage.removeItem(storageKey);
    setRecent([]);
  }

  return (
    <div className={`home-search ${open ? "is-open" : ""}`}>
      <svg className="search-ic" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input
        aria-label="단지명 또는 지역으로 검색"
        autoComplete="off"
        placeholder="단지명 또는 지역으로 검색"
        value={query}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      <div className="home-suggest">
        {suggestions.empty ? (
          <>
            <div className="sg-head">검색 결과 없음</div>
            <div className="sg-empty">다른 단지명이나 지역으로 검색해 보세요.</div>
          </>
        ) : (
          suggestions.groups.map((group) => (
            <div key={group.label}>
              <div className="sg-head">
                {group.label}
                {group.label === "최근 본 단지" ? (
                  <button type="button" onClick={clearRecent}>
                    지우기
                  </button>
                ) : null}
              </div>
              {group.items.map((item) => (
                <Link className="sg-item" href={item.href} key={`${group.label}-${item.name}`}>
                  <span className="sg-ic" aria-hidden="true">
                    {iconFor(item.type)}
                  </span>
                  <span>
                    <span className="sg-t">{item.name}</span>
                    <span className="sg-s">
                      {item.region}
                      {item.sub ? ` · ${item.sub}` : ""}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
