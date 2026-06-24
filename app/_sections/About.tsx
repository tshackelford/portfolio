import Image from "next/image";
import { aboutIntro } from "@/content/personal";
import { siteMeta } from "@/content/meta";
import { skillGroups } from "@/content/skills";
import { SectionShell } from "@/components/shell/SectionShell";
import { SectionBackground } from "@/components/shell/SectionBackground";

export function About() {
  return (
    <SectionShell
      id="about"
      className="text-center"
      background={<SectionBackground variant="hero" />}
    >
      <div className="flex justify-center mb-7">
        <Image
          src="/portrait.webp"
          alt={`${siteMeta.name}, ${siteMeta.role}`}
          width={140}
          height={140}
          priority
          className="h-[140px] w-[140px] rounded-full object-cover border-[3px] border-bone shadow-[0_6px_18px_rgba(140,62,40,0.20)]"
        />
      </div>

      <h1 className="font-[family-name:var(--font-display)] font-extrabold text-5xl md:text-6xl text-ink tracking-tight">
        {siteMeta.name}
      </h1>
      <p className="mt-3 text-canyon text-xs uppercase tracking-[0.16em] font-semibold">
        {siteMeta.role} · {siteMeta.location}
      </p>
      <p className="mt-6 mx-auto max-w-[60ch] text-ink text-lg leading-relaxed">
        {aboutIntro}
      </p>

      <div className="mt-7 text-center">
        <div className="inline-flex flex-col gap-[11px] text-left bg-[rgba(255,253,248,0.7)] border border-canyon/15 rounded-2xl px-6 py-[18px] shadow-[0_2px_10px_rgba(140,62,40,0.06)]">
          {skillGroups.map((g) => (
            <div key={g.label} className="flex items-baseline gap-3">
              <span className="flex-none w-[74px] text-canyon text-[10px] uppercase tracking-[0.14em] font-semibold whitespace-nowrap">
                {g.label}
              </span>
              <span className="text-ink text-[13px] leading-normal">{g.items}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}