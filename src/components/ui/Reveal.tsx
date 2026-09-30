"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { VIEWPORT, revealVariants, staggerVariants, type Direction } from "@/lib/motion";

const tags = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  figure: motion.figure,
} as const;

type Tag = keyof typeof tags;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Travel distance in px. */
  y?: number;
  /** Which way the content travels as it appears. */
  direction?: Direction;
  /**
   * Stagger mode: this element doesn't move itself; each <RevealItem> child
   * reveals in turn. Pass a number to override the gap between children (seconds).
   */
  stagger?: boolean | number;
  as?: Tag;
};

/** Reveals content (or, with `stagger`, its <RevealItem> children) the first time it scrolls into view. */
export function Reveal({ children, delay = 0, className, y = 28, direction = "up", stagger, as = "div" }: RevealProps) {
  const reduce = useReducedMotion() ?? false;
  const Component = tags[as] as typeof motion.div;
  const variants = stagger
    ? staggerVariants(delay, typeof stagger === "number" ? stagger : undefined)
    : revealVariants(direction, y, reduce, delay);

  return (
    <Component className={className} variants={variants} initial="hidden" whileInView="show" viewport={VIEWPORT}>
      {children}
    </Component>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  distance?: number;
  as?: Tag;
};

/** One staggered child of <Reveal stagger>. */
export function RevealItem({ children, className, direction = "up", distance = 28, as = "div" }: RevealItemProps) {
  const reduce = useReducedMotion() ?? false;
  const Component = tags[as] as typeof motion.div;
  return (
    <Component className={className} variants={revealVariants(direction, distance, reduce)}>
      {children}
    </Component>
  );
}
