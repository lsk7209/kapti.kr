"use client";

import { useState } from "react";
import Link from "next/link";
import type { ApartmentItem } from "@/lib/types";
import { formatNumber, sampleApartment } from "@/lib/sample-data";
import { SearchBox } from "./layout";

export function SourceCap({
  children,
  month = sampleApartment.baseMonth,
  src = sampleApartment.source,
}: {
  children?: React.ReactNode;
  month?: string;
  src?: string;
}) {
  return (
    <div className="cap">
      {children ? (
        <>
          {children}
          <span className="source-dot" />
        </>
      ) : null}
      기준: {month}
      <span className="source-dot" />
      출처: {src}
    </div>
  );
}

export function AdSlot({ height = 90, note }: { height?: number; note?: string }) {
  return (
    <div style={{ minHeight: height }}>
      <div className="adslot" style={{ height }}>
        <span>광고</span>
      </div>
      {note ? <div className="adslot-note">{note}</div> : null}
    </div>
  );
}

export function PositionBar({
  percentile,
  rank,
  count,
}: {
  percentile: number;
  rank: number;
  count: number;
}) {
  return (
    <div className="posbar">
      <div className="posbar-track">
        <div className="posbar-tick" style={{ left: "50%" }} />
        <div className="posbar-marker" style={{ left: `${percentile}%` }}>
          <div className="posbar-flag">상위 {100 - percentile}%</div>
        </div>
      </div>
      <div className="posbar-scale">
        <span>낮음</span>
        <span>또래 중앙값</span>
        <span>높음</span>
      </div>
      <div className="cap" style={{ marginTop: 8 }}>
        같은 비교군 {count}곳 중 <b>{rank}위 수준</b>
      </div>
    </div>
  );
}

export function PositionGauge({
  percentile,
  rank,
  count,
}: {
  percentile: number;
  rank: number;
  count: number;
}) {
  const r = 86;
  const cx = 100;
  const cy = 96;
  const sw = 16;
  const start = Math.PI;
  const end = 0;
  const angle = start + (end - start) * (percentile / 100);
  const px = cx + r * Math.cos(angle);
  const py = cy + r * Math.sin(angle);
  const arc = (from: number, to: number) => {
    const f = start + (end - start) * from;
    const t = start + (end - start) * to;
    const x0 = cx + r * Math.cos(f);
    const y0 = cy + r * Math.sin(f);
    const x1 = cx + r * Math.cos(t);
    const y1 = cy + r * Math.sin(t);
    return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
  };

  return (
    <div className="gauge">
      <svg viewBox="0 0 200 116" width="100%" style={{ maxWidth: 240, display: "block", margin: "0 auto" }} aria-hidden="true">
        <path d={arc(0, 1)} fill="none" stroke="var(--surface-3)" strokeWidth={sw} strokeLinecap="round" />
        <path d={arc(0, 0.42)} fill="none" stroke="var(--below)" strokeWidth={sw} strokeLinecap="round" opacity="0.55" />
        <path d={arc(0.58, 1)} fill="none" stroke="var(--above)" strokeWidth={sw} strokeLinecap="round" opacity="0.85" />
        <line x1={cx} y1={cy} x2={px} y2={py} stroke="var(--ink-900)" strokeWidth="3" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="6" fill="var(--ink-900)" />
        <circle cx={px} cy={py} r="5" fill="#fff" stroke="var(--ink-900)" strokeWidth="2.5" />
      </svg>
      <div className="gauge-read">
        <div className="gauge-big tnum">상위 {100 - percentile}%</div>
        <div className="cap">
          같은 비교군 {count}곳 중 {rank}위 수준
        </div>
      </div>
    </div>
  );
}

export function ItemBars({ items }: { items: ApartmentItem[] }) {
  const maxAbs = Math.max(...items.map((item) => Math.abs((item.me - item.peer) / item.peer))) || 1;
  return (
    <div className="itembars">
      {items.map((item) => {
        const diff = (item.me - item.peer) / item.peer;
        const above = diff >= 0;
        const width = (Math.abs(diff) / maxAbs) * 48;
        const diffWon = item.me - item.peer;
        const notable = Math.abs(diff) >= 0.12;
        return (
          <div className="ib-row" key={item.key}>
            <div className="ib-head">
              <div className="ib-name">
                {item.key}
                {notable ? (
                  <span className={`badge ${above ? "badge--above" : "badge--below"}`} style={{ marginLeft: 8 }}>
                    또래보다 {above ? "높음" : "낮음"}
                  </span>
                ) : null}
              </div>
              <div className="ib-vals tnum">
                <span className="ib-me">{formatNumber(item.me)}</span>
                <span className="ib-peer">또래 {formatNumber(item.peer)}</span>
              </div>
            </div>
            <div className="ib-track">
              <div className="ib-center" />
              <div
                className={`ib-fill ${above ? "ib-fill--above" : "ib-fill--below"}`}
                style={above ? { left: "50%", width: `${width}%` } : { right: "50%", width: `${width}%` }}
              />
            </div>
            {notable ? (
              <div className="ib-fact">
                또래 평균보다 ㎡당 <b className="tnum">{formatNumber(Math.abs(diffWon))}원</b> {above ? "높습니다" : "낮습니다"}
                <span className="tnum" style={{ color: "var(--ink-400)" }}>
                  {" "}
                  ({above ? "+" : "-"}
                  {Math.round(Math.abs(diff) * 100)}%)
                </span>
              </div>
            ) : null}
          </div>
        );
      })}
      <div className="cap" style={{ marginTop: 14 }}>
        단위: 원/㎡ · 또래 = 비교군 평균 · 기준 {sampleApartment.baseMonth}
      </div>
    </div>
  );
}

