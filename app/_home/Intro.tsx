import { FadeReveal } from "@/components/motion/FadeReveal";

export function Intro() {
  return (
    <FadeReveal>
      <section
        aria-labelledby="intro-heading"
        className="mx-auto max-w-[72ch] px-6 py-24"
      >
        <h2 id="intro-heading" className="sr-only">
          Introduction
        </h2>
        <p className="text-xl text-ink leading-relaxed">
          Thirteen years building accessible web applications for financial
          institutions you&rsquo;ve banked at without knowing it. I write code that
          the next person can change without fear, mentor the engineers around
          me, and care more about the craft than the stack.
        </p>
      </section>
    </FadeReveal>
  );
}
