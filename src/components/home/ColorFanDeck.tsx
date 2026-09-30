"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DURATION, SPRING, ease } from "@/lib/motion";
import { PHOTO_BLUR } from "@/lib/image";

// Illustrative shades for the colour studio (not a specific paint brand's range).
const colors = [
  { name: "Ivory Mist", hex: "#F4ECDC", family: "Warm white" },
  { name: "Sage Leaf", hex: "#B5C4A7", family: "Soft green" },
  { name: "Warm Terracotta", hex: "#C97C5D", family: "Earthy red" },
  { name: "Ocean Blue", hex: "#4A7A96", family: "Coastal blue" },
  { name: "Sunny Yellow", hex: "#F4C430", family: "Bright yellow" },
  { name: "Harbour Blue", hex: "#2C4A7C", family: "Deep navy" },
  { name: "Blush Pink", hex: "#E8B4B8", family: "Soft pink" },
  { name: "Olive Grove", hex: "#7D8254", family: "Earthy green" },
  { name: "Lavender Haze", hex: "#B8A9C9", family: "Muted purple" },
  { name: "Sandstone", hex: "#D8C3A5", family: "Warm neutral" },
  { name: "Teal Lagoon", hex: "#2F7F7A", family: "Rich teal" },
  { name: "Charcoal Slate", hex: "#4A4E57", family: "Deep grey" },
];

export type FanPhoto = { src: string; alt: string; caption?: string };

/** Fan angle (deg) of strip `i` when fully open. */
const MAX_ANGLE = 52;
const angleFor = (i: number, n: number) => (n === 1 ? 0 : -MAX_ANGLE + (2 * MAX_ANGLE * i) / (n - 1));

/** How far the fan is open when idle / before it scrolls into view (0–1). */
const CLOSED = 0.16;

/**
 * The site's signature widget: a paint fan deck. It opens with spring physics
 * as it scrolls into view (and fully on hover); picking a strip washes that
 * colour across a real finished project photo, like a roller pass.
 */
