# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the static portfolio site at `thomasshackelford.dev` per `docs/plans/2026-05-04-portfolio-design.md`, deployed to Vercel.

**Architecture:** Next.js 16 App Router with static generation only. Tailwind v4 token-driven theme. Inline-SVG illustration kit composed per route. Motion library wrappers gated globally by `prefers-reduced-motion`. Content lives in typed `content/*.ts` modules; pages and components import from there.

**Tech Stack:** Next.js 16, React 19, TypeScript (strict), Tailwind v4, motion, Vitest, Playwright + @axe-core/playwright, Lighthouse CI, GitHub Actions, Vercel.

**Branch:** Work on a `build` branch off `design`. Commit after each task. Never commit directly to `main`.

**Reference spec:** `docs/plans/2026-05-04-portfolio-design.md` — single source of truth for IA, palette tokens, type, motion budget, accessibility targets, performance budget, and content shapes.

---

## File Structure (target)

```
portfolio/
├── app/
│   ├── layout.tsx              # Root: header, footer, fonts, theme
│   ├── page.tsx                # /
│   ├── about/page.tsx
│   ├── projects/page.tsx
│   ├── contact/page.tsx
│   ├── globals.css             # Tailwind v4 import + @theme + reduced-motion
│   ├── opengraph-image.tsx     # OG image generator
│   ├── not-found.tsx
│   └── icon.tsx                # favicon
├── components/
│   ├── shell/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SkipLink.tsx
│   │   └── Analytics.tsx       # GTM no-op shell
│   ├── illustrations/
│   │   ├── Sun.tsx
│   │   ├── Ridge.tsx
│   │   ├── Mesa.tsx
│   │   ├── Cliff.tsx
│   │   ├── Juniper.tsx
│   │   ├── Cactus.tsx
│   │   ├── Strata.tsx
│   │   ├── Campfire.tsx
│   │   ├── Compass.tsx
│   │   └── Sprout.tsx
│   ├── motion/
│   │   ├── ParallaxLayer.tsx   # Wrapper for parallax-driven SVG layers
│   │   └── FadeReveal.tsx      # Section reveal on intersection
│   └── projects/
│       ├── ProjectEntry.tsx    # Shared shell for each entry
│       ├── DrupalStrip.tsx     # Horizontal thumbnail strip + roving tabindex
│       └── CapabilitiesList.tsx# Q2 SDK capabilities
├── content/
│   ├── projects.ts             # Typed Project[] with seed data
│   ├── career.ts               # CareerEntry[]
│   ├── personal.ts             # Hero copy + PersonalTopic[]
│   └── meta.ts                 # Site metadata (title, description, URL)
├── lib/
│   ├── motion-config.ts        # Reduced-motion-aware helper
│   └── routes.ts               # Centralized route table
├── public/
│   ├── projects/               # WebP screenshots dropped manually
│   └── resume.pdf              # NOT used — out of scope
├── tests/
│   ├── e2e/
│   │   ├── home.spec.ts
│   │   ├── about.spec.ts
│   │   ├── projects.spec.ts
│   │   ├── contact.spec.ts
│   │   └── a11y.spec.ts
│   └── unit/
│       ├── motion-config.test.ts
│       └── drupal-strip.test.tsx
├── docs/
│   └── plans/                  # Already exists with spec
├── .github/
│   └── workflows/
│       └── ci.yml
├── lighthouserc.cjs
├── playwright.config.ts
├── vitest.config.ts
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── package.json
└── .gitignore                  # Already exists
```

---

## Phase 0: Branch Prep

### Task 0: Create build branch

**Files:** none

- [ ] **Step 1:** Verify clean working tree on `design` branch.

```bash
git status
```

Expected: `nothing to commit, working tree clean` on `design` branch with the spec committed.

- [ ] **Step 2:** Create `build` branch off `design`.

```bash
git checkout -b build
```

Expected: `Switched to a new branch 'build'`

---

## Phase 1: Foundation

### Task 1: Bootstrap Next.js 16 project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `postcss.config.mjs`, `eslint.config.mjs`

Note: `create-next-app` will scaffold most of these. We then trim to our shape.

- [ ] **Step 1:** Initialize Next.js into the current (non-empty) directory. The `--use-npm` flag is explicit; pick whichever package manager you prefer but use it consistently.

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --src-dir=false \
  --import-alias="@/*" \
  --turbopack \
  --use-npm \
  --no-git
```

Answer "Yes" if prompted to overwrite existing files. The `.gitignore`, `docs/`, and the existing git history should remain.

- [ ] **Step 2:** Verify the project starts.

```bash
npm run dev
```

Expected: dev server starts on http://localhost:3000 with the default Next.js page. Stop with Ctrl-C.

- [ ] **Step 3:** Tighten `tsconfig.json` to strict mode. Confirm these compiler options are present (add or set):

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": false
  }
}
```

- [ ] **Step 4:** Run typecheck to confirm no errors after tightening.

```bash
npx tsc --noEmit
```

Expected: no output (success).

- [ ] **Step 5:** Commit.

```bash
git add -A
git commit -m "Bootstrap Next.js 16 project"
```

---

### Task 2: Configure Tailwind v4 theme tokens + reduced-motion contract

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1:** Replace the contents of `app/globals.css` with the theme block, base styles, and reduced-motion contract.

```css
@import "tailwindcss";

@theme {
  --color-canyon: #8c3e28;
  --color-mesa:   #b76346;
  --color-sage:   #7a8a5e;
  --color-sun:    #e8b582;
  --color-sand:   #f3d8c2;
  --color-bone:   #fff5e8;
  --color-ink:    #2a2118;
  --color-dust:   #6f5d4a;

  --font-display: var(--font-fraunces);
  --font-body:    var(--font-work-sans);
}

:root {
  color-scheme: light;
}

html, body {
  background: var(--color-sand);
  color: var(--color-ink);
  font-family: var(--font-body), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Focus ring (canyon, 2px). Never remove without replacement. */
:focus-visible {
  outline: 2px solid var(--color-canyon);
  outline-offset: 2px;
  border-radius: 2px;
  transition: outline-offset 100ms ease-out;
}

/* Skip link styling */
.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: var(--color-canyon);
  color: var(--color-bone);
  padding: 0.75rem 1.25rem;
  z-index: 100;
  transition: top 150ms ease-out;
}
.skip-link:focus {
  top: 0;
}

/* Reduced-motion contract — disables ALL animation across the site. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2:** Run dev to confirm theme compiles.

```bash
npm run dev
```

Expected: page background is now sand (`#f3d8c2`). Stop server.

- [ ] **Step 3:** Commit.

```bash
git add app/globals.css
git commit -m "Add Tailwind v4 theme tokens and reduced-motion contract"
```

---

### Task 3: Configure next/font for Fraunces and Work Sans

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1:** Replace `app/layout.tsx` with font wiring.

```tsx
import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  weight: ["600", "800"],
  axes: ["opsz"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Thomas Shackelford — Senior Software Engineer",
  description:
    "Senior software engineer in Lakewood, CA. Thirteen years building accessible, high-performance web applications for fintech.",
  metadataBase: new URL("https://thomasshackelford.dev"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2:** Replace `app/page.tsx` with a placeholder so the dev server renders.

```tsx
export default function Home() {
  return (
    <main style={{ padding: "4rem", fontFamily: "var(--font-display)" }}>
      <h1 style={{ fontSize: "3rem", fontWeight: 800 }}>
        Thomas Shackelford
      </h1>
      <p style={{ fontFamily: "var(--font-body)" }}>
        Senior Software Engineer · Lakewood, CA
      </p>
    </main>
  );
}
```

- [ ] **Step 3:** Run dev. Confirm Fraunces renders the heading and Work Sans the paragraph.

```bash
npm run dev
```

Open http://localhost:3000. Stop server.

- [ ] **Step 4:** Commit.

```bash
git add app/layout.tsx app/page.tsx
git commit -m "Wire Fraunces and Work Sans via next/font"
```

---

### Task 4: Create content type modules with seed data

**Files:**
- Create: `content/projects.ts`, `content/career.ts`, `content/personal.ts`, `content/meta.ts`

- [ ] **Step 1:** Create `content/meta.ts`.

```ts
export const siteMeta = {
  name: "Thomas Shackelford",
  title: "Thomas Shackelford — Senior Software Engineer",
  description:
    "Senior software engineer in Lakewood, CA. Thirteen years building accessible, high-performance web applications for fintech.",
  url: "https://thomasshackelford.dev",
  location: "Lakewood, CA",
  role: "Senior Software Engineer",
} as const;
```

- [ ] **Step 2:** Create `content/personal.ts`.

```ts
export type PersonalTopic = {
  id: "travel" | "gardening" | "camping";
  title: string;
  body: string;
};

