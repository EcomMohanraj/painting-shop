"use client";

import { motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import { DURATION, VIEWPORT, ease } from "@/lib/motion";

const PATHS = {
  // A long, slightly wavy roller stroke — used as a background accent.
  sweep: "M16 78 C 110 34, 190 104, 300 62 S 488 28, 584 66",
  // A short underline flick under a word.
  underline: "M8 22 C 70 10, 150 30, 232 14",
};

type BrushStrokeProps = {
  variant?: keyof typeof PATHS;
  className?: string;
  strokeWidth?: number;
  delay?: number;
  /** Draw when scrolled into view instead of on mount. */
  inView?: boolean;
};

/** Decorative paint stroke that draws itself on. Colour comes from `currentColor`. */
export function BrushStroke({ variant = "sweep", className = "", strokeWidth, delay = 0, inView = false }: BrushStrokeProps) {
  const reduce = useReducedMotion();
  const viewBox = variant === "sweep" ? "0 0 600 120" : "0 0 240 36";
  const width = strokeWidth ?? (variant === "sweep" ? 44 : 9);
  const drawn: TargetAndTransition = { pathLength: 1, opacity: 1 };
  const trigger = inView ? { whileInView: drawn, viewport: VIEWPORT } : { animate: drawn };

  return (
    <svg aria-hidden viewBox={viewBox} fill="none" preserveAspectRatio="none" className={className}>
      <motion.path
        d={PATHS[variant]}
        stroke="currentColor"
        strokeWidth={width}
        strokeLinecap="round"
        initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 1 }}
        {...trigger}
        transition={ease(DURATION.slow, delay)}
      />
      {variant === "sweep" && (
        // Thin dry-brush trail along the main stroke.
        <motion.path
          d={PATHS.sweep}
          stroke="currentColor"
          strokeOpacity={0.45}
          strokeWidth={4}
          strokeLinecap="round"
          transform="translate(0 30)"
          initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 1 }}
          {...trigger}
          transition={ease(DURATION.slow, delay + 0.08)}
        />
      )}
    </svg>
  );
}
