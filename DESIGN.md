# Design

## Source of Truth
- Status: Active
- Last refreshed: 2026-06-06
- Primary product surfaces: apartment detail page and design-system reference page
- Evidence reviewed: Claude Design handoff bundle, `docs/K-apt_pSEO_5인팀리뷰_개선안.md`

## Brand
- Personality: calm, data-forward, neutral, trustworthy.
- Trust signals: 기준월, 출처, comparison group, normalization unit, and method notes near data blocks.
- Avoid: alarmist red warnings, good/bad labels, investment advice, legal or financial conclusions.

## Product Goals
- Goals: help users understand where a complex's common management fee sits relative to a transparent peer group within one minute.
- Non-goals: judging a complex, recommending purchase/rent decisions, or claiming fee appropriateness.
- Success signals: users can identify the key value, peer median, basis month, source, comparison group, and item drivers quickly.

## Personas and Jobs
- Primary personas: people considering moving or buying, current residents comparing fees.
- User jobs: compare fee level, understand which items differ, check data freshness and source.
- Key contexts of use: mobile search traffic, quick SERP landing, later deeper research.

## Information Architecture
- Primary navigation: search-first header, regional entry, footer legal/method links.
- Core routes/screens: `/apt/[region]/[slug]`, `/design-system`.
- Content hierarchy: identity and metadata, diagnosis card, peer context, item breakdown, trend, conditional context, FAQ, internal links.

## Design Principles
- Neutral evidence first: every data claim should show numbers, context, 기준월, and source.
- Mobile-first scanning: cards and charts should work without horizontal scrolling.
- Tradeoffs: visual emphasis may highlight difference magnitude, but copy must remain factual.

## Visual Language
- Color: off-white/gray base, deep-blue primary, blue-to-amber diverging scale for lower/higher than peers.
- Typography: Pretendard-style Korean sans, tabular numerals for all numeric data.
- Spacing/layout rhythm: compact cards with 4px-based spacing, generous section gaps.
- Shape/radius/elevation: soft cards, light borders, restrained shadows.
- Motion: simple hover/focus feedback only; no distracting motion.
- Imagery/iconography: minimal text/icons for utility and trust, no decorative imagery.

## Components
- Existing components to reuse: header/search, source caption, ad slot, position bar/gauge, item bars, trend chart, FAQ, internal link cards, fallback and empty states.
- New/changed components: production React components ported from the Claude prototype.
- Variants and states: normal data, peer-group fallback, data empty, bar/gauge position visualization.
- Token/component ownership: `app/globals.css` owns tokens; `components/*` owns reusable UI.

## Accessibility
- Target standard: WCAG 2.1 AA intent for contrast, focus, semantics, and keyboard use.
- Keyboard/focus behavior: links, buttons, FAQ toggles, and search input must be keyboard reachable.
- Contrast/readability: avoid color-only meaning; pair color with labels and captions.
- Screen-reader semantics: use headings, landmarks, `aria-expanded`, and descriptive labels.
- Reduced motion and sensory considerations: no required animation.

## Responsive Behavior
- Supported breakpoints/devices: mobile first, tablet, desktop.
- Layout adaptations: detail content stays single-column for readability; desktop widens header and content.
- Touch/hover differences: hover is optional enhancement; touch must reveal core information.

## Interaction States
- Loading: not implemented in sample scaffold.
- Empty: show no-data message and search affordance.
- Error: future data integration should reuse neutral banner pattern.
- Success: normal data state.
- Disabled: buttons are not disabled in current sample.
- Offline/slow network: future data integration should avoid layout shift and preserve reserved ad slots.

## Content Voice
- Tone: factual, calm, specific.
- Terminology: "또래", "비교군", "중앙값", "기준", "출처", "㎡당 공용관리비".
- Microcopy rules: do not use "폭리", "나쁨", "위험", "부족" as judgments; if showing rankings or comparisons, include 기준·산정방식·출처.

## Implementation Constraints
- Framework/styling system: Next.js App Router, TypeScript, CSS custom properties.
- Design-token constraints: use the tokens in `app/globals.css`; do not introduce an unrelated design system.
- Performance constraints: fixed-height ad slots to avoid CLS; charts are SVG/CSS without heavy libraries.
- Compatibility constraints: sample data only; real K-apt ingestion must pass license, normalization, privacy, join, and volume gates first.
- Test/screenshot expectations: build/lint plus desktop/mobile smoke checks for detail and design-system pages.

## Open Questions
- [ ] Confirm public data license type before real monetized deployment / owner: product/legal / impact: hard kill if restricted.
- [ ] Confirm management-fee normalization unit before real comparisons / owner: data / impact: copy and calculations.
- [ ] Define real data pipeline and materialized peer aggregate tables / owner: engineering / impact: scale and freshness.
