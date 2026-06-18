import { aboutIntro } from "@/content/personal";
import { siteMeta } from "@/content/meta";
import { SectionShell } from "@/components/shell/SectionShell";

export function About() {
  return (
    <SectionShell id="about" className="text-center">
      <h1 className="font-[family-name:var(--font-display)] font-extrabold text-5xl md:text-6xl text-ink tracking-tight">
        {siteMeta.name}
      </h1>
      <p className="mt-3 text-canyon text-xs uppercase tracking-[0.16em] font-semibold">
        {siteMeta.role} · {siteMeta.location}
      </p>
      <p className="mt-6 mx-auto max-w-[60ch] text-ink text-lg leading-relaxed">
        {aboutIntro}
      </p>
    </SectionShell>
  );
}
