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