export const heroTagline =
  "Quietly building accessible, high-performance web applications. Thirteen years in fintech and counting.";

export const aboutBody = [
  "I've spent thirteen years building software for financial institutions — the kind of work where small details matter to a lot of people. Lately I'm focused on React and TypeScript, design systems, and the quiet craft of making complex tools feel obvious.",
  "I care about accessibility, mentorship, and writing code that the next person can change without fear. I've led documentation initiatives, mentored junior engineers, and worked closely with designers and product partners to ship work I'm proud of.",
];

export const personalTopics: PersonalTopic[] = [
  {
    id: "travel",
    title: "Travel",
    body: "I keep a running list of places I want to see and slowly cross them off. Mountains, deserts, and the long drives in between are usually involved.",
  },
  {
    id: "gardening",
    title: "Gardening",
    body: "A backyard project that became a habit. I like the patience of it, and the small wins of something growing because you paid attention.",
  },
  {
    id: "camping",
    title: "Camping",
    body: "Tents, fires, no cell service. The kind of weekend that makes Monday feel survivable.",
  },
];
```

- [ ] **Step 3:** Create `content/career.ts`.

```ts
export type CareerEntry = {
  company: string;
  role: string;
  start: string;        // ISO yyyy-mm
  end: string;          // ISO yyyy-mm or "present"
  oneLine: string;
};

export const careerEntries: CareerEntry[] = [
  {
    company: "Trabian",
    role: "Senior Developer",
    start: "2021-07",
    end: "2026-02",
    oneLine:
      "Led full-stack development of WCAG-compliant fintech applications across 70+ financial institutions; integrated SSOs and third-party services via the Q2 SDK platform.",
  },
  {
    company: "Q2 Software",
    role: "Web Developer",
    start: "2011-10",
    end: "2021-07",
    oneLine:
      "Built and maintained accessibility-compliant web applications for financial institutions, served millions of end users; led the support queue with 90%+ satisfaction.",
  },
];
```

- [ ] **Step 4:** Create `content/projects.ts`.

```ts
export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Link = { label: string; href: string };

export type DrupalSite = {
  name: string;
  thumbnail: string;       // path under /public, e.g. "/projects/drupal/cbtwaco.webp"
  liveUrl?: string;        // present → linked; absent → inert
  note?: string;
};

export type ProjectDetail =
  | { kind: "drupal"; sites: DrupalSite[] }
  | { kind: "capabilities"; capabilities: string[] }
  | { kind: "simple" };

export type Project = {
  id: "drupal-cluster" | "q2-sdk" | "road-trip-planner";
  title: string;
  role: string;
  timeframe: string;
  summary: string;
  tags: string[];
  images: ProjectImage[];
  links: Link[];
  detail?: ProjectDetail;
};

export const projects: Project[] = [
  {
    id: "drupal-cluster",
    title: "Drupal Sites",
    role: "Senior Developer / Theme & Module Author",
    timeframe: "2011 – 2026",
    summary:
      "More than ten years building Drupal sites for financial institutions — custom modules, migration assistance, design-system implementation, and close collaboration with external designers.",
    tags: ["Drupal 7/8/9/10", "PHP", "Twig", "JavaScript", "SCSS"],
    images: [],
    links: [],
    detail: {
      kind: "drupal",
      sites: [
        {
          name: "CBT Waco",
          thumbnail: "/projects/drupal/cbtwaco.webp",
          liveUrl: "https://www.cbtwaco.bank/",
          note: "Customized template site",
        },
        {
          name: "Founders FCU",
          thumbnail: "/projects/drupal/founders.webp",
          liveUrl: "https://www.foundersfcu.com/",
          note: "Custom modules + migration",
        },
        {
          name: "Founders Insurance",
          thumbnail: "/projects/drupal/founders-insurance.webp",
          liveUrl: "https://www.foundersfcuinsurance.com/",
        },
        {
          name: "Founders Wealth",
          thumbnail: "/projects/drupal/founders-wealth.webp",
          liveUrl: "https://www.wealthmanagementatfounders.com/",
        },
        {
          name: "Verity CU",
          thumbnail: "/projects/drupal/verity.webp",
          liveUrl: "https://www.veritycu.com/",
          note: "Implemented third-party design",
        },
      ],
    },
  },
  {
    id: "q2-sdk",
    title: "Q2 SDK Work",
    role: "Senior Developer",
    timeframe: "2021 – 2026",
    summary:
      "Architected and integrated complex third-party applications and SSO solutions into online banking environments via the Q2 SDK platform — REST/SOAP, modern auth, and a wide range of capabilities. Client names withheld.",
    tags: ["React", "TypeScript", "Tailwind", "Python", "Q2 SDK", "REST/SOAP"],
    images: [],
    links: [],
    detail: {
      kind: "capabilities",
      capabilities: [
        "Member-to-member transfer & management application",
        "FX international wire transfers",
        "B2B API integration",
        "Q2 prepaid card flows",
        "Multiple third-party chat integrations",
        "Multiple SSO integrations",
      ],
    },
  },
  {
    id: "road-trip-planner",
    title: "Road Trip Planner",
    role: "Solo project",
    timeframe: "2025 – present",
    summary:
      "Personal experiment in AI-assisted trip planning. Generates routes, finds stops, and turns a vague weekend idea into something you can actually execute.",
    tags: ["Next.js", "TypeScript", "AI"],
    images: [],
    links: [],
    detail: { kind: "simple" },
  },
];
```

- [ ] **Step 5:** Verify types compile.

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6:** Commit.

```bash
git add content/
git commit -m "Add typed content modules with seed data"
```

---

### Task 5: Set up Vitest

**Files:**
- Create: `vitest.config.ts`, `tests/unit/.gitkeep`
- Modify: `package.json`

- [ ] **Step 1:** Install Vitest and React testing utilities.

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2:** Create `vitest.config.ts`.

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/unit/setup.ts"],
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 3:** Create `tests/unit/setup.ts`.

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4:** Add scripts to `package.json` (alongside existing `dev`, `build`, etc.).

```json
{
  "scripts": {
    "test:unit": "vitest run",
    "test:unit:watch": "vitest"
  }
}
```

- [ ] **Step 5:** Add a smoke test to verify wiring at `tests/unit/smoke.test.ts`.

```ts
import { describe, it, expect } from "vitest";

describe("vitest smoke test", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6:** Run it.

```bash
npm run test:unit
```

Expected: 1 passing test.

- [ ] **Step 7:** Commit.

```bash
git add -A
git commit -m "Set up Vitest with jsdom and Testing Library"
```

---

### Task 6: Set up Playwright with axe-core

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/a11y.spec.ts`
- Modify: `package.json`

- [ ] **Step 1:** Install Playwright and axe.

```bash
npm install -D @playwright/test @axe-core/playwright
npx playwright install --with-deps chromium
```

- [ ] **Step 2:** Create `playwright.config.ts`.

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 3:** Create the a11y smoke spec at `tests/e2e/a11y.spec.ts`. (We add per-route specs in later tasks; this one validates the harness works.)

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page loads and has no critical accessibility violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

- [ ] **Step 4:** Add scripts to `package.json`.

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

- [ ] **Step 5:** Run it once to confirm setup.

```bash
npm run test:e2e
```

Expected: 1 passing test (placeholder home page passes axe trivially).

- [ ] **Step 6:** Commit.

```bash
git add -A
git commit -m "Set up Playwright with axe-core"
```

---

### Task 7: Set up bundle analyzer with budget

**Files:**
- Create: `scripts/check-bundle-size.mjs`
- Modify: `next.config.ts`, `package.json`

- [ ] **Step 1:** Install the analyzer.

```bash
npm install -D @next/bundle-analyzer
```

- [ ] **Step 2:** Wrap `next.config.ts`.

```ts
import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
  },
  experimental: {
    typedRoutes: true,
  },
};

