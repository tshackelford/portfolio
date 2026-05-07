import { PageHeader } from "../_about/PageHeader";
import { CareerSnapshot } from "../_about/CareerSnapshot";
import { PersonalTopics } from "../_about/PersonalTopics";
import { aboutBody } from "@/content/personal";
import { FadeReveal } from "@/components/motion/FadeReveal";

export const metadata = {
  title: "About — Thomas Shackelford",
  description:
    "Thomas Shackelford — Senior Software Engineer in Lakewood, CA. Thirteen years in fintech. Travel, gardening, camping.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="A few things about me." />
      <FadeReveal>
        <section className="mx-auto max-w-[72ch] px-6 py-16 space-y-5 text-lg leading-relaxed text-ink">
          {aboutBody.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      </FadeReveal>
      <CareerSnapshot />
      <PersonalTopics />
    </>
  );
}
