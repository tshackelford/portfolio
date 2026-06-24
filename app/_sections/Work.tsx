import { projects } from "@/content/projects";
import { careerEntries } from "@/content/career";
import { ProjectEntry } from "@/components/projects/ProjectEntry";
import { DrupalStrip } from "@/components/projects/DrupalStrip";
import { CapabilitiesList } from "@/components/projects/CapabilitiesList";
import { SectionShell } from "@/components/shell/SectionShell";
import { SectionBackground } from "@/components/shell/SectionBackground";
import { ScrollFadeIn } from "@/components/motion/ScrollFadeIn";

function formatRange(start: string, end: string) {
  const fmt = (s: string) =>
    s === "present"
      ? "Present"
      : new Date(`${s}-01`).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
  return `${fmt(start)} - ${fmt(end)}`;
}

export function Work() {
  return (
    <SectionShell id="work" background={<SectionBackground variant="work" />}>
      <ScrollFadeIn>
        <p className="text-canyon text-xs uppercase tracking-[0.16em] font-semibold">
          Work
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] font-extrabold text-3xl md:text-4xl text-ink">
          Where I&rsquo;ve worked
        </h2>
      </ScrollFadeIn>

      <ul className="mt-10 grid gap-6 md:grid-cols-2 items-stretch">
        {careerEntries.map((e, i) => (
          <ScrollFadeIn
            key={e.company}
            as="li"
            delay={0.15 + i * 0.1}
            className="h-full flex flex-col bg-sand/40 p-6 rounded-xl border border-canyon/15"
          >
            <p className="text-canyon text-xs uppercase tracking-[0.14em] font-semibold">
              {formatRange(e.start, e.end)}
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-ink">
              {e.company}
            </h3>
            <ul className="mt-1 text-dust text-sm">
              {e.roles.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="mt-3 text-ink leading-relaxed">{e.oneLine}</p>
          </ScrollFadeIn>
        ))}
      </ul>

      <div className="mt-12">
        <ScrollFadeIn>
          <p className="text-canyon text-xs uppercase tracking-[0.16em] font-semibold">
            Work
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] font-extrabold text-3xl md:text-4xl text-ink">
            What I&rsquo;ve worked on
          </h2>
        </ScrollFadeIn>
      </div>

      <div className="mt-1 ">
        {projects.map((project, i) => (
          <ScrollFadeIn key={project.id} delay={0.15 + i * 0.1}>
            <ProjectEntry project={project}>
              {project.detail?.kind === "drupal" ? (
                <DrupalStrip sites={project.detail.sites} />
              ) : null}
              {project.detail?.kind === "capabilities" ? (
                <CapabilitiesList capabilities={project.detail.capabilities} />
              ) : null}
            </ProjectEntry>
          </ScrollFadeIn>
        ))}
      </div>
    </SectionShell>
  );
}
