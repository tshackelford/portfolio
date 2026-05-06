"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Vertical offset in px before reveal. Default 12. */
  offset?: number;
  /** Duration in seconds. Default 0.4. */
  duration?: number;
  /** Delay in seconds. Default 0. */
  delay?: number;
};

export function FadeReveal({
  children,
  className,
  offset = 12,
  duration = 0.4,
  delay = 0,
}: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
