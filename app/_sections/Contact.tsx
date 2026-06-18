import { Mail, FileDown } from "lucide-react";
import { SiGithub, SiLinkedin } from "react-icons/si";
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
    Icon: SiGithub,
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/thomas-shackelford",
    label: "LinkedIn",
    Icon: SiLinkedin,
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
