import { Sun } from "@/components/illustrations/Sun";
import { Ridge } from "@/components/illustrations/Ridge";

type Props = { eyebrow: string; title: string };

export function PageHeader({ eyebrow, title }: Props) {
  return (
    <section
      aria-labelledby="page-title"
      className="relative overflow-hidden bg-gradient-to-b from-sand to-sun/30"
    >
      <div className="absolute top-6 right-12 w-20 h-20 text-mesa" aria-hidden="true">
        <Sun className="w-full h-full" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 text-sage" aria-hidden="true">
        <Ridge className="w-full h-full" />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-6 py-20">
        <p className="text-canyon font-semibold text-sm uppercase tracking-[0.14em]">
          {eyebrow}
        </p>
        <h1
          id="page-title"
          className="mt-2 font-[family-name:var(--font-display)] font-extrabold text-5xl md:text-6xl text-ink"
        >
          {title}
        </h1>
      </div>
    </section>
  );
}
