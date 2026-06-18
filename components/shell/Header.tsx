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
