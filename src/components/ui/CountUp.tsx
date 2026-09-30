"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { EASE } from "@/lib/motion";

/**
 * Counts from 0 up to `value` the first time it scrolls into view.
 * The final value reserves the width (no layout shift) and is what screen readers hear.
 */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const count = useMotionValue(0);
  const text = useTransform(count, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 1.2, ease: EASE });
    return () => controls.stop();
  }, [inView, reduce, value, count]);

  return (
    <span ref={ref} className="relative inline-block tabular-nums">
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span aria-hidden className="invisible">
        {value}
        {suffix}
      </span>
      <motion.span aria-hidden className="absolute inset-0 text-center">
        {text}
      </motion.span>
    </span>
  );
}
