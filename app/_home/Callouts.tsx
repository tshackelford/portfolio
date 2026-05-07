import Link from "next/link";
import type { Route } from "next";
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
                href={href as Route}
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
