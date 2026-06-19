import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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
      {project.images.length > 0 ? (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {project.images.map((img) => (
            <li
              key={img.src}
              className="overflow-hidden rounded-xl border border-canyon/15 bg-sand/30"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-auto"
              />
            </li>
          ))}
        </ul>
      ) : null}
      {project.links.length > 0 ? (
        <ul className="mt-8 flex flex-wrap gap-3">
          {project.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-canyon text-bone px-5 py-2.5 rounded-md font-semibold hover:bg-canyon/90 transition-colors"
              >
                {l.label}
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
