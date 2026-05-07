import { careerEntries } from "@/content/career";
import { FadeReveal } from "@/components/motion/FadeReveal";

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

export function CareerSnapshot() {
  return (
    <FadeReveal>
      <section
        aria-labelledby="career-heading"
        className="mx-auto max-w-[1280px] px-6 py-16"
      >
        <h2
          id="career-heading"
          className="font-[family-name:var(--font-display)] font-extrabold text-3xl text-ink mb-8"
        >
          Where I've been
        </h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {careerEntries.map((e) => (
            <li
              key={e.company}
              className="bg-bone p-6 rounded-xl border border-mesa/20"
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
      </section>
    </FadeReveal>
  );
}
