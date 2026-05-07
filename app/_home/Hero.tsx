import { Sun } from "@/components/illustrations/Sun";
import { Ridge } from "@/components/illustrations/Ridge";
import { Mesa } from "@/components/illustrations/Mesa";
import { Cliff } from "@/components/illustrations/Cliff";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { siteMeta } from "@/content/meta";
import { heroTagline } from "@/content/personal";
import Link from "next/link";
import type { Route } from "next";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[88vh] overflow-hidden flex items-center"
    >
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sand to-sun/40" aria-hidden="true" />
      {/* Sun (back) */}
      <ParallaxLayer speed={0.3} className="absolute top-[10%] right-[12%] w-32 h-32 text-mesa">
        <Sun className="w-full h-full" />
      </ParallaxLayer>
      {/* Back ridge — canyon-green */}
      <ParallaxLayer speed={0.5} className="absolute bottom-0 left-0 right-0 h-[55%] text-sage">
        <Ridge className="w-full h-full" />
      </ParallaxLayer>
      {/* Mid mesas — terra cotta */}
      <ParallaxLayer speed={0.8} className="absolute bottom-0 left-0 right-0 h-[40%] text-mesa">
        <Mesa className="w-full h-full" />
      </ParallaxLayer>
      {/* Foreground cliff — deepest clay */}
      <ParallaxLayer speed={1.1} className="absolute bottom-0 left-0 right-0 h-[28%] text-canyon">
        <Cliff className="w-full h-full" />
      </ParallaxLayer>

      {/* Content */}
      <div className="relative mx-auto max-w-[1280px] w-full px-6 py-16">
        <p className="text-canyon font-[family-name:var(--font-body)] uppercase tracking-[0.14em] text-sm font-semibold">
          {siteMeta.role} · {siteMeta.location}
        </p>
        <h1
          id="hero-heading"
          className="mt-3 font-[family-name:var(--font-display)] font-extrabold text-5xl md:text-7xl tracking-tight text-ink max-w-3xl"
        >
          {siteMeta.name}
        </h1>
        <p className="mt-5 text-ink/85 text-lg max-w-2xl leading-relaxed">{heroTagline}</p>
        <div className="mt-8 flex gap-4">
          <Link
            href={"/projects" as Route}
            className="bg-canyon text-bone px-5 py-3 rounded-md font-semibold hover:bg-canyon/90 transition-colors"
          >
            See projects
          </Link>
          <Link
            href={"/about" as Route}
            className="border-2 border-canyon text-canyon px-5 py-3 rounded-md font-semibold hover:bg-canyon hover:text-bone transition-colors"
          >
            About me
          </Link>
        </div>
      </div>
    </section>
  );
}
