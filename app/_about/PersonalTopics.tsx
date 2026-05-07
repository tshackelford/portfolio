import { personalTopics } from "@/content/personal";
import { Compass } from "@/components/illustrations/Compass";
import { Sprout } from "@/components/illustrations/Sprout";
import { Campfire } from "@/components/illustrations/Campfire";
import { FadeReveal } from "@/components/motion/FadeReveal";

const iconFor: Record<string, React.ComponentType<{ className?: string }>> = {
  travel: Compass,
  gardening: Sprout,
  camping: Campfire,
};

export function PersonalTopics() {
  return (
    <FadeReveal>
      <section
        aria-labelledby="personal-heading"
        className="mx-auto max-w-[1280px] px-6 py-16"
      >
        <h2
          id="personal-heading"
          className="font-[family-name:var(--font-display)] font-extrabold text-3xl text-ink mb-8"
        >
          Outside the work
        </h2>
        <ul className="grid gap-8 md:grid-cols-3">
          {personalTopics.map((t) => {
            const Icon = iconFor[t.id];
            return (
              <li key={t.id}>
                {Icon ? <Icon className="w-12 h-12 text-mesa mb-3" /> : null}
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink mb-2">
                  {t.title}
                </h3>
                <p className="text-ink/85 leading-relaxed">{t.body}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </FadeReveal>
  );
}
