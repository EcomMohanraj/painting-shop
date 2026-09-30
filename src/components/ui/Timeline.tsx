"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { SPRING } from "@/lib/motion";
import { Reveal } from "./Reveal";

type Milestone = { year: string; text: string };

/**
 * Scroll narrative: a gold line fills down the timeline as you read, and each
 * milestone slides in from its side (alternating left/right on desktop).
 */
export function Timeline({ items }: { items: Milestone[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div className="relative">
      {/* Track + scroll-driven fill (transform only). */}
      <span aria-hidden className="absolute bottom-0 left-[1.4rem] top-0 w-0.5 bg-navy-100 lg:left-1/2 lg:-ml-px" />
      <motion.span
        aria-hidden
        style={{ scaleY: reduce ? 1 : fill }}
        className="absolute bottom-0 left-[1.4rem] top-0 w-0.5 origin-top bg-gold-400 lg:left-1/2 lg:-ml-px"
      />

      <ol ref={ref} className="relative space-y-16 lg:space-y-24">
        {items.map((m, i) => {
          const right = i % 2 === 1;
          return (
            <li key={m.year} className="relative pl-16 lg:grid lg:grid-cols-2 lg:gap-24 lg:pl-0">
              <motion.span
                aria-hidden
                className="absolute left-[1.4rem] top-3 -ml-3 h-6 w-6 rounded-full border-4 border-white bg-gold-400 shadow-lift lg:left-1/2"
                initial={reduce ? false : { scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-35% 0px" }}
                transition={SPRING}
              />
              <Reveal direction={right ? "left" : "right"} className={right ? "lg:col-start-2" : "lg:text-right"}>
                <p className="font-display text-display-md font-extrabold text-navy-900">{m.year}</p>
                <p className={`mt-3 max-w-md text-lg leading-relaxed text-charcoal-600 ${right ? "" : "lg:ml-auto"}`}>{m.text}</p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
