# One-Pager Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `thomasshackelford.dev` as a single-page site (4 sections — About, Projects, Career, Contact — with anchor navigation) per `docs/superpowers/specs/2026-06-18-onepager-redesign.md`.

**Architecture:** Reuse the existing Next.js 16 / Tailwind v4 scaffold. Replace the multi-page IA with a single `app/page.tsx` that composes four section components, each wrapped in a `SectionShell` that provides a full-width canvas with an optional background slot for future per-section illustration work. Demolish the hero scene, parallax/fade motion wrappers, and the custom illustration kit. Add `lucide-react` for utility icons plus two hand-rolled brand-mark components for GitHub and LinkedIn.

**Tech Stack:** Next.js 16, React 19, TypeScript (strict), Tailwind v4, Vitest, Playwright + @axe-core/playwright, Lighthouse CI, lucide-react.

**Branch:** Continue on `build`. Commit after each task.

**Reference spec:** `docs/superpowers/specs/2026-06-18-onepager-redesign.md`.

---

## File Structure (target after redesign)

```
portfolio/
├── app/
│   ├── _sections/
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Career.tsx
│   │   └── Contact.tsx
│   ├── layout.tsx              # Header / Footer / Analytics — unchanged shape
│   ├── page.tsx                # / — composes the 4 sections
│   ├── globals.css             # bone bg, smooth scroll, existing motion contract
│   ├── opengraph-image.tsx     # unchanged
│   ├── not-found.tsx           # unchanged
│   └── icon.tsx                # (Next.js scaffold)
├── components/
│   ├── shell/
│   │   ├── Header.tsx          # rewritten: centered anchor nav
│   │   ├── Footer.tsx          # rewritten: centered copyright only
│   │   ├── SkipLink.tsx        # unchanged
│   │   ├── SectionShell.tsx    # NEW
│   │   └── Analytics.tsx       # unchanged
│   ├── icons/                  # NEW
│   │   ├── GithubMark.tsx
│   │   └── LinkedinMark.tsx
│   └── projects/
│       ├── DrupalStrip.tsx     # unchanged
│       ├── ProjectEntry.tsx    # MOVED from app/_projects/, h2→h3
│       └── CapabilitiesList.tsx# MOVED from app/_projects/
├── content/
│   ├── projects.ts             # unchanged
│   ├── career.ts               # unchanged
│   ├── personal.ts             # rewritten: just `aboutIntro`
│   └── meta.ts                 # unchanged
├── lib/                        # routes.ts and motion-config.ts deleted
├── public/
│   ├── projects/drupal/        # placeholder webp files unchanged
│   └── resume.pdf              # user supplies (out of plan scope)
├── tests/
│   ├── e2e/
│   │   └── home.spec.ts        # rewritten: full one-pager + anchor scroll
│   └── unit/
│       ├── setup.ts            # unchanged
│       ├── smoke.test.ts       # unchanged
│       ├── drupal-strip.test.tsx  # unchanged
│       └── section-shell.test.tsx # NEW
```

**Deleted entirely:**
- `app/about/`, `app/projects/`, `app/contact/`
- `app/_about/`, `app/_home/`, `app/_projects/`
- `components/illustrations/` (all 10 files)
- `components/motion/` (FadeReveal, ParallaxLayer)
- `lib/motion-config.ts`, `lib/routes.ts`
- `tests/unit/motion-config.test.ts`
- `tests/e2e/about.spec.ts`, `projects.spec.ts`, `contact.spec.ts`
- `motion` dependency

---

## Phase 1: Foundation

### Task 1: Update globals.css to bone palette and add smooth scroll

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1:** Replace the contents of `app/globals.css` with the new version. Three changes vs. current: body background flips from `--color-sand` to `--color-bone`; an `html { scroll-behavior: smooth; }` rule is added (overridden under reduced-motion by the existing `*` block); border tokens drift from `mesa` to `canyon`-toned in section accents (cosmetic only — implemented per-component, not in globals).

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

html {
  scroll-behavior: smooth;
}

