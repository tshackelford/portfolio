# Portfolio Site — Design Spec

**Date:** 2026-05-04
**Status:** Draft, pending implementation plan
**Domain:** thomasshackelford.dev

## Overview

Personal portfolio for Thomas Shackelford — Senior Software Engineer based in Lakewood, CA. Three overlapping purposes:

1. **Active job-search artifact** for recruiters and hiring managers in the near term.
2. **Long-lived professional presence** maintained for years, not tied to any one search.
3. **Reflection of personality** — travel, gardening, camping. Not a sterile "techy" portfolio.

Aesthetic direction: WPA / national-parks heritage. Quiet, warm, vector-poster mood. Southwest / "high desert" palette: terra cotta, dusty sage, warm sand. Bold serif display + humanist sans body. Subtle layered illustrations and gentle parallax — never scroll-jacking.

## Stack (locked)

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind v4** (CSS-vars-driven `@theme` block)
- **`motion`** (the active fork of Framer Motion) for animation
- **Vercel** (host; preview URL per branch; `main` → production)
- **Static Generation only.** No server runtime, no APIs, no client-only routes, no database, no CMS.

## Information Architecture

Four routes. All SSG. No dynamic routes. No drill-in detail pages.

| Route | Purpose |
|-------|---------|
| `/`         | Scroll-anchored landing: hero, intro, three callouts, footer |
| `/about`    | Personality-forward bio + tiny "Where I've been" career snapshot |
| `/projects` | All three project entries on one page |
| `/contact`  | GitHub, LinkedIn, email — no form, no resume |

Explicitly omitted: individual project routes, `/resume` route, blog, CMS, contact form.

## Visual System

### Color tokens (semantic naming)

Defined once in `app/globals.css` `@theme` block. Components use semantic utilities (`bg-mesa`, `text-canyon`); no magic hex values.

```css
@theme {
  --color-canyon: #8c3e28;   /* deepest clay — emphasis text, primary CTA */
  --color-mesa:   #b76346;   /* terra cotta — accents, link underlines */
  --color-sage:   #7a8a5e;   /* secondary accent, tags */
  --color-sun:    #e8b582;   /* highlights, hover states */
  --color-sand:   #f3d8c2;   /* page background base */
  --color-bone:   #fff5e8;   /* cards, surfaces */
  --color-ink:    #2a2118;   /* body text */
  --color-dust:   #6f5d4a;   /* muted text, captions */
}
```

Every text/background pair must be verified WCAG 2.2 AA (4.5:1 body, 3:1 large) at lock-in. Verification table to be produced as part of the implementation plan.

### Typography

- **Display:** Fraunces (variable serif, weights 600 / 800, optical-size axis driven for headlines)
- **Body:** Work Sans (humanist sans, weights 400 / 600)
- **Loaded via** `next/font/google` — self-hosted, preloaded, `font-display: swap` with `size-adjust` to eliminate layout shift
- **Type scale (rem):** 0.875 / 1 / 1.125 / 1.25 / 1.5 / 2 / 2.75 / 4

### Illustration system

- Inline SVG components in `components/illustrations/`. Building blocks only — `<Mesa>`, `<Ridge>`, `<Sun>`, `<Juniper>`, `<Cliff>`, `<Cactus>`, `<Strata>`.
- **Compositional, not bespoke per page.** Each route's header scene composes the same kit at different scales/positions/colors. Color attributes route through `currentColor` or CSS vars so palette retunes propagate automatically.
- Inline (not `<img>`) so transforms apply for parallax and palette tokens flow.

### Spacing & rhythm

- 8px base unit.
- Section vertical padding: `py-24` desktop, `py-16` mobile. Generous margins are part of the parks-poster aesthetic.
- Max content widths: 72ch (prose), 1280px (full-bleed sections).

## Page Composition

### `/` Home

1. **Hero (full viewport).** Layered illustrated scene — sun, deep canyon-green ridges (back), terra-cotta mesas (mid), sand foreground. Parallax-ready (see §Motion budget).
   - Centered: name in Fraunces 800; eyebrow `Senior Software Engineer · Lakewood, CA`; one-sentence positioning line; two CTAs (`See projects`, `About me`).
2. **Intro band** — three sentences in the user's voice. Mentions 13+ years and fintech focus exactly once. No bullet list, no skills strip.
3. **Three callout cards** (About / Projects / Contact). Each: small illustrated icon (juniper / strata / campfire), 1-line teaser, link to route.
4. **Footer** — © 2026 Thomas Shackelford · GitHub · LinkedIn · Email.

### `/about`

1. **Page header band** — small variant of the hero scene (sun + ridge silhouette).
2. **Professional bit** — 2–3 conversational paragraphs. Tone: honest, voice-led; emphasizes craft, accessibility, mentorship. Includes "Lakewood, CA" callout.
3. **Where I've been** — two career cards side-by-side:
   - Trabian (2021–2026) — role + dates + one-line summary
   - Q2 Software (2011–2021) — role + dates + one-line summary
   - No bullets, no detail dump. Resume PDF is the canonical detailed source (kept off-site).
