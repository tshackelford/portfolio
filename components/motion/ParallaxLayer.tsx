"use client";

import { useScroll, useTransform, motion } from "motion/react";
import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /**
   * Speed factor. 1 = scrolls with content, 0 = pinned, < 1 = slower (back layer),
   * > 1 = faster (foreground). Typical values: 0.3–0.8 for back, 1.0–1.4 for fore.
   */
  speed?: number;
  className?: string;
};

export function ParallaxLayer({ children, speed = 0.5, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Map scroll progress (0..1) to a vertical translate. The travel
  // distance scales with the speed factor: lower speed = less travel = "further away".
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${(1 - speed) * 50}%`]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
