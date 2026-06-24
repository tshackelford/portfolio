const sections = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-bone/85 backdrop-blur-sm border-b border-canyon/10">
      <nav aria-label="Primary" className="mx-auto max-w-[1280px] px-6 py-4">
        <ul className="flex justify-center items-center gap-6 md:gap-10 text-sm font-medium">
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
          <li>
            <a
              href="/resume"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-canyon border border-canyon/30 rounded-full px-3 py-1 font-semibold hover:bg-canyon hover:text-bone transition-colors"
            >
              Resume
              <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 2 V10 M5 7 L8 10 L11 7 M3 13 H13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
