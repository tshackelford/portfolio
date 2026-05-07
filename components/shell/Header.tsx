import Link from "next/link";
import type { Route } from "next";
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
                  href={r.href as Route}
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
