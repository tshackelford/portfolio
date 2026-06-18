import { careerEntries } from "@/content/career";
import { SectionShell } from "@/components/shell/SectionShell";

function formatRange(start: string, end: string) {
  const fmt = (s: string) =>
    s === "present"
      ? "Present"
      : new Date(`${s}-01`).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
  return `${fmt(start)} — ${fmt(end)}`;
}

export function Career() {
  return (
    <SectionShell id="career">
      <p className="text-canyon text-xs uppercase tracking-[0.16em] font-semibold">
        § Career
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] font-extrabold text-3xl md:text-4xl text-ink">
        Where I&rsquo;ve been
      </h2>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {careerEntries.map((e) => (
          <li
            key={e.company}
            className="bg-sand/40 p-6 rounded-xl border border-canyon/15"
          >
            <p className="text-canyon text-xs uppercase tracking-[0.14em] font-semibold">
              {formatRange(e.start, e.end)}
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-ink">
              {e.company}
            </h3>
            <p className="mt-1 text-dust text-sm">{e.role}</p>
            <p className="mt-3 text-ink leading-relaxed">{e.oneLine}</p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
