import { PageHeader } from "../_about/PageHeader";
import { ProjectEntry } from "../_projects/ProjectEntry";
import { CapabilitiesList } from "../_projects/CapabilitiesList";
import { DrupalStrip } from "@/components/projects/DrupalStrip";
import { projects } from "@/content/projects";
import { FadeReveal } from "@/components/motion/FadeReveal";

export const metadata = {
  title: "Projects — Thomas Shackelford",
  description:
    "Selected work — a decade of Drupal sites for fintech, Q2 SDK integrations, and a personal AI experiment.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader eyebrow="Projects" title="A decade of work, a few good things." />
      <section className="mx-auto max-w-[1280px] px-6 py-12">
        {projects.map((project) => (
          <FadeReveal key={project.id}>
            <ProjectEntry project={project}>
              {project.detail?.kind === "drupal" ? (
                <DrupalStrip sites={project.detail.sites} />
              ) : null}
              {project.detail?.kind === "capabilities" ? (
                <CapabilitiesList capabilities={project.detail.capabilities} />
              ) : null}
            </ProjectEntry>
          </FadeReveal>
        ))}
      </section>
    </>
  );
}