4. **Personal bit** — equal real estate to the professional bit. Three short paragraphs (Travel / Gardening / Camping), each with a small illustrated motif. This is the "personality" payoff that makes the site feel like a person, not a CV.

### `/projects`

1. **Page header band.**
2. **Three entries**, stacked vertically with generous spacing:
   - **Drupal Sites** (10+ years cluster). Single cluster-level summary paragraph. Tech tags. Then a **horizontal-strip thumbnail "film roll"** as supporting evidence. See §Drupal interaction below.
   - **Q2 SDK Work**. Anonymized capability list — M2M transfers, FX wires, B2B API, prepaid cards, third-party chat integrations, SSOs. Tech tags (React, TypeScript, Tailwind, Python). No client names, no live links.
   - **Road Trip Planner**. Personal AI experiment. Image set, summary, live link.

### `/contact`

1. **Page header band.**
2. Three large illustrated cards: GitHub, LinkedIn, Email.
3. Optional one-line context above the cards.

## Drupal Cluster Interaction

The Drupal entry is a single project at the page level — *not* eight individual projects. The thumbnail strip is supporting evidence of breadth, not a navigation surface.

**Layout:** horizontal strip of homepage thumbnails (the "film roll" pattern). Touch-scrollable on mobile, hoverable on desktop, keyboard-arrow navigable.

**Per-thumb behavior:**

```ts
type DrupalSite = {
  name: string;
  thumbnail: string;       // path to a WebP in public/projects/drupal/
  liveUrl?: string;        // optional — if present, thumb is a link to the live site (new tab)
  note?: string;           // optional — one-line on hover (e.g. "Custom modules + migration")
};
```

- `liveUrl` present → render as `<a href target="_blank" rel="noopener noreferrer">`. Opens the live site for verification.
- `liveUrl` absent → render as inert `<figure>`. Still hoverable for label, just not clickable.
- **No per-site detail page on the portfolio.** Recruiters who want to verify the work can click out; no curated case studies to maintain.

**Hover behavior:** active thumb scales to ~1.12, siblings dim to 55% opacity. CSS only, no JS animation. Reduced-motion gracefully degrades to no-op.

## Motion Budget (complete list)

Anything not listed here, we don't build.

1. **Home hero parallax.** Sun, ridges, mesas, foreground move at different rates as the user scrolls the hero into view. Stops when hero exits viewport. **Background-layer parallax only — never intercepts user scroll input.**
2. **Route transition.** Content panel fades + slides up ~8px on route change (~250ms ease-out). Header/footer pinned.
3. **Section reveal.** Top-level `<section>` elements (the h2-anchored blocks on each page — intro band, callout cards, career snapshot, personal topics, project entries) fade + slide-up ~12px when 20% in viewport (`IntersectionObserver`). One-shot per session. Applies only to top-level sections, not nested elements.
4. **Hover/focus transitions.** Cards/links: 150–200ms opacity/transform. CSS only.
5. **Drupal strip.** Thumb hover scale 1.12, siblings dim 55%. CSS only.
6. **Focus indicator.** 2px outline in `--color-canyon`, animated in (~100ms).

**Reduced-motion contract:** at the top of `app/globals.css`, a single `@media (prefers-reduced-motion: reduce)` block disables all transforms, transitions, and parallax globally. Replaced with instant-state appearance — no fade, no slide, no parallax. Every motion above degrades cleanly.

## Accessibility (WCAG 2.2 AA target)

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`. One `<h1>` per route. Logical heading order.
- Color contrast verified at design-token lock; verification table produced as part of implementation plan.
- Keyboard parity: every hover affordance has a focus equivalent. Tab order matches visual order. Drupal strip uses **roving tabindex** so arrow keys move within the strip but Tab moves past it.
- Visible focus ring on every interactive element (the 2px canyon outline above). Never `outline: none` without replacement.
- Skip-to-content link in root layout.
- `alt` text required on every meaningful image; typed in `content/projects.ts`. Decorative SVG illustrations marked `aria-hidden="true"`.
- Forms: none. Contact links are `mailto:` and external `<a>`s.
- **Verification:**
  - `axe-core` runs in CI on every route via Playwright.
  - Manual keyboard-only walkthrough before each merge to `main`.
  - Lighthouse a11y score must be 100 on production deploys (CI gate).

## Performance Budget

- **Lighthouse 95+** across all four routes; **a11y 100** as a CI gate.
- LCP < 1.5s, CLS < 0.1, INP < 100ms on a throttled 4G profile.
- **Initial JS budget:** ~100KB gzipped — total of shared chunks + first-route page JS for a cold first-page load. Bundle analyzed via `@next/bundle-analyzer`; CI fails on growth past budget.
- **Images:** `next/image` with explicit width/height (no CLS). **WebP only.** Below-fold images lazy-loaded by default.
- **Fonts:** `next/font/google` self-hosted, preloaded, `font-display: swap` with `size-adjust`.
- **Third-party scripts:** none at launch. Analytics added behind an env var (see §Analytics).

## Content Data Shapes (locked)

```ts
// content/projects.ts
type ProjectImage = { src: string; alt: string; width: number; height: number };
type Link = { label: string; href: string };
type DrupalSite = { name: string; thumbnail: string; liveUrl?: string; note?: string };