export function ColorFanDeck({ photos = [] }: { photos?: FanPhoto[] }) {
  const reduce = useReducedMotion();
  const fanRef = useRef<HTMLDivElement>(null);
  const stripRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [announce, setAnnounce] = useState(false);

  const n = colors.length;
  const current = colors[index];
  const photo = photos.length ? photos[index % photos.length] : undefined;

  // Openness = whichever is greater: scroll progress or hover, smoothed by a spring.
  const hover = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: fanRef, offset: ["start end", "center center"] });
  const target = useTransform([scrollYProgress, hover], ([p, h]: number[]) => Math.max(CLOSED + p * (1 - CLOSED), h));
  const springSpread = useSpring(target, { stiffness: 140, damping: 17, mass: 0.9 });
  const fullyOpen = useMotionValue(1);
  const spread = reduce ? fullyOpen : springSpread;

  const select = (i: number, focus = false) => {
    const next = (i + n) % n;
    setIndex(next);
    setAnnounce(true);
    if (focus) stripRefs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in moves) {
      e.preventDefault();
      select(index + moves[e.key], true);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      select(e.key === "Home" ? 0 : n - 1, true);
    }
  };

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      {/* Stage: the selected shade washed over a real project photo. */}
      <figure className="relative">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-navy-100 shadow-hero">
          <AnimatePresence initial={false}>
            {photo && (
              <motion.div
                key={photo.src}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={ease(DURATION.slow)}
              >
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" placeholder="blur" blurDataURL={PHOTO_BLUR} className="object-cover" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Colour wash: each new shade rolls in over the last. With a photo it
              blends as "color", so the room keeps its light but takes the new hue. */}
          <AnimatePresence initial={false}>
            <motion.div
              key={current.hex}
              aria-hidden
              className={`absolute inset-0 ${photo ? "opacity-60 mix-blend-color" : ""}`}
              style={{ backgroundColor: current.hex }}
              initial={reduce ? { opacity: 0, zIndex: 2 } : { clipPath: "inset(0 100% 0 0)", zIndex: 2 }}
              animate={reduce ? { opacity: photo ? 0.6 : 1, zIndex: 2 } : { clipPath: "inset(0 0% 0 0)", zIndex: 2 }}
              exit={{ zIndex: 1, opacity: 0, transition: { zIndex: { duration: 0 }, opacity: { duration: 0, delay: DURATION.slow } } }}
              transition={ease(DURATION.slow)}
            />
          </AnimatePresence>
          <div aria-hidden className="absolute inset-0 z-[3] bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />

          <figcaption className="absolute inset-x-4 bottom-4 z-[4] flex items-end justify-between gap-4 rounded-2xl bg-white/90 p-4 shadow-lift backdrop-blur sm:inset-x-6 sm:bottom-6 sm:p-5">
            <span className="flex min-w-0 items-center gap-4">
              <span className="h-12 w-12 shrink-0 rounded-xl ring-1 ring-black/5 sm:h-14 sm:w-14" style={{ backgroundColor: current.hex }} />
              <span className="min-w-0">
                <span className="block truncate font-display text-lg font-bold text-navy-900 sm:text-xl">{current.name}</span>
                <span className="block truncate text-xs text-charcoal-500 sm:text-sm">
                  {current.family}
                  {photo?.caption ? ` · shown in ${photo.caption}` : ""}
                </span>
              </span>
            </span>
            <span className="shrink-0 font-mono text-xs text-charcoal-500">{current.hex}</span>
          </figcaption>
        </div>
      </figure>

      {/* The fan deck itself. */}
      <div>
        <div
          ref={fanRef}
          onPointerEnter={(e) => e.pointerType === "mouse" && hover.set(1)}
          onPointerLeave={() => hover.set(0)}
          className="relative mx-auto aspect-[1.35/1] w-full max-w-lg"
        >
          <div role="radiogroup" aria-label="Paint colour samples" onKeyDown={onKeyDown} className="absolute inset-0">
            {colors.map((color, i) => (
              <FanStrip
                key={color.name}
                buttonRef={(el) => {
                  stripRefs.current[i] = el;
                }}
                color={color}
                i={i}
                n={n}
                spread={spread}
                selected={i === index}
                onSelect={() => select(i)}
                reduce={!!reduce}
              />
            ))}
          </div>
          {/* Rivet the strips pivot around. */}
          <span aria-hidden className="absolute bottom-[9.8%] left-1/2 z-40 -mb-2.5 -ml-2.5 h-5 w-5 rounded-full bg-navy-900 ring-4 ring-white" />
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => select(index - 1)}
            aria-label="Previous colour"
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy-900 shadow-lift transition-colors duration-300 ease-brand hover:bg-gold-400"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <span className="min-w-[4.5rem] text-center text-sm font-medium tabular-nums text-charcoal-500">
            {index + 1} / {n}
          </span>
          <button
            type="button"
            onClick={() => select(index + 1)}
            aria-label="Next colour"
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy-900 shadow-lift transition-colors duration-300 ease-brand hover:bg-gold-400"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-charcoal-500">Pick a strip — or use the arrow keys — to repaint the room.</p>

        {/* Announces the new colour to screen readers after each change. */}
        <p aria-live="polite" className="sr-only">
          {announce ? `${current.name}, ${current.family}, colour ${index + 1} of ${n}` : ""}
        </p>
      </div>
    </div>
  );
}

type FanStripProps = {
  color: (typeof colors)[number];
  i: number;
  n: number;
  spread: MotionValue<number>;
  selected: boolean;
  onSelect: () => void;
  reduce: boolean;
  buttonRef: (el: HTMLButtonElement | null) => void;
};

/** One paint strip, pivoting on the rivet. Its angle follows the fan's spring. */
function FanStrip({ color, i, n, spread, selected, onSelect, reduce, buttonRef }: FanStripProps) {
  const rotate = useTransform(spread, (s) => angleFor(i, n) * s);

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${color.name}, ${color.family}`}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      style={{ rotate, zIndex: selected ? n + 1 : i }}
      className="group absolute bottom-[5%] left-1/2 -ml-[7%] h-[80%] w-[14%] origin-[50%_94%] focus-visible:outline-none"
    >
      <motion.span
        className={`flex h-full flex-col gap-[4%] rounded-lg bg-white p-[7%] shadow-lift ring-2 transition-shadow duration-300 group-focus-visible:ring-navy-900 ${
          selected ? "ring-gold-400" : "ring-transparent"
        }`}
        animate={{ y: selected ? "-14%" : "0%" }}
        whileHover={reduce || selected ? undefined : { y: "-5%" }}
        transition={reduce ? ease(DURATION.fast) : SPRING}
      >
        <span className="flex-[3] rounded-[0.3rem]" style={{ backgroundColor: color.hex }} />
        <span className="flex-1 rounded-[0.3rem]" style={{ backgroundColor: `color-mix(in srgb, ${color.hex} 62%, white)` }} />
        <span className="flex-1 rounded-[0.3rem]" style={{ backgroundColor: `color-mix(in srgb, ${color.hex} 32%, white)` }} />
        <span className="h-[12%]" />
      </motion.span>
    </motion.button>
  );
}
