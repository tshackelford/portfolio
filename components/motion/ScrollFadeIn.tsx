"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";
type ElementType = "div" | "li";

const directionOffsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
};

type Props = {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  /** Render as this HTML element. Default "div". Use "li" inside <ul>/<ol>. */
  as?: ElementType;
};

export function ScrollFadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.4,
  className,
  as = "div",
}: Props) {
  const shouldReduce = useReducedMotion();
  const offset = directionOffsets[direction];

  if (shouldReduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = as === "li" ? motion.li : motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
