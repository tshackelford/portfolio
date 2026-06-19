import { projects } from "@/content/projects";
import { ProjectEntry } from "@/components/projects/ProjectEntry";
import { DrupalStrip } from "@/components/projects/DrupalStrip";
import { CapabilitiesList } from "@/components/projects/CapabilitiesList";
import { SectionShell } from "@/components/shell/SectionShell";
import { ScrollFadeIn } from "@/components/motion/ScrollFadeIn";

export function Projects() {
  return (
    <SectionShell id="projects">
      <ScrollFadeIn>
        <p className="text-canyon text-xs uppercase tracking-[0.16em] font-semibold">
          § Projects
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] font-extrabold text-3xl md:text-4xl text-ink">
          A decade of work
        </h2>
      </ScrollFadeIn>
      <div className="mt-3">
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