export function TrendChart({ data, months }: { data: number[]; months: string[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 560;
  const height = 150;
  const padX = 6;
  const padY = 18;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const x = (index: number) => padX + (index * (width - padX * 2)) / (data.length - 1);
  const y = (value: number) => padY + (1 - (value - min) / span) * (height - padY * 2);
  const line = data.map((value, index) => `${x(index)},${y(value)}`).join(" ");
  const area = `${x(0)},${height} ${line} ${x(data.length - 1)},${height}`;

  return (
    <div className="trend">
      <div className="trend-svgwrap">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          style={{ height, display: "block" }}
          preserveAspectRatio="none"
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const pointerX = ((event.clientX - rect.left) / rect.width) * width;
            const idx = Math.round(((pointerX - padX) / (width - padX * 2)) * (data.length - 1));
            setHover(Math.max(0, Math.min(data.length - 1, idx)));
          }}
          onMouseLeave={() => setHover(null)}
          aria-label="최근 12개월 ㎡당 공용관리비 추이"
        >
          <defs>
            <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1B4DDB" stopOpacity="0.16" />
              <stop offset="1" stopColor="#1B4DDB" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={area} fill="url(#trendArea)" />
          <polyline points={line} fill="none" stroke="#1B4DDB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {hover !== null ? (
            <line x1={x(hover)} y1={padY - 6} x2={x(hover)} y2={height} stroke="#AAB6CC" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
          ) : null}
          {data.map((value, index) => (
            <circle
              key={`${months[index]}-${value}`}
              cx={x(index)}
              cy={y(value)}
              r={hover === index ? 5 : index === data.length - 1 ? 4 : 0}
              fill={hover === index ? "#102C7A" : "#1B4DDB"}
              stroke="#fff"
              strokeWidth={hover === index ? 2 : 0}
            />
          ))}
        </svg>
        {hover !== null ? (
          <div className="trend-tip tnum" style={{ left: `${(x(hover) / width) * 100}%` }}>
            <div className="trend-tip-m">{months[hover]}</div>
            <div className="trend-tip-v">
              {formatNumber(data[hover])}
              <small>원/㎡</small>
            </div>
          </div>
        ) : null}
      </div>
      <div className="trend-axis tnum">
        <span>{months[0]}</span>
        <span>{months[months.length - 1]}</span>
      </div>
      <SourceCap>최근 12개월 · 단위 원/㎡</SourceCap>
    </div>
  );
}

export function FAQ({
  items,
}: {
  items: Array<{
    q: string;
    a: string;
  }>;
}) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {items.map((item, index) => (
        <div className={`faq-item ${open === index ? "is-open" : ""}`} key={item.q}>
          <button className="faq-q" type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)}>
            <span>{item.q}</span>
            <i className="faq-caret" aria-hidden="true" />
          </button>
          <div className="faq-a-wrap">
            <div className="faq-a">{item.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="empty">
      <div className="empty-ic" aria-hidden="true">
        ◷
      </div>
      <div className="empty-t">아직 비교할 관리비 데이터가 없어요</div>
      <div className="empty-d">
        이 단지의 공개 관리비 정보가 확인되면 또래 비교·진단을 제공합니다.
        <br />
        공개되는 대로 자동 업데이트됩니다.
      </div>
      <div className="empty-search">
        <SearchBox compact />
      </div>
      <div style={{ marginTop: 18 }}>
        <SourceCap>최종 확인</SourceCap>
      </div>
    </div>
  );
}

export function NeighborCard({
  name,
  perM2,
  households,
  heating,
}: {
  name: string;
  perM2: number;
  households: number;
  heating: string;
}) {
  return (
    <Link className="ilink" href="/apt/gyeonggi-suwon-yeongtong/hanbit-kapt-A000001">
      <div className="ilink-body">
        <div className="ilink-t">{name}</div>
        <div className="ilink-s tnum">
          {formatNumber(perM2)}원/㎡ · {formatNumber(households)}세대 · {heating}
        </div>
      </div>
      <div className="ilink-arr">→</div>
    </Link>
  );
}
