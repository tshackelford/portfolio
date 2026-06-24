"use client";

import { useEffect, useRef } from "react";

type Variant = "hero" | "work" | "contact";

export function SectionBackground({ variant }: { variant: Variant }) {
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = haloRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const off = (r.top + r.height / 2 - vh / 2) * -0.04;
      el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (variant === "hero") {
    return (
      <>
        <div
          ref={haloRef}
          className="absolute -top-[150px] -right-[110px] h-[440px] w-[440px] will-change-transform"
          style={{
            background:
              "radial-gradient(circle at center, rgba(232,181,130,0.34) 0%, rgba(232,181,130,0.13) 26%, rgba(255,245,232,0) 56%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[200px]"
          style={{
            background:
              "linear-gradient(to top, rgba(183,99,70,0.14) 0%, rgba(232,181,130,0.06) 45%, rgba(255,245,232,0) 100%)",
          }}
        />
      </>
    );
  }

  if (variant === "work") {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(100% 60% at 15% 100%, rgba(122,138,94,0.10) 0%, rgba(255,245,232,0) 55%)",
        }}
      />
    );
  }

  return (
    <div
      className="absolute inset-x-0 bottom-0 h-[180px]"
      style={{
        background:
          "linear-gradient(to top, rgba(232,181,130,0.14) 0%, rgba(255,245,232,0) 100%)",
      }}
    />
  );
}