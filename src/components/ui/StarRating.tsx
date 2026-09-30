"use client";

import { motion, useReducedMotion } from "framer-motion";
import { STAGGER, VIEWPORT, ease } from "@/lib/motion";

const STAR = "M12 2.6l2.93 5.94 6.55.95-4.74 4.62 1.12 6.53L12 17.56l-5.86 3.08 1.12-6.53-4.74-4.62 6.55-.95L12 2.6z";

/** 1–5 stars whose outlines draw on, then fill, the first time they scroll into view. */
export function StarRating({ rating, className = "h-5 w-5" }: { rating: number; className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className="flex gap-1"
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: STAGGER } } }}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < rating;
        return (
          <svg key={i} viewBox="0 0 24 24" aria-hidden className={`${className} ${filled ? "text-gold-400" : "text-navy-100"}`}>
            <motion.path
              d={STAR}
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinejoin="round"
              variants={
                filled && !reduce
                  ? {
                      hidden: { pathLength: 0, fillOpacity: 0 },
                      show: { pathLength: 1, fillOpacity: 1, transition: { pathLength: ease(0.4), fillOpacity: ease(0.25, 0.3) } },
                    }
                  : undefined
              }
            />
          </svg>
        );
      })}
    </motion.div>
  );
}
