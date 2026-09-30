"use client";

import { motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import type { ReactNode } from "react";
import { DURATION, VIEWPORT, ease } from "@/lib/motion";

// Negative vertical/side insets so descenders and italics are never clipped.
const HIDDEN = "inset(-25% 100% -25% -3%)";
const SHOWN = "inset(-25% -3% -25% -3%)";

type PaintWipeProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Reveal when scrolled into view instead of on mount. */
  inView?: boolean;
  /** Sweep a gold "roller" edge across with the reveal. */
  roller?: boolean;
};

/**
 * Reveals text left-to-right like a paint roller pass: a clip-path wipe,
 * optionally led by a gold roller edge. Reduced motion: a simple fade.
 * (The element tree is identical either way, so hydration always matches.)
 */
export function PaintWipe({ children, delay = 0, className = "", inView = false, roller = false }: PaintWipeProps) {
  const reduce = useReducedMotion();
  const trigger = (shown: TargetAndTransition) => (inView ? { whileInView: shown, viewport: VIEWPORT } : { animate: shown });

  return (
    <span className={`relative ${className}`}>
      <motion.span
        className="block"
        initial={reduce ? { opacity: 0 } : { clipPath: HIDDEN }}
        {...trigger(reduce ? { opacity: 1 } : { clipPath: SHOWN })}
        transition={ease(reduce ? DURATION.fast : DURATION.slow, delay)}
      >
        {children}
      </motion.span>
      {roller && (
        // A full-width track slides from -100% to 0; the roller edge sits at its
        // right-hand side, so it travels with the leading edge of the wipe.
        <span aria-hidden className={`pointer-events-none absolute inset-y-[6%] left-0 right-0 overflow-hidden ${reduce ? "hidden" : ""}`}>
          <motion.span
            className="absolute inset-0"
            initial={{ x: "-100%", opacity: 1 }}
            {...trigger({ x: "0%", opacity: 0 })}
            transition={{ x: ease(DURATION.slow, delay), opacity: ease(DURATION.fast, delay + DURATION.slow * 0.8) }}
          >
            <span className="absolute inset-y-0 right-0 w-[0.12em] rounded-full bg-gold-400" />
          </motion.span>
        </span>
      )}
    </span>
  );
}
