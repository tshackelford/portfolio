# Portfolio Redesign — One-Pager

> Supersedes the multi-page design in `docs/plans/2026-05-04-portfolio-design.md` for IA, hero, and decorative SVG decisions. Palette, type, motion contract, accessibility targets, and performance budget remain authoritative there except where this spec overrides.

## Goal

Rebuild `thomasshackelford.dev` as a single-page site optimized for a recruiter or hiring manager to glance at and make a decision in under a minute. Keep the warmth of the existing palette without leaning creative; simplify the structure so the signal is faster to read.

## Audience and intent

A recruiter or hiring manager scanning quickly. The site has one job: present credentials clearly enough that the visitor can decide to reach out or pass within ~30 seconds. Depth lives in the resume PDF.

## Structural changes vs. current build

**Removed:**
- Multi-page routes (`/about`, `/projects`, `/contact`)
- Hero scene (Sun/Ridge/Mesa/Cliff parallax)
- `PageHeader` (no longer multi-page)
- All custom illustration components (`Sun`, `Ridge`, `Mesa`, `Cliff`, `Juniper`, `Cactus`, `Strata`, `Campfire`, `Compass`, `Sprout`)
- `FadeReveal` motion wrapper (caused below-fold opacity-0 bugs and isn't replaced)
- `ParallaxLayer` motion wrapper (no parallax target left)
- `motion` library (no remaining consumers — verify before removing)
- Header logo / name link (replaced by centered nav only)
- Home page `Callouts` and `Intro` sub-components
- About page `PersonalTopics` section (travel / gardening / camping)

**Kept and adapted:**
- Palette tokens (`canyon`, `mesa`, `sage`, `sun`, `sand`, `bone`, `ink`, `dust`) — but the page now lives on `bone` with `ink` text and `canyon` for accents (palette direction "B" from brainstorm). `sand` and `sun` move from primary background to reserve for future per-section background layers.
- Type system: Fraunces (display, variable weight + opsz axis) + Work Sans (body).
- Reduced-motion CSS contract in `globals.css`.
- `content/projects.ts`, `content/career.ts`, `content/meta.ts` — schemas unchanged.
- `content/personal.ts` is rewritten: `personalTopics` is deleted; `heroTagline` and `aboutBody` are consolidated into a single `aboutIntro` constant — one short paragraph (~1–2 sentences, ~40 words) used by the About section. User edits the copy before launch.
- `DrupalStrip` (roving-tabindex keyboard navigation) and its unit tests.
- `CapabilitiesList` (Q2 SDK bullets).
- `Footer` (already minimal; lives on bone background now).
- Vitest, Playwright + axe, Lighthouse CI, bundle-size script, GitHub Actions CI.
- 404 page (`app/not-found.tsx`).
- OG image generator (`app/opengraph-image.tsx`).

**New:**
- `lucide-react` (UI icons: Mail, FileDown, ArrowRight, etc.).
- Inline brand-mark SVGs for GitHub and LinkedIn, sourced from simple-icons. Two icons total — added as small local components under `components/icons/`, not the full simple-icons npm package.
- `components/shell/SectionShell.tsx` — full-width section wrapper that takes an `id`, a constrained-width inner container, and an optional `background` slot. Sections compose it.
- `app/_sections/About.tsx`, `Projects.tsx`, `Career.tsx`, `Contact.tsx` — one component per section.

## Information architecture

```
/                                 → renders all four sections in order
/resume.pdf                       → file in public/, opened in new tab from Contact section

/about, /projects, /contact       → DELETED (404 acceptable)
```

Anchor links from header nav: `#about`, `#projects`, `#career`, `#contact`.

## Visual & layout decisions

### Header

Centered nav, four links, no logo or name. The nav links use anchor hrefs to the section ids.

Sticky at the top with a subtle bone-tinted backdrop blur and a 1px canyon-tinted border-bottom. Same approach as the existing header — drop the logo link, change the layout from space-between to centered, replace route `Link`s with anchor `<a>`s.

### Section shell

Every section is structured as:

```
<section id="..." className="full-width">
  <div class="background-slot">  {/* optional, absolute-positioned, behind content */}
    {background}
  </div>
  <div class="content-container max-width-content">
    {children}
  </div>
</section>
```

The `background` slot is the architectural foothold for the eventual cascading mountain treatment. It defaults to empty. Sections call out their `id` for anchor scrolling.

The page uses native `scroll-behavior: smooth` with the reduced-motion contract already disabling smooth scroll for users who opt out.

### About section (intro)

Centered text only. Three lines stacked:
1. Name in display serif, large (`text-5xl md:text-6xl`).
2. Role + location in canyon, small-caps tracked uppercase.
3. One short paragraph (1–2 sentences), max-width ~60ch.

No photo, no CTA buttons, no illustration. The user fleshes out copy.

### Projects section

Header: small canyon section label "§ Projects" + display serif heading "A decade of work" (user can rename).

Three project entries stacked vertically. Each entry uses a simplified `ProjectEntry` shell:
- Top-line metadata: `timeframe · role` in canyon small-caps
- `title` in display serif, smaller than About's name (~text-2xl md:text-3xl)
- `summary` paragraph
- `tags` as pills (current accessible style: `text-ink bg-sage/25`)
- `detail` content (project-specific)
- `links` row (currently empty in seed data; render only when present)

Project-specific details by `detail.kind`:
- `drupal` → `DrupalStrip` (kept as-is)
- `capabilities` → `CapabilitiesList` (kept as-is)
- `simple` → no extra body content

Density increases between projects naturally because the seed data does — Drupal has the strip, Q2 has the bullets, Road Trip is text-only. No structural change needed to express that.

### Career section

Header: "§ Career" label + "Where I've been" heading.

Two cards side-by-side at md+, stacked at mobile. Same card shape as the previous `CareerSnapshot` (timeframe small-caps, company name display serif, role in dust, one-line summary). User can iterate.

### Contact section

Header: "§ Contact" label + "Get in touch" heading.

A single 4-column grid (1-column on mobile, 2-col on sm, 4-col on md+) of equal cards. Each card is a single `<a>` whose accessible name comes from the visible text label below the icon. Icons are decorative (`aria-hidden="true"`).

1. GitHub — simple-icons GitHub mark, visible "GitHub" label, opens `https://github.com/thomasshackelford` in new tab.
2. LinkedIn — simple-icons LinkedIn mark, visible "LinkedIn" label, opens the LinkedIn URL in new tab.
3. Email — Lucide `Mail` icon, visible "Email" label, `mailto:` link (no `target="_blank"`).
4. Resume — Lucide `FileDown` icon, visible "Resume" label, links to `/resume.pdf` in new tab.

The brand marks are filled; the utility icons are stroked. This is the intentional inconsistency from palette decision B (brand marks must be official, utility icons match Lucide style).

### Footer

Drop the right-side social ul since those links are duplicated in the Contact section. Center the `© year Name` line.

## Icons

Install `lucide-react`. Tree-shaken usage — import only the icons used: `Mail`, `FileDown`, and a couple more if needed in the body. Verify the resulting bundle delta.

Add two inline brand-mark components:
- `components/icons/GithubMark.tsx`
- `components/icons/LinkedinMark.tsx`

Each is a single `<svg>` with the official simple-icons path data, accepting `className` and using `currentColor` for fill. No external dependency on the simple-icons npm package — copying two paths is cheaper than adding a dep.

## Background-slot contract

Each `SectionShell` renders a `background` prop into an `absolute inset-0 -z-10` positioned div behind the content. Initially every section passes `background={null}` (or omits it). The architecture exists so the cascading mountain treatment can land later without touching section composition — just pass an SVG or layered illustration into the prop.

The bone page background is set on `body` (already in `globals.css`); section backgrounds layer over it. No section in this iteration ships with a non-null background.

## Reduced-motion

The existing `globals.css` reduced-motion contract stays. Two new considerations:

1. `scroll-behavior: smooth` is added globally; the contract already forces `scroll-behavior: auto` under reduced-motion.
2. Lucide icons are static SVGs — no motion concern.

## Routes that previously existed

`/about`, `/projects`, `/contact` are removed. Their `app/<route>/page.tsx` files and `app/_about/`, `app/_projects/` directories are deleted. Returning 404 is acceptable; we are not adding redirects since the site has no public traffic yet.

## Tests

Adapt existing tests:
- `tests/e2e/home.spec.ts` becomes the only page test. It asserts the intro, the three project headings, the two career entries, and the four contact links are present, and that axe finds no violations.
- `tests/e2e/about.spec.ts`, `projects.spec.ts`, `contact.spec.ts` are deleted (content folded into the home spec).
- `tests/unit/drupal-strip.test.tsx` stays unchanged.
- `tests/unit/motion-config.test.ts` deleted along with `lib/motion-config.ts` (no consumers).

Anchor navigation is verified in the e2e test: click each header link, assert the page scrolls and the targeted section's heading is at the top of the viewport.

## Performance & accessibility budgets

Unchanged from current Lighthouse CI config (perf ≥0.90, a11y = 1.0, best-practices ≥0.95, SEO ≥0.95, total-byte-weight ≤400KB). Removing `motion` should drop the bundle meaningfully — verify after rebuild and tighten budgets if there's headroom.

## Open follow-ups (out of scope for this iteration)

- Cascading mountain background treatment per section (the reason the `background` slot exists).
- Real WebP screenshots for Drupal sites in `public/projects/drupal/` (currently 42-byte placeholders).
- Resume PDF — user supplies at `public/resume.pdf` before launch.
- Active-section highlighting in the nav as the user scrolls. Decided to defer; native scroll-spy adds JS, and the simple nav is fine without it.
- Photo in the About section.
- Returning custom illustration kit (Ridge / Mesa / Cliff / etc.) as background-slot content.

## Acceptance criteria

- Single route renders all four sections in order.
- Header nav links scroll to the correct anchors (verified by e2e).
- Lighthouse: perf ≥0.90, a11y = 1.0 on `/`.
- No axe violations on `/`.
- Reduced-motion: no smooth scroll, no transitions.
- `motion` package removed from `package.json` if no consumers remain.
- `tsc --noEmit`, `npm run lint`, `npm run test:unit`, `npm run test:e2e`, `npm run check:bundle`, `npm run test:lhci` all pass locally.
