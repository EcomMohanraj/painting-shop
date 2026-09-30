import type { Transition, Variants } from "framer-motion";

// The site's motion system. Every Framer Motion transition on the public site
// uses these values so movement feels like one consistent "brush".

/** Signature smooth-deceleration curve (also available in Tailwind as `ease-brand`). */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Entrance animations never run longer than DURATION.slow. */
export const DURATION = { fast: 0.3, base: 0.5, slow: 0.6 } as const;

/** Delay between staggered children, in seconds (keep within 60–100ms). */
export const STAGGER = 0.08;

/** Snappy spring for UI feedback (buttons, handles, swatches). */
export const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

/** Soft spring for things that follow the pointer or scroll. */
export const SPRING_SOFT = { type: "spring", stiffness: 120, damping: 20, mass: 0.8 } as const;

/** A tween on the signature curve. */
export const ease = (duration: number = DURATION.base, delay = 0): Transition => ({ duration, delay, ease: EASE });

/** Which way an element travels as it appears ("up" = rises from below). */
export type Direction = "up" | "down" | "left" | "right" | "none";

function offset(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

/**
 * Hidden/shown variants for a revealed element. With reduced motion it's a
 * plain, quick fade with no movement.
 */
export function revealVariants(direction: Direction = "up", distance = 28, reduce = false, delay = 0): Variants {
  const from = reduce ? { x: 0, y: 0 } : offset(direction, distance);
  return {
    hidden: { opacity: 0, ...from },
    show: { opacity: 1, x: 0, y: 0, transition: ease(reduce ? DURATION.fast : DURATION.base, delay) },
  };
}

/** Parent variants that stagger their children's "show". */
export const staggerVariants = (delay = 0, stagger = STAGGER): Variants => ({
  hidden: {},
  show: { transition: { delayChildren: delay, staggerChildren: stagger } },
});

/** Standard viewport options for scroll-triggered reveals. */
export const VIEWPORT = { once: true, margin: "-60px" } as const;