html, body {
  background: var(--color-bone);
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

- [ ] **Step 2:** Verify dev still compiles (port 3000 should be free now; if not, use `PORT=3001 npm run dev` in the background and `curl localhost:3001`). Confirm no CSS errors. Stop the server.

```bash
PORT=3001 npm run dev
# in another shell:
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/
```

Expected: `200`. The home page still renders the old hero (we haven't replaced it yet) but on a bone background.

- [ ] **Step 3:** Commit.

```bash
git add app/globals.css
git commit -m "Flip body background to bone, add smooth scroll"
```

---

### Task 2: Install lucide-react

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1:** Install.

```bash
npm install lucide-react
```

- [ ] **Step 2:** Verify typecheck still clean.

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3:** Commit.

```bash
git add package.json package-lock.json
git commit -m "Install lucide-react"
```

---

### Task 3: Rewrite content/personal.ts to a single aboutIntro

**Files:**
- Modify: `content/personal.ts`

- [ ] **Step 1:** Replace the contents of `content/personal.ts` with one constant. Drop `PersonalTopic`, `heroTagline`, `aboutBody`, `personalTopics`.

```ts
export const aboutIntro =
  "Thirteen years building accessible, high-performance web applications for fintech. React, TypeScript, design systems — and the quiet craft of making complex tools feel obvious.";
```

- [ ] **Step 2:** Typecheck will now fail because old code imports the removed names. That's expected; the failures get fixed as we delete the consuming files in Task 16. Move on without running tsc.

- [ ] **Step 3:** Commit.

```bash
git add content/personal.ts
git commit -m "Collapse personal copy to a single aboutIntro"
```

---

## Phase 2: Building blocks

### Task 4: SectionShell with unit test (TDD)

**Files:**
- Create: `components/shell/SectionShell.tsx`, `tests/unit/section-shell.test.tsx`

- [ ] **Step 1:** Write the failing test at `tests/unit/section-shell.test.tsx`.

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionShell } from "@/components/shell/SectionShell";

describe("SectionShell", () => {
  it("renders its id on the section element", () => {
    const { container } = render(
      <SectionShell id="my-section">
        <p>content</p>
      </SectionShell>
    );
    const section = container.querySelector("section");
    expect(section).not.toBeNull();
    expect(section?.id).toBe("my-section");
  });

  it("renders children inside a constrained-width container", () => {
    render(
      <SectionShell id="x">
        <p>hello</p>
      </SectionShell>
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders the background slot when provided", () => {
    render(
      <SectionShell id="x" background={<div data-testid="bg">layer</div>}>
        <p>content</p>
      </SectionShell>
    );
    expect(screen.getByTestId("bg")).toBeInTheDocument();
  });

  it("does not render the background wrapper when no background is provided", () => {
    const { container } = render(
      <SectionShell id="x">
        <p>content</p>
      </SectionShell>
    );
    expect(container.querySelector("[data-section-background]")).toBeNull();
  });
});
```

- [ ] **Step 2:** Run, expect failure (module not found).

```bash
npm run test:unit -- section-shell
```

- [ ] **Step 3:** Implement `components/shell/SectionShell.tsx`.

```tsx
import type { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
  background?: ReactNode;
  className?: string;
};

export function SectionShell({ id, children, background, className }: Props) {
  return (
    <section id={id} className={`relative ${className ?? ""}`}>
      {background ? (
        <div
          data-section-background
          aria-hidden="true"
          className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
        >
          {background}
        </div>
      ) : null}
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:py-24">
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 4:** Run tests, expect 4 passing.

```bash
npm run test:unit -- section-shell
```

- [ ] **Step 5:** Typecheck.

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 6:** Commit.

```bash
git add components/shell/SectionShell.tsx tests/unit/section-shell.test.tsx
git commit -m "Add SectionShell with optional background slot"
```

---

### Task 5: Brand-mark icon components

**Files:**
- Create: `components/icons/GithubMark.tsx`, `components/icons/LinkedinMark.tsx`

- [ ] **Step 1:** Create `components/icons/GithubMark.tsx`. Path data is the official simple-icons GitHub mark.

```tsx
type Props = { className?: string };

export function GithubMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
```

- [ ] **Step 2:** Create `components/icons/LinkedinMark.tsx`. Path data is the official simple-icons LinkedIn mark.

```tsx
type Props = { className?: string };

export function LinkedinMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
```

- [ ] **Step 3:** Typecheck.

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 4:** Commit.

```bash
git add components/icons/
git commit -m "Add GitHub and LinkedIn brand-mark components"
```

---

### Task 6: Move CapabilitiesList from app/_projects to components/projects

**Files:**
- Create: `components/projects/CapabilitiesList.tsx`
- Delete: `app/_projects/CapabilitiesList.tsx` (deferred to the omnibus delete in Task 16)

- [ ] **Step 1:** Create `components/projects/CapabilitiesList.tsx` with the same content as the existing file.

```tsx
type Props = { capabilities: string[] };

export function CapabilitiesList({ capabilities }: Props) {
  return (
    <ul className="grid gap-2 md:grid-cols-2 max-w-[72ch]">
      {capabilities.map((c) => (
        <li
          key={c}
          className="bg-bone border border-canyon/15 rounded px-4 py-3 text-ink text-sm"
        >
          {c}
        </li>
      ))}
    </ul>
  );
}
```

Note: border token changes from `mesa/15` to `canyon/15` to match the new accent palette. Background remains `bone` — the surrounding section card will tint differently.

- [ ] **Step 2:** Do not delete the old file yet — the existing `/projects` page still imports from `app/_projects/`. It gets cleaned up in Task 16.

- [ ] **Step 3:** Commit.

```bash
git add components/projects/CapabilitiesList.tsx
git commit -m "Add CapabilitiesList under components/projects"
```

---

### Task 7: Move and adapt ProjectEntry to components/projects

**Files:**
- Create: `components/projects/ProjectEntry.tsx`

- [ ] **Step 1:** Create the new file. Two changes vs. the old `app/_projects/ProjectEntry.tsx`: the title heading drops from `<h2>` to `<h3>` (the parent Projects section now owns `<h2>`); the divider border switches from `mesa/15` to `canyon/15`.

```tsx
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  children?: React.ReactNode;
};

export function ProjectEntry({ project, children }: Props) {
  return (
    <article
      aria-labelledby={`project-${project.id}`}
      className="py-12 border-t border-canyon/15 first:border-t-0"
    >
      <p className="text-canyon text-xs uppercase tracking-[0.14em] font-semibold">
        {project.timeframe} · {project.role}
      </p>
      <h3
        id={`project-${project.id}`}
        className="mt-1 font-[family-name:var(--font-display)] font-extrabold text-2xl md:text-3xl text-ink"
      >
        {project.title}
      </h3>
      <p className="mt-4 text-ink/85 text-lg leading-relaxed max-w-[72ch]">
        {project.summary}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="text-xs uppercase tracking-wider text-ink bg-sage/25 px-2.5 py-1 rounded"
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
                className="text-canyon underline decoration-canyon/40 underline-offset-4 hover:decoration-canyon"
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

- [ ] **Step 2:** Typecheck.

```bash
npx tsc --noEmit
```

Expected: still passes (the old file is still there, no consumers broken yet).

- [ ] **Step 3:** Commit.

```bash
git add components/projects/ProjectEntry.tsx
git commit -m "Add ProjectEntry under components/projects with h3 title"
```

---

### Task 8: Rewrite Header — centered anchor nav

**Files:**
- Modify: `components/shell/Header.tsx`

- [ ] **Step 1:** Replace the contents.

```tsx
const sections = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#career", label: "Career" },
  { href: "#contact", label: "Contact" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-bone/85 backdrop-blur-sm border-b border-canyon/10">
      <nav aria-label="Primary" className="mx-auto max-w-[1280px] px-6 py-4">
        <ul className="flex justify-center gap-6 md:gap-10 text-sm font-medium">
          {sections.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                className="text-ink hover:text-canyon transition-colors"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

Notes:
- Plain `<a>` (not Next `Link`) since these are fragment links, not route changes — `typedRoutes` doesn't apply.
- The Tailwind border tint moves from `mesa/15` to `canyon/10` to fit the bone palette.

- [ ] **Step 2:** Typecheck.

```bash
npx tsc --noEmit
```

Expected: no output. (The unused `import { routes }` from `lib/routes.ts` is gone now; `lib/routes.ts` itself is deleted in Task 16.)

- [ ] **Step 3:** Commit.

```bash
git add components/shell/Header.tsx
git commit -m "Centered anchor-nav header, no logo"
```

---

### Task 9: Rewrite Footer — centered copyright only

**Files:**
- Modify: `components/shell/Footer.tsx`

- [ ] **Step 1:** Replace contents.

```tsx
import { siteMeta } from "@/content/meta";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-canyon/10">
      <div className="mx-auto max-w-[1280px] px-6 py-10 text-center text-sm text-dust">
        <p>© {year} {siteMeta.name}</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2:** Typecheck.

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3:** Commit.

```bash
git add components/shell/Footer.tsx
git commit -m "Centered footer, drop social row"
```

---

## Phase 3: Sections

### Task 10: About section

**Files:**
- Create: `app/_sections/About.tsx`

- [ ] **Step 1:** Create the file. The name uses `<h1>` (the page's primary heading) — Projects/Career/Contact will be `<h2>`.

```tsx
import { aboutIntro } from "@/content/personal";
import { siteMeta } from "@/content/meta";
import { SectionShell } from "@/components/shell/SectionShell";

export function About() {
  return (
    <SectionShell id="about" className="text-center">
      <h1 className="font-[family-name:var(--font-display)] font-extrabold text-5xl md:text-6xl text-ink tracking-tight">
        {siteMeta.name}
      </h1>
      <p className="mt-3 text-canyon text-xs uppercase tracking-[0.16em] font-semibold">
        {siteMeta.role} · {siteMeta.location}
      </p>
      <p className="mt-6 mx-auto max-w-[60ch] text-ink text-lg leading-relaxed">
        {aboutIntro}
      </p>
    </SectionShell>
  );
}
```

- [ ] **Step 2:** Typecheck.

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3:** Commit.

```bash
mkdir -p app/_sections
git add app/_sections/About.tsx
git commit -m "Add About section"
```

---

### Task 11: Projects section

**Files:**
- Create: `app/_sections/Projects.tsx`

- [ ] **Step 1:** Create the file. Uses the new `components/projects/` versions of ProjectEntry, DrupalStrip, CapabilitiesList. The visible "§ Projects" eyebrow is a stylistic touch from the wireframe; if the user dislikes it, they can drop the `<p>` line.

```tsx
import { projects } from "@/content/projects";
import { ProjectEntry } from "@/components/projects/ProjectEntry";
import { DrupalStrip } from "@/components/projects/DrupalStrip";
import { CapabilitiesList } from "@/components/projects/CapabilitiesList";
import { SectionShell } from "@/components/shell/SectionShell";

export function Projects() {
  return (
    <SectionShell id="projects">
      <p className="text-canyon text-xs uppercase tracking-[0.16em] font-semibold">
        § Projects
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] font-extrabold text-3xl md:text-4xl text-ink">
        A decade of work
      </h2>
      <div className="mt-10">
        {projects.map((project) => (
          <ProjectEntry key={project.id} project={project}>
            {project.detail?.kind === "drupal" ? (
              <DrupalStrip sites={project.detail.sites} />
            ) : null}
            {project.detail?.kind === "capabilities" ? (
              <CapabilitiesList capabilities={project.detail.capabilities} />
            ) : null}
          </ProjectEntry>
        ))}
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 2:** Typecheck.

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3:** Commit.

```bash
git add app/_sections/Projects.tsx
git commit -m "Add Projects section"
```

---

### Task 12: Career section

**Files:**
- Create: `app/_sections/Career.tsx`

- [ ] **Step 1:** Create the file. Cards use a `bg-sand/40` tint to lift off the bone page background — this is the only place in the build that needs that, but it's a soft enough warmth that it matches without feeling like a separate UI.

```tsx
import { careerEntries } from "@/content/career";
import { SectionShell } from "@/components/shell/SectionShell";

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

export function Career() {
  return (
    <SectionShell id="career">
      <p className="text-canyon text-xs uppercase tracking-[0.16em] font-semibold">
        § Career
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] font-extrabold text-3xl md:text-4xl text-ink">
        Where I&rsquo;ve been
      </h2>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {careerEntries.map((e) => (
          <li
            key={e.company}
            className="bg-sand/40 p-6 rounded-xl border border-canyon/15"
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
    </SectionShell>
  );
}
```

- [ ] **Step 2:** Typecheck.

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3:** Commit.

```bash
git add app/_sections/Career.tsx
git commit -m "Add Career section"
```

---

### Task 13: Contact section

**Files:**
- Create: `app/_sections/Contact.tsx`

- [ ] **Step 1:** Create the file. Each card's accessible name is the visible "GitHub" / "LinkedIn" / "Email" / "Resume" text below the (decorative) icon.

```tsx
import { Mail, FileDown } from "lucide-react";
import { GithubMark } from "@/components/icons/GithubMark";
import { LinkedinMark } from "@/components/icons/LinkedinMark";
import { SectionShell } from "@/components/shell/SectionShell";

type ContactLink = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  external: boolean;
};

const contactLinks: ContactLink[] = [
  {
    href: "https://github.com/thomasshackelford",
    label: "GitHub",
    Icon: GithubMark,
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/thomas-shackelford",
    label: "LinkedIn",
    Icon: LinkedinMark,
    external: true,
  },
  {
    href: "mailto:thomas.shackelford1@gmail.com",
    label: "Email",
    Icon: Mail,
    external: false,
  },
  {
    href: "/resume.pdf",
    label: "Resume",
    Icon: FileDown,
    external: true,
  },
];

export function Contact() {
  return (
    <SectionShell id="contact">
      <p className="text-canyon text-xs uppercase tracking-[0.16em] font-semibold">
        § Contact
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] font-extrabold text-3xl md:text-4xl text-ink">
        Get in touch
      </h2>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {contactLinks.map(({ href, label, Icon, external }) => (
          <li key={label}>
            <a
              href={href}
              className="block bg-sand/40 hover:bg-sand/60 transition-colors rounded-xl border border-canyon/15 p-6 text-center"
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <Icon className="w-8 h-8 mx-auto text-ink" />
              <p className="mt-3 font-semibold text-ink">{label}</p>
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
```

- [ ] **Step 2:** Typecheck.

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3:** Commit.

```bash
git add app/_sections/Contact.tsx
git commit -m "Add Contact section"
```

---

## Phase 4: Compose and demolish

### Task 14: Rewrite app/page.tsx to compose the four sections

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1:** Replace contents.

```tsx
import { About } from "./_sections/About";
import { Projects } from "./_sections/Projects";
import { Career } from "./_sections/Career";
import { Contact } from "./_sections/Contact";

export default function HomePage() {
  return (
    <>
      <About />
      <Projects />
      <Career />
      <Contact />
    </>
  );
}
```

- [ ] **Step 2:** Run dev and verify each section renders. `npm run dev` should bind 3000 cleanly now; if not, use `PORT=3001`. In the background.

```bash
PORT=3001 npm run dev
```

Wait a few seconds for compilation, then:

```bash
curl -s http://localhost:3001/ | grep -c "Thomas Shackelford"
curl -s http://localhost:3001/ | grep -c "§ Projects"
curl -s http://localhost:3001/ | grep -c "§ Career"
curl -s http://localhost:3001/ | grep -c "§ Contact"
```

Expected each: at least 1.

Stop the server.

- [ ] **Step 3:** Commit.

```bash
git add app/page.tsx
git commit -m "Compose one-pager from four section components"
```

---

### Task 15: Delete dead routes, components, libs, and tests

**Files:**
- Delete: `app/about/`, `app/projects/`, `app/contact/`
- Delete: `app/_about/`, `app/_home/`, `app/_projects/`
- Delete: `components/illustrations/`
- Delete: `components/motion/`
- Delete: `lib/motion-config.ts`, `lib/routes.ts`
- Delete: `tests/unit/motion-config.test.ts`
- Delete: `tests/e2e/about.spec.ts`, `tests/e2e/contact.spec.ts`, `tests/e2e/projects.spec.ts`

- [ ] **Step 1:** Delete the directories and files.

```bash
rm -rf app/about app/projects app/contact
rm -rf app/_about app/_home app/_projects
rm -rf components/illustrations components/motion
rm -f lib/motion-config.ts lib/routes.ts
rm -f tests/unit/motion-config.test.ts
rm -f tests/e2e/about.spec.ts tests/e2e/contact.spec.ts tests/e2e/projects.spec.ts
```

- [ ] **Step 2:** If `lib/` is now empty, remove it.

```bash
rmdir lib 2>/dev/null || true
```

- [ ] **Step 3:** Typecheck — must be clean now.

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 4:** Run unit tests — DrupalStrip, SectionShell, smoke should pass; motion-config is gone.

```bash
npm run test:unit
```

Expected: 3 test files passing (smoke, drupal-strip, section-shell).

- [ ] **Step 5:** Commit.

```bash
git add -A
git commit -m "Delete multi-page routes, illustrations, motion wrappers"
```

---

### Task 16: Uninstall the motion package

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1:** With FadeReveal and ParallaxLayer now deleted, motion has no consumers. Verify.

```bash
grep -rn "from \"motion" --include="*.tsx" --include="*.ts" . --exclude-dir=node_modules --exclude-dir=.next
```

Expected: no matches.

- [ ] **Step 2:** Uninstall.

```bash
npm uninstall motion
```

- [ ] **Step 3:** Typecheck and run unit tests — both should still pass since nothing imports motion anymore.

```bash
npx tsc --noEmit
npm run test:unit
```

Expected: tsc clean; 12 unit tests passing.

- [ ] **Step 4:** Commit.

```bash
git add package.json package-lock.json
git commit -m "Remove motion dependency"
```

---

### Task 17: Rewrite tests/e2e/home.spec.ts for the one-pager

**Files:**
- Modify: `tests/e2e/home.spec.ts`

- [ ] **Step 1:** Replace contents.

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Home (one-pager)", () => {
  test("renders the About hero with name, role, and intro", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /Thomas Shackelford/i })
    ).toBeVisible();
    await expect(
      page.getByText(/Senior Software Engineer.*Lakewood, CA/i)
    ).toBeVisible();
  });

  test("renders Projects, Career, and Contact section headings", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 2, name: /A decade of work/i })
    ).toBeAttached();
    await expect(
      page.getByRole("heading", { level: 2, name: /Where I.{1,2}ve been/i })
    ).toBeAttached();
    await expect(
      page.getByRole("heading", { level: 2, name: /Get in touch/i })
    ).toBeAttached();
  });

  test("renders all three project entries", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 3, name: /Drupal Sites/i })
    ).toBeAttached();
    await expect(
      page.getByRole("heading", { level: 3, name: /Q2 SDK Work/i })
    ).toBeAttached();
    await expect(
      page.getByRole("heading", { level: 3, name: /Road Trip Planner/i })
    ).toBeAttached();
  });

  test("renders the four contact cards with correct hrefs", async ({ page }) => {
    await page.goto("/");
    const contact = page.locator("#contact");
    await expect(contact.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
      "href",
      "https://github.com/thomasshackelford"
    );
    await expect(contact.getByRole("link", { name: /LinkedIn/i })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/thomas-shackelford"
    );
    await expect(contact.getByRole("link", { name: /Email/i })).toHaveAttribute(
      "href",
      "mailto:thomas.shackelford1@gmail.com"
    );
    await expect(contact.getByRole("link", { name: /Resume/i })).toHaveAttribute(
      "href",
      "/resume.pdf"
    );
  });

  test("header anchor links navigate to the right sections", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /Primary/i });
    for (const [label, sectionId] of [
      ["Projects", "projects"],
      ["Career", "career"],
      ["Contact", "contact"],
      ["About", "about"],
    ] as const) {
      await nav.getByRole("link", { name: new RegExp(`^${label}$`) }).click();
      await expect(page).toHaveURL(new RegExp(`#${sectionId}$`));
    }
  });

  test("has no critical accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
```

Notes:
- `toBeAttached()` used for h2/h3 inside sections since no FadeReveal exists anymore but the production build with `npm run build && npm run start` should render them visible. If the tests pass with `toBeVisible()` after Phase 4 demolition, prefer that — switch back. Leaving `toBeAttached()` is conservative.
- The anchor-link test clicks each header link and asserts the URL hash updates. Native `scroll-behavior: smooth` is overridden under reduced-motion (which Playwright doesn't enable), so the test scrolls smoothly; the URL assertion captures intent regardless.

- [ ] **Step 2:** Run.

```bash
npm run test:e2e -- home
```

Expected: 6 passing tests.

- [ ] **Step 3:** Commit.

```bash
git add tests/e2e/home.spec.ts
git commit -m "Rewrite home e2e spec for the one-pager"
```

---

## Phase 5: Verify

### Task 18: Final verification

**Files:** none.

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

Expected: smoke (1), section-shell (4), drupal-strip (7) — 12 passing total.

- [ ] **Step 4:** E2E.

```bash
npm run test:e2e
```

Expected: 6 passing (the new home spec).

- [ ] **Step 5:** Bundle size budget. Should improve materially with `motion` removed.

```bash
npm run check:bundle
```

Expected: well under the 300KB guardrail.

- [ ] **Step 6:** Lighthouse CI.

```bash
npm run test:lhci
```

Expected: only `/` is in the config now? Check — the existing `lighthouserc.cjs` lists 4 URLs (`/`, `/about`, `/projects`, `/contact`). With the multi-page routes removed, the 3 non-root URLs will return 404 and fail the audit. **Modify `lighthouserc.cjs` to list only `http://localhost:3000/`** before running lhci.

```bash
# Edit lighthouserc.cjs to keep only the root URL, then:
npm run test:lhci
```

Expected: 1 URL audited, all categories pass against the configured gates. If bundle is small enough, consider tightening `performance` from 0.9 back toward 0.95 and `total-byte-weight` from 400000 back toward 350000 — but that's a follow-up commit if you want it.

- [ ] **Step 7:** Commit the lighthouserc change.

```bash
git add lighthouserc.cjs
git commit -m "Audit only the home route in Lighthouse CI"
```

- [ ] **Step 8:** Manual eyeball check. `npm run dev`, open the page, scroll through, click each header link. Verify:
  - Header is centered, no logo.
  - About is centered text only.
  - Projects shows three entries, Drupal strip is keyboard-navigable.
  - Career has two cards on md+, stacks on mobile.
  - Contact has four equal cards with the right icons.
  - Footer is one centered line.
  - Reduced-motion in DevTools → Rendering: no smooth scroll, no transitions.

No commit if there are no fixes.

---

## Open Questions Carried Forward

These are intentionally out of scope for this iteration:

- Per-section cascading mountain background treatment. The `background` slot exists; design comes later.
- Real WebP screenshots for Drupal sites in `public/projects/drupal/` (still placeholders).
- `public/resume.pdf` — user supplies before launch.
- Active-section highlighting in the nav as the user scrolls.
- Photo in the About section.
- Whether to consolidate brand-mark + utility icons into a single visual family (currently filled vs. stroked).

## Spec Coverage Check (self-review)

Spec section → plan task:
- Audience and intent → drives the whole shape; not a single task.
- Removed components/routes → Task 15 (omnibus delete).
- `motion` package removed → Task 16.
- Kept and adapted (palette, type, content schemas, DrupalStrip) → Tasks 1, 3, 6, 7.
- `lucide-react` install → Task 2.
- Inline brand-mark components → Task 5.
- `SectionShell` → Task 4.
- One section component per section → Tasks 10–13.
- IA (single route + anchor nav) → Tasks 8, 14, 15.
- Header rewrite → Task 8.
- Footer rewrite → Task 9.
- Background-slot contract → Task 4 (the shell's `background` prop).
- Reduced-motion → Task 1 (globals.css contract retained + smooth-scroll added).
- Tests (rewritten home spec, deleted others, kept drupal-strip, deleted motion-config) → Tasks 4, 15, 17.
- Budgets → Task 18.
- Acceptance criteria → Task 18.

No gaps.