export default withBundleAnalyzer(nextConfig);
```

- [ ] **Step 3:** Create `scripts/check-bundle-size.mjs`. Coarse but reliable: gzips every `.js` file under `.next/static/chunks/` and asserts the aggregate stays under a total budget. We use 200KB as a guardrail (roughly 2x the per-page initial-load budget of 100KB, since not every chunk loads on every page). Lighthouse CI in Task 8 enforces the *actual* per-page byte weight.

```js
import { readdirSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const CHUNK_DIR = join(".next", "static", "chunks");
const TOTAL_BUDGET_KB = 200;

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && e.name.endsWith(".js")) yield p;
  }
}

let total = 0;
for (const f of walk(CHUNK_DIR)) {
  total += gzipSync(readFileSync(f)).length;
}

const totalKB = total / 1024;
console.log(`Total static JS chunks (gzipped): ${totalKB.toFixed(1)} KB / budget ${TOTAL_BUDGET_KB} KB`);

if (totalKB > TOTAL_BUDGET_KB) {
  console.error(`✖ Over aggregate JS budget by ${(totalKB - TOTAL_BUDGET_KB).toFixed(1)} KB`);
  process.exit(1);
}
console.log("✓ Within aggregate budget");
```

- [ ] **Step 4:** Add scripts.

```json
{
  "scripts": {
    "analyze": "ANALYZE=true next build",
    "check:bundle": "next build && node scripts/check-bundle-size.mjs"
  }
}
```

- [ ] **Step 5:** Run a build and confirm budget check passes.

```bash
npm run check:bundle
```

Expected: prints first-load JS size, "Within budget".

- [ ] **Step 6:** Commit.

```bash
git add -A
git commit -m "Add bundle analyzer and 100KB first-load JS budget"
```

---

### Task 8: Set up Lighthouse CI

**Files:**
- Create: `lighthouserc.cjs`
- Modify: `package.json`

- [ ] **Step 1:** Install Lighthouse CI.

```bash
npm install -D @lhci/cli
```

- [ ] **Step 2:** Create `lighthouserc.cjs`.

```js
module.exports = {
  ci: {
    collect: {
      staticDistDir: ".next",
      startServerCommand: "npm run start",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/about",
        "http://localhost:3000/projects",
        "http://localhost:3000/contact",
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 1.0 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        // Per-page byte weight gate: ~120KB initial + headroom for HTML/CSS/fonts.
        "total-byte-weight": ["error", { maxNumericValue: 350000 }],
      },
    },
    upload: { target: "temporary-public-storage" },
  },
};
```

- [ ] **Step 3:** Add script.

```json
{
  "scripts": {
    "test:lhci": "lhci autorun"
  }
}
```

- [ ] **Step 4:** Commit. (We don't run Lighthouse locally each task — it runs in CI; we'll verify in the final task.)

```bash
git add -A
git commit -m "Add Lighthouse CI config with 95+ / 100 a11y gates"
```

---

### Task 9: Set up GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1:** Create the workflow.

```yaml
name: CI

on:
  push:
    branches: [main, design, build]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint
      - run: npm run test:unit
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - run: npm run check:bundle
      - run: npm run test:lhci
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

- [ ] **Step 2:** Commit.

```bash
git add -A
git commit -m "Add GitHub Actions CI workflow"
```

---

## Phase 2: Building Blocks

### Task 10: Motion config helper (TDD)

**Files:**
- Create: `lib/motion-config.ts`, `tests/unit/motion-config.test.ts`

- [ ] **Step 1:** Write the failing test at `tests/unit/motion-config.test.ts`.

```ts
import { describe, it, expect, vi, afterEach } from "vitest";
import { prefersReducedMotion, motionDuration } from "@/lib/motion-config";

afterEach(() => {
  vi.restoreAllMocks();
});

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? matches : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
}

describe("prefersReducedMotion", () => {
  it("returns false when user has not requested reduced motion", () => {
    mockMatchMedia(false);
    expect(prefersReducedMotion()).toBe(false);
  });

  it("returns true when user has requested reduced motion", () => {
    mockMatchMedia(true);
    expect(prefersReducedMotion()).toBe(true);
  });

  it("returns false when matchMedia is undefined (SSR)", () => {
    vi.stubGlobal("matchMedia", undefined);
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe("motionDuration", () => {
  it("returns the requested duration when motion is allowed", () => {
    mockMatchMedia(false);
    expect(motionDuration(0.25)).toBe(0.25);
  });

  it("returns 0 when reduced motion is requested", () => {
    mockMatchMedia(true);
    expect(motionDuration(0.25)).toBe(0);
  });
});
```

- [ ] **Step 2:** Run the test, expect failure.

```bash
npm run test:unit -- motion-config
```

Expected: test fails (module not found).

- [ ] **Step 3:** Implement `lib/motion-config.ts`.

```ts
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function motionDuration(seconds: number): number {
  return prefersReducedMotion() ? 0 : seconds;
}
```

- [ ] **Step 4:** Run the test, expect pass.

```bash
npm run test:unit -- motion-config
```

Expected: 5 passing tests.

- [ ] **Step 5:** Commit.

```bash
git add -A
git commit -m "Add motion-config helper with reduced-motion gating"
```

---

### Task 11: Build SVG illustration primitives

**Files:**
- Create: `components/illustrations/Sun.tsx`, `Ridge.tsx`, `Mesa.tsx`, `Cliff.tsx`, `Juniper.tsx`, `Cactus.tsx`, `Strata.tsx`, `Campfire.tsx`, `Compass.tsx`, `Sprout.tsx`

Each illustration is a small inline SVG component. They accept an optional `className` prop and use `currentColor` so palette tokens flow via Tailwind utilities. All are decorative (`aria-hidden="true"`).

- [ ] **Step 1:** Create `components/illustrations/Sun.tsx`.

```tsx
type Props = { className?: string };

export function Sun({ className }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <circle cx="50" cy="50" r="32" />
      <circle cx="50" cy="50" r="40" fillOpacity="0.18" />
    </svg>
  );
}
```

- [ ] **Step 2:** Create `components/illustrations/Ridge.tsx`.

```tsx
type Props = { className?: string };

export function Ridge({ className }: Props) {
  return (
    <svg
      viewBox="0 0 1200 300"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
      fill="currentColor"
    >
      <polygon points="0,300 0,180 120,90 220,150 380,40 560,170 720,90 900,160 1080,80 1200,140 1200,300" />
    </svg>
  );
}
```

- [ ] **Step 3:** Create `components/illustrations/Mesa.tsx`.

```tsx
type Props = { className?: string };

export function Mesa({ className }: Props) {
  return (
    <svg
      viewBox="0 0 1200 300"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
      fill="currentColor"
    >
      <polygon points="0,300 0,200 80,160 200,160 230,200 480,200 510,170 700,170 730,200 1200,200 1200,300" />
    </svg>
  );
}
```

- [ ] **Step 4:** Create `components/illustrations/Cliff.tsx`.

```tsx
type Props = { className?: string };

export function Cliff({ className }: Props) {
  return (
    <svg
      viewBox="0 0 1200 200"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
      fill="currentColor"
    >
      <polygon points="0,200 0,120 60,90 180,130 360,80 540,140 720,80 900,130 1080,70 1200,110 1200,200" />
    </svg>
  );
}
```

- [ ] **Step 5:** Create `components/illustrations/Juniper.tsx`.

```tsx
type Props = { className?: string };

export function Juniper({ className }: Props) {
  return (
    <svg viewBox="0 0 60 80" aria-hidden="true" className={className}>
      <ellipse cx="30" cy="34" rx="22" ry="28" fill="currentColor" />
      <rect x="26" y="58" width="8" height="22" rx="2" fill="#5a4a32" />
    </svg>
  );
}
```

- [ ] **Step 6:** Create `components/illustrations/Cactus.tsx`.

