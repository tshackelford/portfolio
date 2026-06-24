# thomasshackelford.dev

Personal portfolio site. One page, three sections: About → Work → Contact. Work folds career history and selected projects together.

## Stack

- **Next.js 16** (App Router, static-first)
- **React 19** / **TypeScript** (strict)
- **Tailwind CSS v4** — palette + theme tokens live in `app/globals.css`
- **motion** — scroll-driven fade-ins via `ScrollFadeIn`
- **lucide-react** + **react-icons/fa** — UI + brand icons
- **next/font** — Fraunces (display) + Work Sans (body)

## Local dev

```bash
npm install
npm run dev
```

http://localhost:3000

## Environment variables

Create `.env.local` at the project root (gitignored):

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX   # optional — enables Google Analytics
```

On Vercel, set the same vars under Project Settings → Environment Variables.

## Content

Edit copy and data in `content/`:

- `meta.ts` — name, title, role, location
- `personal.ts` — `aboutIntro` paragraph
- `career.ts` — career entries (company, roles[], dates, one-liner)
- `projects.ts` — projects, Drupal site list, capabilities, images, links
- `skills.ts` — skill groups shown under the About hero

## Layout

```
app/
  _sections/       About, Work, Contact
  layout.tsx       Header + Footer + Analytics shell
  page.tsx         Composes the three sections
  opengraph-image.tsx
  not-found.tsx
components/
  shell/           Header, Footer, SkipLink, SectionShell, SectionBackground
  motion/          ScrollFadeIn
  projects/        ProjectEntry, DrupalStrip, CapabilitiesList
content/           Typed copy + data
public/
  resume.pdf       Linked from /resume (Next rewrite)
  projects/        Site screenshots
```

## Useful scripts

```bash
npm run dev          # dev server
npm run build        # production build
npm run lint         # eslint
```