type Project = {
  id: 'drupal-cluster' | 'q2-sdk' | 'road-trip-planner';
  title: string;
  role: string;
  timeframe: string;
  summary: string;
  tags: string[];
  images: ProjectImage[];
  links: Link[];
  detail?:
    | { kind: 'drupal'; sites: DrupalSite[] }
    | { kind: 'capabilities'; capabilities: string[] }   // Q2 SDK list
    | { kind: 'simple' };                                // Road Trip Planner
};

// content/career.ts
type CareerEntry = {
  company: string;
  role: string;
  start: string;       // ISO yyyy-mm
  end: string;         // ISO yyyy-mm or 'present'
  oneLine: string;
};

// content/personal.ts
type PersonalTopic = {
  id: 'travel' | 'gardening' | 'camping';
  title: string;
  body: string;
};
```

Adding/editing content = editing one of these arrays. Fully type-checked, refactor-safe. No magic strings.

## Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx              # Root: shell, fonts, theme
│   ├── page.tsx                # /
│   ├── about/page.tsx
│   ├── projects/page.tsx
│   ├── contact/page.tsx
│   ├── globals.css             # Tailwind import + @theme block
│   └── opengraph-image.tsx     # OG image generator
├── components/
│   ├── shell/                  # Nav, Footer, ThemedFrame
│   ├── illustrations/          # SVG building blocks
│   ├── motion/                 # ParallaxLayer, FadeReveal wrappers
│   └── projects/               # ProjectCard, DrupalStrip, etc.
├── content/
│   ├── projects.ts
│   ├── career.ts
│   └── personal.ts
├── lib/
│   └── motion-config.ts        # Reduced-motion-aware helpers
├── public/
│   └── projects/               # Manually-dropped WebP screenshots
├── docs/
│   └── plans/                  # Spec + implementation plan
└── tests/
    ├── e2e/                    # Playwright + axe
    └── unit/                   # Vitest
```

**Conventions**

- Visual tokens defined once in `globals.css` `@theme`. No magic hex in components.
- Content lives in `content/*.ts`. Components import from there. Edits to content never touch component code.
- Project images: dropped manually into `public/projects/<slug>/` as WebP and referenced by path in `content/projects.ts`. No build-time generator.

## Analytics

- `<Analytics>` component in root layout, no-op when `NEXT_PUBLIC_GTM_ID` is unset.
- When the env var is set on Vercel, renders the GTM snippet via `next/third-parties/google` (typed, lazy-loaded).
- **No cookies stored** at any point — therefore no consent banner.
- **Note for launch:** consider Plausible or Vercel Analytics over GA4 to keep the no-banner property permanent regardless of regulation drift.

## Testing

Pragmatic, not exhaustive. For a static portfolio, exhaustive coverage is busywork.

- **TypeScript strict** — most static-portfolio bugs caught at compile.
- **Vitest** unit tests for the few logic-bearing helpers: motion gating, content selectors, Drupal strip keyboard navigation.
- **Playwright** + **`@axe-core/playwright`**: route-by-route smoke + accessibility scan + keyboard walkthrough on the Drupal strip. Runs in CI on every PR.
- **Lighthouse CI** snapshots (`@lhci/cli`) gate merges to `main` on Lighthouse 95+ / a11y 100.

No coverage target.

## Deployment / CI

- **Vercel** project linked to the GitHub repo.
- Every push → preview deployment URL with the branch name.
- `main` branch → production: `thomasshackelford.dev` (apex + www; redirect direction decided at DNS time).
- **GitHub Actions** runs in parallel: typecheck / ESLint / Vitest / Playwright + axe / Lighthouse CI / bundle-size check. PR can't merge if any fail.

## Out of Scope (explicit non-goals)

- No CMS / admin UI
- No blog (architecture leaves room to add later as `/notes` if desired)
- No contact form / email API
- No resume on site (PDF or rendered)
- No dark mode
- No internationalization
- No comments / social embeds
- No client-only routes — all SSG
- No third-party scripts at launch (analytics deferred)

## Open Questions (deferred to implementation plan)

- DNS redirect direction (apex → www or www → apex)
- Whether Plausible / Vercel Analytics replaces GA4 by launch
- Final per-route header-band variants (sun position, ridge composition) — settled visually during implementation
- Exact content copy for Home intro, About sections, project summaries — drafted during build with user review
