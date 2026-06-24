import { Mail, FileDown } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SectionShell } from "@/components/shell/SectionShell";
import { SectionBackground } from "@/components/shell/SectionBackground";
import { ScrollFadeIn } from "@/components/motion/ScrollFadeIn";

type ContactLink = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  external: boolean;
};

const contactLinks: ContactLink[] = [
  {
    href: "https://github.com/tshackelford",
    label: "GitHub",
    Icon: FaGithub,
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/thomas-shackelford",
    label: "LinkedIn",
    Icon: FaLinkedin,
    external: true,
  },
  {
    href: "mailto:thomas.shackelford1@gmail.com",
    label: "Email",
    Icon: Mail,
    external: false,
  },
  {
    href: "/resume",
    label: "Resume",
    Icon: FileDown,
    external: true,
  },
];

export function Contact() {
  return (
    <SectionShell id="contact" background={<SectionBackground variant="contact" />}>
      <ScrollFadeIn>
        <p className="text-canyon text-xs uppercase tracking-[0.16em] font-semibold">
          Contact
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] font-extrabold text-3xl md:text-4xl text-ink">
          Get in touch
        </h2>
        <p className="mt-4 text-ink/85 text-lg leading-relaxed ">
          I&#39;m actively looking for my next role. If you think I&#39;d be a good fit for your team, I&#39;d love to hear from you.
        </p>
      </ScrollFadeIn>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {contactLinks.map(({ href, label, Icon, external }, i) => (
          <ScrollFadeIn key={label} as="li" delay={0.15 + i * 0.1}>
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
          </ScrollFadeIn>
        ))}
      </ul>
    </SectionShell>
  );
}