```tsx
type Props = { className?: string };

export function Cactus({ className }: Props) {
  return (
    <svg viewBox="0 0 60 100" aria-hidden="true" className={className} fill="currentColor">
      <rect x="26" y="20" width="10" height="80" rx="5" />
      <rect x="10" y="40" width="8" height="22" rx="4" />
      <rect x="14" y="38" width="8" height="6" rx="2" />
      <rect x="44" y="48" width="8" height="20" rx="4" />
      <rect x="46" y="46" width="8" height="6" rx="2" />
    </svg>
  );
}
```

- [ ] **Step 7:** Create `components/illustrations/Strata.tsx`. (Used as the Projects callout icon.)

```tsx
type Props = { className?: string };

export function Strata({ className }: Props) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={className}>
      <rect x="0" y="10"  width="80" height="14" fill="#b76346" />
      <rect x="0" y="26"  width="80" height="10" fill="#e8b582" />
      <rect x="0" y="38"  width="80" height="18" fill="#8c3e28" />
      <rect x="0" y="58"  width="80" height="12" fill="#c87a52" />
    </svg>
  );
}
```

- [ ] **Step 8:** Create `components/illustrations/Campfire.tsx`. (Contact callout icon.)

```tsx
type Props = { className?: string };

export function Campfire({ className }: Props) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={className}>
      <path d="M40 8 C 30 28, 50 32, 40 50 C 50 38, 60 42, 56 56 C 60 36, 50 22, 40 8 Z" fill="#b76346" />
      <path d="M40 22 C 34 36, 46 40, 40 52 C 48 42, 52 46, 50 56 C 50 40, 46 30, 40 22 Z" fill="#e8b582" />
      <rect x="14" y="62" width="52" height="4" rx="2" fill="#5a4a32" transform="rotate(-6 40 64)" />
      <rect x="14" y="62" width="52" height="4" rx="2" fill="#5a4a32" transform="rotate(6 40 64)" />
    </svg>
  );
}
```

- [ ] **Step 9:** Create `components/illustrations/Compass.tsx`. (About / Travel motif.)

```tsx
type Props = { className?: string };

export function Compass({ className }: Props) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={className}>
      <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="3" />
      <polygon points="40,16 46,40 40,64 34,40" fill="currentColor" />
      <circle cx="40" cy="40" r="3" fill="currentColor" />
    </svg>
  );
}
```

- [ ] **Step 10:** Create `components/illustrations/Sprout.tsx`. (Gardening motif.)

```tsx
type Props = { className?: string };

export function Sprout({ className }: Props) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={className} fill="currentColor">
      <path d="M40 70 V 40 C 40 28, 28 22, 18 22 C 18 36, 28 44, 40 44" />
      <path d="M40 44 C 40 32, 52 26, 62 26 C 62 38, 52 46, 40 46" />
      <rect x="38" y="68" width="4" height="8" />
    </svg>
  );
}
```

- [ ] **Step 11:** Type-check.

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 12:** Commit.

```bash
git add components/illustrations
git commit -m "Add SVG illustration primitives"
```

---

### Task 12: FadeReveal wrapper

**Files:**
- Create: `components/motion/FadeReveal.tsx`

`motion` is already required in the spec; install it now.

- [ ] **Step 1:** Install motion.

```bash
npm install motion
```

- [ ] **Step 2:** Create `components/motion/FadeReveal.tsx`. Uses `motion`'s `whileInView` API; reduced-motion is handled globally by the CSS contract from Task 2.

```tsx
"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Vertical offset in px before reveal. Default 12. */
  offset?: number;
  /** Duration in seconds. Default 0.4. */
  duration?: number;
  /** Delay in seconds. Default 0. */
  delay?: number;
};

export function FadeReveal({
  children,
  className,
  offset = 12,
  duration = 0.4,
  delay = 0,
}: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3:** Type-check.

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4:** Commit.

```bash
git add -A
git commit -m "Add FadeReveal motion wrapper"
```

---

### Task 13: ParallaxLayer wrapper

**Files:**
- Create: `components/motion/ParallaxLayer.tsx`

- [ ] **Step 1:** Create `components/motion/ParallaxLayer.tsx`.

```tsx
"use client";

import { useScroll, useTransform, motion } from "motion/react";
import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /**
   * Speed factor. 1 = scrolls with content, 0 = pinned, < 1 = slower (back layer),
   * > 1 = faster (foreground). Typical values: 0.3–0.8 for back, 1.0–1.4 for fore.
   */
  speed?: number;
  className?: string;
};

