"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { Testimonial } from "@/data/testimonials";
import { DURATION, SPRING_SOFT, ease } from "@/lib/motion";
import { TestimonialCard } from "./TestimonialCard";

const AUTOPLAY_MS = 6500;
/** Swipe distance (px) or speed (px/s) that counts as a swipe. */
const SWIPE_DISTANCE = 70;
const SWIPE_VELOCITY = 450;

/**
 * Auto-advancing, swipeable testimonial carousel. Neighbouring cards sit
 * behind the active one with reduced scale/opacity for depth. Autoplay pauses
 * on hover, keyboard focus, when off-screen, via the pause button — and is off
 * entirely for reduced-motion users.
 */
export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false); // hover or focus inside
  const n = testimonials.length;
  const playing = n > 1 && !paused && !reduce;

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + n) % n), [n]);

  useEffect(() => {
    if (!playing || hold || !inView) return;
    const t = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [playing, hold, inView, index, go]);

  if (n === 0) return null;

  /** Signed distance from the active card, wrapping around (e.g. -1, 0, 1, 2). */
  const offsetOf = (i: number) => {
    let d = (i - index + n) % n;
    if (d > n / 2) d -= n;
    return d;
  };

  return (
    <div
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHold(false)}
    >
      {/* All cards share one grid cell, so the stage is as tall as the tallest card. */}
      <div className="grid">
        {testimonials.map((t, i) => {
          const off = offsetOf(i);
          const dist = Math.abs(off);
          const isActive = off === 0;
          return (
            <motion.div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              aria-hidden={!isActive}
              className="mx-auto w-full max-w-3xl [grid-area:1/1]"
              initial={false}
              animate={{
                x: `${off * (reduce ? 0 : 74)}%`,
                scale: reduce ? 1 : 1 - Math.min(dist, 2) * 0.12,
                opacity: isActive ? 1 : dist === 1 && !reduce ? 0.4 : 0,
                zIndex: 10 - dist,
              }}
              transition={reduce ? ease(DURATION.fast) : SPRING_SOFT}
              style={{ pointerEvents: isActive || dist === 1 ? "auto" : "none", touchAction: "pan-y" }}
              drag={isActive && n > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={(_, info) => {
                if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) go(1);
                else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) go(-1);
              }}
              onClick={() => !isActive && go(off)}
            >
              <div className={isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}>
                <TestimonialCard testimonial={t} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {n > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy-900 shadow-lift transition-colors duration-300 hover:bg-gold-400"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>

          <div className="flex items-center gap-1 px-2">
            {testimonials.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial ${i + 1}${t.name ? ` from ${t.name}` : ""}`}
                aria-current={i === index}
                className="grid h-8 w-8 place-items-center"
              >
                <span className={`block h-2 rounded-full transition-all duration-300 ease-brand ${i === index ? "w-7 bg-navy-900" : "w-2 bg-navy-200"}`} />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy-900 shadow-lift transition-colors duration-300 hover:bg-gold-400"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>

          {!reduce && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play testimonials automatically" : "Pause automatic testimonials"}
              className="ml-2 grid h-11 w-11 place-items-center rounded-full text-charcoal-600 transition-colors hover:bg-white hover:text-navy-900"
            >
              {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
            </button>
          )}
        </div>
      )}

      {/* Announce changes only when the visitor is driving the carousel. */}
      <p aria-live={playing && !hold ? "off" : "polite"} className="sr-only">
        Testimonial {index + 1} of {n}: {testimonials[index].name}
      </p>
    </div>
  );
}
