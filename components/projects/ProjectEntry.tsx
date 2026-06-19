import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  children?: React.ReactNode;
};

export function ProjectEntry({ project, children }: Props) {
  return (
    <article
      aria-labelledby={`project-${project.id}`}
      className="fade-up py-12 border-t border-canyon/15 first:border-t-0"
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
      {project.links.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-4">
          {project.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-canyon underline decoration-canyon/40 underline-offset-4 hover:decoration-canyon"
              >
                {l.label} →
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
