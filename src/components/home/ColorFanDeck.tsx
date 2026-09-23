"use client";

import { useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, MousePointerClick } from "lucide-react";

// Illustrative shades for the hero fan deck (not a specific paint brand's range).
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

/** How many cards are fanned out at once. */
const VISIBLE = 4;

/** Fan position for a card `depth` places behind the top card. */
const pose = (depth: number) => ({
  x: -depth * 14,
  y: depth * 6,
  rotate: 4 - depth * 7,
  scale: 1 - depth * 0.035,
  opacity: 1,
  zIndex: 10 - depth,
});

// Cards animate to pose(depth); these cover arriving/leaving cards.
// `custom` = direction: 1 (next) or -1 (previous).
const variants: Variants = {
  // Next: new card slides in at the back. Previous: it comes back in from the right, on top.
  enter: (dir: number) => (dir > 0 ? { ...pose(VISIBLE), opacity: 0 } : { x: 240, y: -30, rotate: 22, scale: 1, opacity: 0, zIndex: 20 }),
  // Next: the top card flies off to the right. Previous: the back card fades away behind.
  exit: (dir: number) => (dir > 0 ? { x: 260, y: -40, rotate: 24, opacity: 0, zIndex: 20 } : { ...pose(VISIBLE), opacity: 0 }),
};

// Reduced motion: cards swap with a quick fade instead of flying.
const reducedVariants: Variants = {
  enter: { opacity: 0 },
  exit: { opacity: 0, transition: { duration: 0 } },
};

export function ColorFanDeck() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [interacted, setInteracted] = useState(false);

  const n = colors.length;
  const current = colors[index];
  const go = (d: 1 | -1) => {
    setDir(d);
    setIndex((i) => (i + d + n) % n);
    setInteracted(true);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };

  // Back-to-front so the top card is last in the DOM.
  const cards = Array.from({ length: VISIBLE }, (_, depth) => ({ depth, color: colors[(index + depth) % n] })).reverse();

  return (
    <div
      role="group"
      aria-roledescription="colour fan deck"
      aria-label="Paint colour samples"
      onKeyDown={onKeyDown}
      className="relative mx-auto flex aspect-square w-full max-w-md flex-col"
    >
      <div className="relative flex-1">
        <AnimatePresence initial={false} custom={dir}>
          {cards.map(({ depth, color }) => {
            const isTop = depth === 0;
            return (
              <motion.div
                key={color.name}
                custom={dir}
                variants={reduce ? reducedVariants : variants}
                initial="enter"
                animate={pose(depth)}
                exit="exit"
                transition={reduce ? { duration: 0.2 } : { type: "spring", stiffness: 260, damping: 26 }}
                className={`absolute inset-x-[12%] top-[4%] origin-bottom ${isTop ? "" : "pointer-events-none"}`}
                aria-hidden={!isTop}
              >
                <motion.button
                  type="button"
                  tabIndex={isTop ? 0 : -1}
                  onClick={() => go(1)}
                  aria-label={`${color.name}, ${color.hex}. Show next colour`}
                  whileHover={reduce || !isTop ? undefined : { y: -6 }}
                  whileTap={reduce || !isTop ? undefined : { scale: 0.98 }}
                  className="block w-full cursor-pointer rounded-2xl border border-white bg-white p-3 text-left shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
                >
                  <span className="relative block aspect-[4/3] rounded-xl" style={{ backgroundColor: color.hex }}>
                    {isTop && !interacted && (
                      <motion.span
                        initial={{ opacity: 0, y: 6 }}
                        animate={reduce ? { opacity: 1, y: 0 } : { opacity: [0.85, 1, 0.85], y: 0, scale: [1, 1.05, 1] }}
                        transition={reduce ? { duration: 0.3 } : { delay: 1.2, duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-navy-900 shadow"
                      >
                        <MousePointerClick className="h-3.5 w-3.5 text-gold-600" aria-hidden />
                        Tap to flip
                      </motion.span>
                    )}
                  </span>
                  <span className="flex items-end justify-between gap-2 px-1 pt-3">
                    <span>
                      <span className="block text-sm font-semibold text-navy-900">{color.name}</span>
                      <span className="block text-xs text-charcoal-500">{color.family}</span>
                    </span>
                    <span className="font-mono text-xs text-charcoal-500">{color.hex}</span>
                  </span>
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="relative z-30 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous colour"
          className="grid h-10 w-10 place-items-center rounded-full border border-navy-100 bg-white text-navy-900 shadow-sm transition-colors hover:border-gold-300 hover:bg-gold-50"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <span className="min-w-[4.5rem] text-center text-xs font-medium tabular-nums text-charcoal-500">
          {index + 1} / {n}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next colour"
          className="grid h-10 w-10 place-items-center rounded-full border border-navy-100 bg-white text-navy-900 shadow-sm transition-colors hover:border-gold-300 hover:bg-gold-50"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {/* Announces the new colour to screen readers after each flip. */}
      <p aria-live="polite" className="sr-only">
        {interacted ? `${current.name}, ${current.hex}, colour ${index + 1} of ${n}` : ""}
      </p>
    </div>
  );
}