export function ParallaxLayer({ children, speed = 0.5, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Map scroll progress (0..1) to a vertical translate. The travel
  // distance scales with the speed factor: lower speed = less travel = "further away".
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${(1 - speed) * 50}%`]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2:** Type-check.

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3:** Commit.

```bash
git add -A
git commit -m "Add ParallaxLayer motion wrapper"
```

---

### Task 14: SkipLink, Header, Footer

**Files:**
- Create: `components/shell/SkipLink.tsx`, `components/shell/Header.tsx`, `components/shell/Footer.tsx`, `lib/routes.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1:** Create `lib/routes.ts`.

```ts
export const routes = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
] as const;
```

- [ ] **Step 2:** Create `components/shell/SkipLink.tsx`.

```tsx
export function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      Skip to content
    </a>
  );
}
```

- [ ] **Step 3:** Create `components/shell/Header.tsx`.

```tsx
import Link from "next/link";
import { routes } from "@/lib/routes";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-sand/80 backdrop-blur-sm border-b border-mesa/15">
      <div className="mx-auto max-w-[1280px] flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-canyon font-bold text-lg tracking-tight"
        >
          Thomas Shackelford
        </Link>
        <nav aria-label="Primary">
          <ul className="flex gap-6 text-sm">
            {routes.slice(1).map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="text-ink hover:text-canyon transition-colors"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 4:** Create `components/shell/Footer.tsx`.

```tsx
import { siteMeta } from "@/content/meta";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-mesa/15">
      <div className="mx-auto max-w-[1280px] px-6 py-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-sm text-dust">
        <p>© {year} {siteMeta.name}</p>
        <ul className="flex gap-6">
          <li>
            <a
              href="https://github.com/thomasshackelford"
              className="hover:text-canyon transition-colors"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/thomas-shackelford"
              className="hover:text-canyon transition-colors"
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="mailto:thomas.shackelford1@gmail.com"
              className="hover:text-canyon transition-colors"
            >
              Email
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5:** Update `app/layout.tsx` to include shell.

```tsx
import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { SkipLink } from "@/components/shell/SkipLink";
import { siteMeta } from "@/content/meta";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  weight: ["600", "800"],
  axes: ["opsz"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
  metadataBase: new URL(siteMeta.url),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body>
        <SkipLink />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 6:** Run dev to confirm shell renders.

```bash
npm run dev
```

Expected: header, content (placeholder), footer all render with the palette. Stop server.

- [ ] **Step 7:** Commit.

```bash
git add -A
git commit -m "Add SkipLink, Header, Footer, and routes table"
```

---

## Phase 3: Pages

### Task 15: Home page

**Files:**
- Modify: `app/page.tsx`
- Create: `app/_home/Hero.tsx`, `app/_home/Intro.tsx`, `app/_home/Callouts.tsx`
- Create: `tests/e2e/home.spec.ts`

The Home page composes a hero scene with parallax layers, an intro band, and three callout cards.

- [ ] **Step 1:** Create `app/_home/Hero.tsx`.

```tsx
import { Sun } from "@/components/illustrations/Sun";
import { Ridge } from "@/components/illustrations/Ridge";
import { Mesa } from "@/components/illustrations/Mesa";
import { Cliff } from "@/components/illustrations/Cliff";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { siteMeta } from "@/content/meta";
import { heroTagline } from "@/content/personal";
import Link from "next/link";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[88vh] overflow-hidden flex items-center"
    >
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sand to-sun/40" aria-hidden="true" />
      {/* Sun (back) */}
      <ParallaxLayer speed={0.3} className="absolute top-[10%] right-[12%] w-32 h-32 text-mesa">
        <Sun className="w-full h-full" />
      </ParallaxLayer>
      {/* Back ridge — canyon-green */}
      <ParallaxLayer speed={0.5} className="absolute bottom-0 left-0 right-0 h-[55%] text-sage">
        <Ridge className="w-full h-full" />
      </ParallaxLayer>
      {/* Mid mesas — terra cotta */}
      <ParallaxLayer speed={0.8} className="absolute bottom-0 left-0 right-0 h-[40%] text-mesa">
        <Mesa className="w-full h-full" />
      </ParallaxLayer>
      {/* Foreground cliff — deepest clay */}
      <ParallaxLayer speed={1.1} className="absolute bottom-0 left-0 right-0 h-[28%] text-canyon">
        <Cliff className="w-full h-full" />
      </ParallaxLayer>

      {/* Content */}
      <div className="relative mx-auto max-w-[1280px] w-full px-6 py-16">
        <p className="text-canyon font-[family-name:var(--font-body)] uppercase tracking-[0.14em] text-sm font-semibold">
          {siteMeta.role} · {siteMeta.location}
        </p>
        <h1
          id="hero-heading"
          className="mt-3 font-[family-name:var(--font-display)] font-extrabold text-5xl md:text-7xl tracking-tight text-ink max-w-3xl"
        >
          {siteMeta.name}
        </h1>
        <p className="mt-5 text-ink/85 text-lg max-w-2xl leading-relaxed">{heroTagline}</p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/projects"
            className="bg-canyon text-bone px-5 py-3 rounded-md font-semibold hover:bg-canyon/90 transition-colors"
          >
            See projects
          </Link>
          <Link
            href="/about"
            className="border-2 border-canyon text-canyon px-5 py-3 rounded-md font-semibold hover:bg-canyon hover:text-bone transition-colors"
          >
            About me
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Create `app/_home/Intro.tsx`.

```tsx
import { FadeReveal } from "@/components/motion/FadeReveal";

export function Intro() {
  return (
    <FadeReveal>
      <section
        aria-labelledby="intro-heading"
        className="mx-auto max-w-[72ch] px-6 py-24"
      >
        <h2 id="intro-heading" className="sr-only">
          Introduction
        </h2>
        <p className="text-xl text-ink leading-relaxed">
          Thirteen years building accessible web applications for financial
          institutions you've banked at without knowing it. I write code that
          the next person can change without fear, mentor the engineers around
          me, and care more about the craft than the stack.
        </p>
      </section>
    </FadeReveal>
  );
}
```

- [ ] **Step 3:** Create `app/_home/Callouts.tsx`.

```tsx
import Link from "next/link";
import { Compass } from "@/components/illustrations/Compass";
import { Strata } from "@/components/illustrations/Strata";
import { Campfire } from "@/components/illustrations/Campfire";
import { FadeReveal } from "@/components/motion/FadeReveal";

const callouts = [
  {
    href: "/about",
    label: "About",
    Icon: Compass,
    teaser: "Who I am, where I've been, and what's outside the work.",
  },
  {
    href: "/projects",
    label: "Projects",
    Icon: Strata,
    teaser: "A decade of fintech sites and apps. Some you might recognize.",
  },
  {
    href: "/contact",
    label: "Contact",
    Icon: Campfire,
    teaser: "Get in touch. I read everything.",
  },
] as const;

export function Callouts() {
  return (
    <FadeReveal>
      <section
        aria-labelledby="callouts-heading"
        className="mx-auto max-w-[1280px] px-6 py-16"
      >
        <h2 id="callouts-heading" className="sr-only">
          Browse the site
        </h2>
        <ul className="grid gap-6 md:grid-cols-3">
          {callouts.map(({ href, label, Icon, teaser }) => (
            <li key={href}>
              <Link
                href={href}
                className="group block bg-bone p-6 rounded-xl border border-mesa/20 hover:border-mesa transition-colors h-full"
              >
                <Icon className="w-12 h-12 text-canyon mb-3" />
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink mb-1">
                  {label}
                </h3>
                <p className="text-dust">{teaser}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </FadeReveal>
  );
}
```

- [ ] **Step 4:** Replace `app/page.tsx`.

```tsx
import { Hero } from "./_home/Hero";
import { Intro } from "./_home/Intro";
import { Callouts } from "./_home/Callouts";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <Callouts />
    </>
  );
}
```

- [ ] **Step 5:** Create `tests/e2e/home.spec.ts`.

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Home page", () => {
  test("renders hero with name, role, and CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /Thomas Shackelford/i })
    ).toBeVisible();
    await expect(page.getByText(/Senior Software Engineer.*Lakewood, CA/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /See projects/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /About me/i })).toBeVisible();
  });

  test("renders intro and three callouts linking to other routes", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /About/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Projects/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Contact/i })).toBeVisible();
  });

  test("has no critical accessibility violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
```

- [ ] **Step 6:** Delete the now-redundant generic spec.

```bash
rm tests/e2e/a11y.spec.ts
```

- [ ] **Step 7:** Run e2e tests.

```bash
npm run test:e2e -- home
```

Expected: 3 passing tests.

- [ ] **Step 8:** Commit.

```bash
git add -A
git commit -m "Build Home page with hero, intro, callouts"
```

---

### Task 16: About page

**Files:**
- Create: `app/about/page.tsx`, `app/_about/CareerSnapshot.tsx`, `app/_about/PersonalTopics.tsx`, `app/_about/PageHeader.tsx`
- Create: `tests/e2e/about.spec.ts`

`PageHeader` is shared across non-Home routes (small variant of the hero scene). We define it under `_about` for now and lift it to `components/shell/` on first reuse if it doesn't need per-route variation.

- [ ] **Step 1:** Create `app/_about/PageHeader.tsx`.

```tsx
import { Sun } from "@/components/illustrations/Sun";
import { Ridge } from "@/components/illustrations/Ridge";

type Props = { eyebrow: string; title: string };

export function PageHeader({ eyebrow, title }: Props) {
  return (
    <section
      aria-labelledby="page-title"
      className="relative overflow-hidden bg-gradient-to-b from-sand to-sun/30"
    >
      <div className="absolute top-6 right-12 w-20 h-20 text-mesa" aria-hidden="true">
        <Sun className="w-full h-full" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 text-sage" aria-hidden="true">
        <Ridge className="w-full h-full" />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-6 py-20">
        <p className="text-canyon font-semibold text-sm uppercase tracking-[0.14em]">
          {eyebrow}
        </p>
        <h1
          id="page-title"
          className="mt-2 font-[family-name:var(--font-display)] font-extrabold text-5xl md:text-6xl text-ink"
        >
          {title}
        </h1>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Create `app/_about/CareerSnapshot.tsx`.

```tsx
import { careerEntries } from "@/content/career";
import { FadeReveal } from "@/components/motion/FadeReveal";

function formatRange(start: string, end: string) {
  const fmt = (s: string) =>
    s === "present"
      ? "Present"
      : new Date(`${s}-01`).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
  return `${fmt(start)} — ${fmt(end)}`;
}

export function CareerSnapshot() {
  return (
    <FadeReveal>
      <section
        aria-labelledby="career-heading"
        className="mx-auto max-w-[1280px] px-6 py-16"
      >
        <h2
          id="career-heading"
          className="font-[family-name:var(--font-display)] font-extrabold text-3xl text-ink mb-8"
        >
          Where I've been
        </h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {careerEntries.map((e) => (
            <li
              key={e.company}
              className="bg-bone p-6 rounded-xl border border-mesa/20"
            >
              <p className="text-canyon text-xs uppercase tracking-[0.14em] font-semibold">
                {formatRange(e.start, e.end)}
              </p>
              <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-ink">
                {e.company}
              </h3>
              <p className="mt-1 text-dust text-sm">{e.role}</p>
              <p className="mt-3 text-ink leading-relaxed">{e.oneLine}</p>
            </li>
          ))}
        </ul>
      </section>
    </FadeReveal>
  );
}
```

- [ ] **Step 3:** Create `app/_about/PersonalTopics.tsx`.

```tsx
import { personalTopics } from "@/content/personal";
import { Compass } from "@/components/illustrations/Compass";
import { Sprout } from "@/components/illustrations/Sprout";
import { Campfire } from "@/components/illustrations/Campfire";
import { FadeReveal } from "@/components/motion/FadeReveal";

const iconFor: Record<string, React.ComponentType<{ className?: string }>> = {
  travel: Compass,
  gardening: Sprout,
  camping: Campfire,
};

export function PersonalTopics() {
  return (
    <FadeReveal>
      <section
        aria-labelledby="personal-heading"
        className="mx-auto max-w-[1280px] px-6 py-16"
      >
        <h2
          id="personal-heading"
          className="font-[family-name:var(--font-display)] font-extrabold text-3xl text-ink mb-8"
        >
          Outside the work
        </h2>
        <ul className="grid gap-8 md:grid-cols-3">
          {personalTopics.map((t) => {
            const Icon = iconFor[t.id];
            return (
              <li key={t.id}>
                {Icon ? <Icon className="w-12 h-12 text-mesa mb-3" /> : null}
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink mb-2">
                  {t.title}
                </h3>
                <p className="text-ink/85 leading-relaxed">{t.body}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </FadeReveal>
  );
}
```

- [ ] **Step 4:** Create `app/about/page.tsx`.

```tsx
import { PageHeader } from "../_about/PageHeader";
import { CareerSnapshot } from "../_about/CareerSnapshot";
import { PersonalTopics } from "../_about/PersonalTopics";
import { aboutBody } from "@/content/personal";
import { FadeReveal } from "@/components/motion/FadeReveal";

export const metadata = {
  title: "About — Thomas Shackelford",
  description:
    "Thomas Shackelford — Senior Software Engineer in Lakewood, CA. Thirteen years in fintech. Travel, gardening, camping.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="A few things about me." />
      <FadeReveal>
        <section className="mx-auto max-w-[72ch] px-6 py-16 space-y-5 text-lg leading-relaxed text-ink">
          {aboutBody.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      </FadeReveal>
      <CareerSnapshot />
      <PersonalTopics />
    </>
  );
}
```

- [ ] **Step 5:** Create `tests/e2e/about.spec.ts`.

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("About page", () => {
  test("renders header, professional bit, career, and personal sections", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /Where I've been/i })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /Outside the work/i })).toBeVisible();
    await expect(page.getByText(/Trabian/)).toBeVisible();
    await expect(page.getByText(/Q2 Software/)).toBeVisible();
  });

  test("has no critical accessibility violations", async ({ page }) => {
    await page.goto("/about");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
```

- [ ] **Step 6:** Run e2e.

```bash
npm run test:e2e -- about
```

Expected: 2 passing tests.

- [ ] **Step 7:** Commit.

```bash
git add -A
git commit -m "Build About page"
```

---

### Task 17: Drupal strip with keyboard navigation (TDD)

**Files:**
- Create: `components/projects/DrupalStrip.tsx`, `tests/unit/drupal-strip.test.tsx`

The Drupal strip is the only non-trivial interactive component. It needs a roving tabindex so arrow keys move focus among thumbs, but Tab moves focus past the strip. Reduced-motion-friendly (no transforms in CSS-disabled state).

- [ ] **Step 1:** Write the failing test at `tests/unit/drupal-strip.test.tsx`.

The roving tabindex lives on the *focusable child* of each `<li>` — the `<a>` for sites with a `liveUrl`, or a non-link element with `role="img"` for inert sites. We query those by `aria-label` so the same selector works for both.

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DrupalStrip } from "@/components/projects/DrupalStrip";
import type { DrupalSite } from "@/content/projects";

const sites: DrupalSite[] = [
  { name: "Site One", thumbnail: "/projects/drupal/one.webp", liveUrl: "https://one.example.com" },
  { name: "Site Two", thumbnail: "/projects/drupal/two.webp" },
  { name: "Site Three", thumbnail: "/projects/drupal/three.webp", liveUrl: "https://three.example.com" },
];

const focusables = () => sites.map((s) => screen.getByLabelText(s.name));

describe("DrupalStrip", () => {
  it("renders one list item per site", () => {
    render(<DrupalStrip sites={sites} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders sites with liveUrl as links opening in a new tab", () => {
    render(<DrupalStrip sites={sites} />);
    const link = screen.getByRole("link", { name: /Site One/ });
    expect(link).toHaveAttribute("href", "https://one.example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel") ?? "").toContain("noopener");
  });

  it("renders sites without liveUrl as inert (no link role)", () => {
    render(<DrupalStrip sites={sites} />);
    expect(screen.queryByRole("link", { name: /Site Two/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Site Two")).toBeInTheDocument();
  });

  it("uses roving tabindex: only the first focusable is tabbable initially", () => {
    render(<DrupalStrip sites={sites} />);
    const [first, second, third] = focusables();
    expect(first).toHaveAttribute("tabindex", "0");
    expect(second).toHaveAttribute("tabindex", "-1");
    expect(third).toHaveAttribute("tabindex", "-1");
  });

  it("moves focus with ArrowRight and ArrowLeft", async () => {
    const user = userEvent.setup();
    render(<DrupalStrip sites={sites} />);
    const [first, second, third] = focusables();
    first.focus();
    await user.keyboard("{ArrowRight}");
    expect(second).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(third).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(second).toHaveFocus();
  });

  it("wraps focus at the ends", async () => {
    const user = userEvent.setup();
    render(<DrupalStrip sites={sites} />);
    const [first, , third] = focusables();
    first.focus();
    await user.keyboard("{ArrowLeft}");
    expect(third).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(first).toHaveFocus();
  });

  it("Home jumps to first, End to last", async () => {
    const user = userEvent.setup();
    render(<DrupalStrip sites={sites} />);
    const [first, , third] = focusables();
    first.focus();
    await user.keyboard("{End}");
    expect(third).toHaveFocus();
    await user.keyboard("{Home}");
    expect(first).toHaveFocus();
  });
});
```

- [ ] **Step 2:** Run, expect failures.

```bash
npm run test:unit -- drupal-strip
```

Expected: tests fail (component does not exist).

- [ ] **Step 3:** Implement `components/projects/DrupalStrip.tsx`. The focusable element is the inner `<a>` (linked) or `<div role="img">` (inert). The `<li>` is presentational. Roving tabindex lives on those inner elements. `aria-label` matches the site name for both kinds, so screen readers and tests can target uniformly.

```tsx
"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import type { DrupalSite } from "@/content/projects";

type Props = { sites: DrupalSite[] };

export function DrupalStrip({ sites }: Props) {
  const [focusIndex, setFocusIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  function moveFocus(next: number) {
    const wrapped = (next + sites.length) % sites.length;
    setFocusIndex(wrapped);
    itemRefs.current[wrapped]?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        moveFocus(focusIndex + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveFocus(focusIndex - 1);
        break;
      case "Home":
        e.preventDefault();
        moveFocus(0);
        break;
      case "End":
        e.preventDefault();
        moveFocus(sites.length - 1);
        break;
    }
  }

  return (
    <ul
      role="list"
      onKeyDown={handleKeyDown}
      className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1"
      aria-label="Drupal sites"
    >
      {sites.map((s, i) => {
        const tabIndex = i === focusIndex ? 0 : -1;
        const inner = (
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md bg-mesa/20">
            <Image
              src={s.thumbnail}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 200px"
              className="object-cover"
            />
            {s.note ? (
              <span className="absolute bottom-1 left-1 right-1 bg-ink/70 text-bone text-[0.65rem] uppercase tracking-wide px-2 py-1 rounded">
                {s.note}
              </span>
            ) : null}
          </div>
        );

        const setRef = (el: HTMLElement | null) => {
          itemRefs.current[i] = el;
        };

        return (
          <li
            key={s.name}
            className="flex-none w-40 transition-transform duration-200 hover:scale-105"
          >
            {s.liveUrl ? (
              <a
                ref={setRef}
                href={s.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={tabIndex}
                aria-label={s.name}
                className="block"
              >
                {inner}
              </a>
            ) : (
              <div
                ref={setRef}
                tabIndex={tabIndex}
                role="img"
                aria-label={s.name}
                className="block"
              >
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 4:** Run tests, expect pass.

```bash
npm run test:unit -- drupal-strip
```

Expected: 7 passing tests.

- [ ] **Step 5:** Commit.

```bash
git add -A
git commit -m "Add DrupalStrip with roving tabindex keyboard navigation"
```

---

### Task 18: Projects page

**Files:**
- Create: `app/projects/page.tsx`, `app/_projects/ProjectEntry.tsx`, `app/_projects/CapabilitiesList.tsx`
- Create: `tests/e2e/projects.spec.ts`

- [ ] **Step 1:** Create `app/_projects/ProjectEntry.tsx`. Shared shell for an entry header (title, role, timeframe, summary, tags).

```tsx
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  children?: React.ReactNode;
};

export function ProjectEntry({ project, children }: Props) {
  return (
    <article aria-labelledby={`project-${project.id}`} className="py-12 border-t border-mesa/15 first:border-t-0">
      <p className="text-canyon text-xs uppercase tracking-[0.14em] font-semibold">
        {project.timeframe} · {project.role}
      </p>
      <h2
        id={`project-${project.id}`}
        className="mt-1 font-[family-name:var(--font-display)] font-extrabold text-3xl md:text-4xl text-ink"
      >
        {project.title}
      </h2>
      <p className="mt-4 text-ink/85 text-lg leading-relaxed max-w-[72ch]">
        {project.summary}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="text-xs uppercase tracking-wider text-sage bg-sage/10 px-2.5 py-1 rounded"
          >
            {tag}
          </li>
        ))}
      </ul>
      {children ? <div className="mt-8">{children}</div> : null}
      {project.links.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-4">
          {project.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-canyon underline decoration-mesa underline-offset-4 hover:text-mesa"
              >
                {l.label} →
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
```

- [ ] **Step 2:** Create `app/_projects/CapabilitiesList.tsx`.

```tsx
type Props = { capabilities: string[] };

export function CapabilitiesList({ capabilities }: Props) {
  return (
    <ul className="grid gap-2 md:grid-cols-2 max-w-[72ch]">
      {capabilities.map((c) => (
        <li
          key={c}
          className="bg-bone border border-mesa/15 rounded px-4 py-3 text-ink text-sm"
        >
          {c}
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3:** Create `app/projects/page.tsx`.

```tsx
import { PageHeader } from "../_about/PageHeader";
import { ProjectEntry } from "../_projects/ProjectEntry";
import { CapabilitiesList } from "../_projects/CapabilitiesList";
import { DrupalStrip } from "@/components/projects/DrupalStrip";
import { projects } from "@/content/projects";
import { FadeReveal } from "@/components/motion/FadeReveal";

export const metadata = {
  title: "Projects — Thomas Shackelford",
  description:
    "Selected work — a decade of Drupal sites for fintech, Q2 SDK integrations, and a personal AI experiment.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader eyebrow="Projects" title="A decade of work, a few good things." />
      <section className="mx-auto max-w-[1280px] px-6 py-12">
        {projects.map((project) => (
          <FadeReveal key={project.id}>
            <ProjectEntry project={project}>
              {project.detail?.kind === "drupal" ? (
                <DrupalStrip sites={project.detail.sites} />
              ) : null}
              {project.detail?.kind === "capabilities" ? (
                <CapabilitiesList capabilities={project.detail.capabilities} />
              ) : null}
            </ProjectEntry>
          </FadeReveal>
        ))}
      </section>
    </>
  );
}
```

- [ ] **Step 4:** Add placeholder Drupal thumbnails so `next/image` doesn't 404 in dev/CI. We need real WebP files at the paths referenced in `content/projects.ts`. For now, generate solid-color WebP placeholders so the build passes; you'll drop real screenshots later per the manual-asset preference.

```bash
mkdir -p public/projects/drupal
# Create one tiny solid-color WebP and copy it for each referenced site.
node -e '
const { writeFileSync } = require("fs");
const buf = Buffer.from(
  "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
  "base64",
);
const slugs = ["cbtwaco","founders","founders-insurance","founders-wealth","verity"];
slugs.forEach(s => writeFileSync(`public/projects/drupal/${s}.webp`, buf));
'
```

- [ ] **Step 5:** Create `tests/e2e/projects.spec.ts`.

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Projects page", () => {
  test("renders all three project entries", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { level: 2, name: /Drupal Sites/i })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /Q2 SDK Work/i })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /Road Trip Planner/i })).toBeVisible();
  });

  test("Drupal strip shows live-link sites and inert sites correctly", async ({ page }) => {
    await page.goto("/projects");
    const cbt = page.getByRole("link", { name: /CBT Waco/i });
    await expect(cbt).toHaveAttribute("href", "https://www.cbtwaco.bank/");
    await expect(cbt).toHaveAttribute("target", "_blank");
  });

  test("Drupal strip is keyboard navigable with arrow keys", async ({ page }) => {
    await page.goto("/projects");
    // First focusable inside the strip is the CBT Waco link (it has a liveUrl).
    await page.getByRole("link", { name: "CBT Waco" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("link", { name: "Founders FCU" })).toBeFocused();
  });

  test("has no critical accessibility violations", async ({ page }) => {
    await page.goto("/projects");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
```

- [ ] **Step 6:** Run.

```bash
npm run test:e2e -- projects
```

Expected: 4 passing tests.

- [ ] **Step 7:** Commit.

```bash
git add -A
git commit -m "Build Projects page with Drupal strip and Q2 capabilities"
```

---

### Task 19: Contact page

**Files:**
- Create: `app/contact/page.tsx`, `tests/e2e/contact.spec.ts`

- [ ] **Step 1:** Create `app/contact/page.tsx`.

```tsx
import { PageHeader } from "../_about/PageHeader";
import { FadeReveal } from "@/components/motion/FadeReveal";
import { Compass } from "@/components/illustrations/Compass";
import { Strata } from "@/components/illustrations/Strata";
import { Campfire } from "@/components/illustrations/Campfire";

export const metadata = {
  title: "Contact — Thomas Shackelford",
  description: "Get in touch with Thomas Shackelford — GitHub, LinkedIn, or email.",
};

const links = [
  {
    href: "https://github.com/thomasshackelford",
    label: "GitHub",
    Icon: Strata,
    teaser: "Code, in public.",
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/thomas-shackelford",
    label: "LinkedIn",
    Icon: Compass,
    teaser: "The professional record.",
    external: true,
  },
  {
    href: "mailto:thomas.shackelford1@gmail.com",
    label: "Email",
    Icon: Campfire,
    teaser: "Best for project conversations.",
    external: false,
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Get in touch." />
      <FadeReveal>
        <section className="mx-auto max-w-[1280px] px-6 py-16">
          <p className="max-w-[60ch] text-lg text-ink/85 mb-10">
            I read every message. The fastest way to reach me is email; LinkedIn is good for the
            professional context.
          </p>
          <ul className="grid gap-6 md:grid-cols-3">
            {links.map(({ href, label, Icon, teaser, external }) => (
              <li key={href}>
                <a
                  href={href}
                  className="group block bg-bone p-8 rounded-xl border border-mesa/20 hover:border-mesa transition-colors h-full"
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <Icon className="w-14 h-14 text-canyon mb-4" />
                  <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink mb-1">
                    {label}
                  </h2>
                  <p className="text-dust">{teaser}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </FadeReveal>
    </>
  );
}
```

- [ ] **Step 2:** Create `tests/e2e/contact.spec.ts`.

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Contact page", () => {
  test("renders three contact links", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { level: 1, name: /Get in touch/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
      "href",
      "https://github.com/thomasshackelford"
    );
    await expect(page.getByRole("link", { name: /LinkedIn/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Email/i })).toHaveAttribute(
      "href",
      "mailto:thomas.shackelford1@gmail.com"
    );
  });

  test("has no critical accessibility violations", async ({ page }) => {
    await page.goto("/contact");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
```

- [ ] **Step 3:** Run.

```bash
npm run test:e2e -- contact
```

Expected: 2 passing tests.

- [ ] **Step 4:** Commit.

```bash
git add -A
git commit -m "Build Contact page"
```

---

## Phase 4: Launch Prep

### Task 20: OpenGraph image generator

**Files:**
- Create: `app/opengraph-image.tsx`

- [ ] **Step 1:** Create `app/opengraph-image.tsx` using `next/og`.

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Thomas Shackelford — Senior Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #f3d8c2 0%, #e8b582 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <p
          style={{
            color: "#8c3e28",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 600,
            margin: 0,
          }}
        >
          Senior Software Engineer · Lakewood, CA
        </p>
        <h1
          style={{
            color: "#2a2118",
            fontSize: 96,
            fontWeight: 800,
            margin: "16px 0 0",
            letterSpacing: "-0.02em",
          }}
        >
          Thomas Shackelford
        </h1>
        <p style={{ color: "#2a2118", fontSize: 28, margin: "32px 0 0", maxWidth: 800 }}>
          Thirteen years building accessible, high-performance web applications for fintech.
        </p>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 2:** Build to verify the OG image renders.

```bash
npm run build
```

Expected: build succeeds with the OG image route compiled.

- [ ] **Step 3:** Commit.

```bash
git add -A
git commit -m "Add OpenGraph image generator"
```

---

### Task 21: Analytics shell

**Files:**
- Create: `components/shell/Analytics.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1:** Install Next third-parties package.

```bash
npm install @next/third-parties
```

- [ ] **Step 2:** Create `components/shell/Analytics.tsx`. No-op when `NEXT_PUBLIC_GTM_ID` is unset.

```tsx
import { GoogleTagManager } from "@next/third-parties/google";

export function Analytics() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return null;
  return <GoogleTagManager gtmId={gtmId} />;
}
```

- [ ] **Step 3:** Render `<Analytics />` in `app/layout.tsx` inside `<body>`, before `<SkipLink />`.

```tsx
// inside RootLayout body:
<body>
  <Analytics />
  <SkipLink />
  <Header />
  <main id="main">{children}</main>
  <Footer />
</body>
```

Add the import:

```tsx
import { Analytics } from "@/components/shell/Analytics";
```

- [ ] **Step 4:** Verify build still passes.

```bash
npm run build
```

Expected: success.

- [ ] **Step 5:** Commit.

```bash
git add -A
git commit -m "Add GTM-ready analytics shell (no-op without env var)"
```

---

### Task 22: 404 page

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1:** Create the 404.

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[60ch] px-6 py-32 text-center">
      <p className="text-canyon text-xs uppercase tracking-[0.14em] font-semibold">
        404
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] font-extrabold text-5xl text-ink">
        Off the trail.
      </h1>
      <p className="mt-4 text-lg text-ink/85">
        That page isn't here. Try the map below.
      </p>
      <ul className="mt-8 flex justify-center gap-6 text-canyon">
        <li><Link href="/" className="underline underline-offset-4">Home</Link></li>
        <li><Link href="/about" className="underline underline-offset-4">About</Link></li>
        <li><Link href="/projects" className="underline underline-offset-4">Projects</Link></li>
        <li><Link href="/contact" className="underline underline-offset-4">Contact</Link></li>
      </ul>
    </section>
  );
}
```

- [ ] **Step 2:** Commit.

```bash
git add -A
git commit -m "Add 404 page"
```

---

### Task 23: Final verification — full CI suite locally

**Files:** none

- [ ] **Step 1:** Typecheck.

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 2:** Lint.

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3:** Unit tests.

```bash
npm run test:unit
```

Expected: all green.

- [ ] **Step 4:** E2E + a11y.

```bash
npm run test:e2e
```

Expected: all green; zero axe violations across all four routes.

- [ ] **Step 5:** Bundle size budget.

```bash
npm run check:bundle
```

Expected: under 100 KB gzipped.

- [ ] **Step 6:** Lighthouse CI.

```bash
npm run test:lhci
```

Expected: performance ≥0.95, accessibility = 1.0, best-practices ≥0.95, SEO ≥0.95 on all four routes. If any fail, fix before proceeding.

- [ ] **Step 7:** Manual keyboard walkthrough. Open `npm run dev`, then:
  1. Tab from address bar — first focusable should be the Skip link (visible on focus).
  2. Skip link target reaches `#main`.
  3. Tab through Header → Hero CTAs → Intro → Callouts → Footer in visual order.
  4. On `/projects`, Tab into the Drupal strip; arrow keys move within the strip; Tab exits past the strip.
  5. On `/contact`, all three cards are focusable in order.

- [ ] **Step 8:** Manual reduced-motion check. Toggle `prefers-reduced-motion: reduce` in browser dev tools (Rendering panel). Reload each route. Confirm: no fades, no slides, no parallax — content appears immediately.

- [ ] **Step 9:** Commit any small fixes from the walkthroughs.

```bash
git add -A
git commit -m "Final verification fixes" # only if there are fixes
```

---

### Task 24: Vercel deployment

**Files:** none — Vercel project config done via CLI / dashboard

- [ ] **Step 1:** Install Vercel CLI if not present.

```bash
npm install -g vercel
vercel --version
```

- [ ] **Step 2:** From the project root, link the repo to a Vercel project.

```bash
vercel link
```

Follow prompts: scope (personal account), project name (`portfolio` or `thomasshackelford-dev`), directory (`./`).

- [ ] **Step 3:** Push the `build` branch and create a PR to `main`.

```bash
git push -u origin build
gh pr create --base main --head build --title "Initial portfolio implementation" --body "Implements docs/plans/2026-05-04-portfolio-design.md"
```

- [ ] **Step 4:** Confirm CI passes on the PR (GitHub Actions all green) and the Vercel preview deployment URL renders correctly.

- [ ] **Step 5:** Merge the PR. Production deploys automatically.

- [ ] **Step 6:** Configure custom domain in Vercel dashboard:
  - Add `thomasshackelford.dev` (apex)
  - Add `www.thomasshackelford.dev`
  - Choose a redirect direction (apex → www or www → apex). The default is apex → www.
  - Update DNS at the registrar per Vercel's instructions (typically: A record for apex, CNAME for www).

- [ ] **Step 7:** After DNS propagates (5–60 min), open https://thomasshackelford.dev/ and verify all four routes load.

- [ ] **Step 8:** Production smoke test: run Lighthouse from a clean browser against the production URL. Confirm performance ≥95, accessibility = 100.

---

## Open Questions Carried Forward

These are deferred decisions from the spec. They don't block implementation but should be settled before declaring the site "done":

- DNS redirect direction (apex → www or www → apex)
- Whether to swap GA4 for Plausible or Vercel Analytics
- Real WebP screenshots for each Drupal site listed in `content/projects.ts` — currently placeholders. User drops them into `public/projects/drupal/<slug>.webp`.
- Final per-route header-band variations (sun position, ridge silhouette) — refined visually after first deploy

---

## Spec Coverage Check (self-review)

Walking the spec section by section:

- **Stack** — Task 1, 12 ✓
- **IA / 4 routes** — Tasks 15, 16, 18, 19 ✓
- **Color tokens / @theme** — Task 2 ✓
- **Typography** — Task 3 ✓
- **Illustration system** — Task 11 ✓
- **Page composition (each route)** — Tasks 15, 16, 18, 19 ✓
- **Drupal interaction (strip + roving tabindex + optional liveUrl)** — Task 17 ✓
- **Motion budget (parallax, fade-reveal, focus ring, hover, reduced-motion)** — Tasks 2, 12, 13, 15 (parallax in hero), 17 (strip hover) ✓
- **Accessibility (semantic HTML, contrast, keyboard parity, focus, alt, axe in CI)** — Tasks 2, 6, 14, 15, 16, 17, 18, 19, 23 ✓
- **Performance budget (95+ Lighthouse, 100KB JS, WebP, font swap)** — Tasks 7, 8, 23 ✓
- **Content data shapes** — Task 4 ✓
- **Project structure** — Tasks 1–14 (folders created as we go) ✓
- **Analytics (no-op shell)** — Task 21 ✓
- **Testing (Vitest, Playwright + axe, Lighthouse CI)** — Tasks 5, 6, 8, 17, 23 ✓
- **Deployment / CI (GH Actions, Vercel)** — Tasks 9, 24 ✓
- **Out-of-scope items** — naturally excluded ✓
