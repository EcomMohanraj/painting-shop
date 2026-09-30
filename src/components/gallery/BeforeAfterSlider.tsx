"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import type { GalleryProject } from "@/data/gallery";
import { SPRING } from "@/lib/motion";
import { PHOTO_BLUR } from "@/lib/image";

/** The handle snaps to the middle when released within this many % of it. */
const SNAP_AT = 50;
const SNAP_RANGE = 7;
/** Where scroll-scrubbing starts (mostly "before") before settling at 50%. */
const SCRUB_FROM = 84;

const clamp = (v: number) => Math.min(100, Math.max(0, v));

type BeforeAfterSliderProps = {
  project: GalleryProject;
  /** Size classes for the frame (default: 4:3). */
  className?: string;
  sizes?: string;
};

/**
 * Drag (or use the arrow keys) to compare before/after.
 * Until the visitor touches it, scrolling scrubs the reveal. Everything moves
 * with transforms only: the "before" layer slides in a clipping window.
 */
export function BeforeAfterSlider({
  project,
  className = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: BeforeAfterSliderProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const dragging = useRef(false);
  const [active, setActive] = useState(false);
  const id = useId();

  const target = useMotionValue(SNAP_AT); // where the handle should be (0–100)
  const smooth = useSpring(target, { stiffness: 420, damping: 42, mass: 0.6 });
  const pos = reduce ? target : smooth;

  // Scroll-scrub until the first interaction.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 55%"] });
  const scrub = (p: number) => {
    if (!reduce && !touched.current) target.set(SCRUB_FROM + (SNAP_AT - SCRUB_FROM) * p);
  };
  useMotionValueEvent(scrollYProgress, "change", scrub);
  useEffect(() => scrub(scrollYProgress.get()), [reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  // "Before" layer: the window slides left while its content slides right.
  const windowX = useTransform(pos, (v) => `${v - 100}%`);
  const contentX = useTransform(pos, (v) => `${100 - v}%`);
  const beforeLabel = useTransform(pos, [0, 18], [0, 1]);
  const afterLabel = useTransform(pos, [82, 100], [1, 0]);

  const setFromPointer = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    target.set(clamp(((clientX - r.left) / r.width) * 100));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    touched.current = true;
    dragging.current = true;
    setActive(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    // Touch: wait for movement so a vertical scroll gesture doesn't jump the handle.
    if (e.pointerType === "mouse") setFromPointer(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) setFromPointer(e.clientX);
  };
  const release = () => {
    if (!dragging.current) return;
    dragging.current = false;
    setActive(false);
    // Magnetic snap to the middle.
    if (Math.abs(target.get() - SNAP_AT) < SNAP_RANGE) animate(target, SNAP_AT, SPRING);
  };

  return (
    <div
      ref={ref}
      data-cursor="drag"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      className={`relative w-full touch-pan-y select-none overflow-hidden bg-navy-50 ${className}`}
    >
      {/* After (bottom layer) */}
      <Panel src={project.after} alt={`${project.title} — after`} variant="after" color={project.afterColor} sizes={sizes} />

      {/* Before (top layer, revealed up to the handle) */}
      <motion.div aria-hidden={!project.before} className="absolute inset-0 overflow-hidden" style={{ x: windowX }}>
        <motion.div className="absolute inset-0" style={{ x: contentX }}>
          <Panel src={project.before} alt={`${project.title} — before`} variant="before" color={project.afterColor} sizes={sizes} />
        </motion.div>
      </motion.div>

      <motion.span
        style={{ opacity: beforeLabel }}
        className="pointer-events-none absolute left-3 top-3 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
      >
        Before
      </motion.span>
      <motion.span
        style={{ opacity: afterLabel }}
        className="pointer-events-none absolute right-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-xs font-semibold text-navy-950"
      >
        After
      </motion.span>

      {/* Keyboard / screen-reader control. Visually hidden; focus shows on the handle. */}
      <SliderInput id={id} title={project.title} value={target} onUse={() => (touched.current = true)} />

      {/* Paint-drip divider + handle, riding on the same transform as the window's edge. */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ x: windowX }}>
        <div className="absolute inset-y-0 right-0 w-[3px] translate-x-1/2 bg-white shadow-[0_0_12px_rgba(10,20,38,0.35)]" />
        <Drip className="right-0 top-0 h-7 w-3 translate-x-[35%]" />
        <Drip className="right-0 top-[38%] h-5 w-2.5 translate-x-[40%]" />
        <Drip className="right-0 top-[71%] h-8 w-3 translate-x-[35%]" />
        <motion.span
          animate={{ scale: active ? 1.12 : 1 }}
          transition={SPRING}
          className="absolute right-0 top-1/2 -mr-6 -mt-6 grid h-12 w-12 place-items-center rounded-full bg-white text-navy-900 shadow-lift ring-4 ring-gold-400"
        >
          <MoveHorizontal className="h-5 w-5" />
        </motion.span>
      </motion.div>
    </div>
  );
}

/**
 * The accessible range input. Kept in its own component so the per-frame
 * value updates re-render only this input, not the images.
 */
function SliderInput({ id, title, value, onUse }: { id: string; title: string; value: MotionValue<number>; onUse: () => void }) {
  const [current, setCurrent] = useState(Math.round(value.get()));
  useMotionValueEvent(value, "change", (v) => setCurrent(Math.round(v)));

  return (
    <>
      <label htmlFor={id} className="sr-only">
        Compare before and after for {title}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={current}
        aria-valuetext={`${current}% before photo shown`}
        onChange={(e) => {
          onUse();
          value.set(Number(e.target.value));
        }}
        className="peer sr-only"
      />
      {/* Focus ring for keyboard users (the input itself is invisible). */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] ring-inset peer-focus-visible:ring-4 peer-focus-visible:ring-gold-400" />
    </>
  );
}

/** A small paint drip running down the divider. */
function Drip({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 12 28" className={`absolute drop-shadow ${className}`}>
      <path d="M2 0h8v15c0 4.5-1.8 9-4 9s-4-4.5-4-9V0z" fill="white" />
    </svg>
  );
}

function Panel({
  src,
  alt,
  variant,
  color,
  sizes,
}: {
  src?: string;
  alt: string;
  variant: "before" | "after";
  color: string;
  sizes: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        draggable={false}
        placeholder="blur"
        blurDataURL={PHOTO_BLUR}
        className="object-cover"
      />
    );
  }

  // Placeholder until real photos are added in the admin.
  const isBefore = variant === "before";
  return (
    <div
      role="img"
      aria-label={`${alt} (placeholder)`}
      className="absolute inset-0 grid place-items-center"
      style={
        isBefore
          ? {
              backgroundColor: "#a8a29e",
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(87,83,78,.45) 0 12%, transparent 13%), radial-gradient(circle at 70% 65%, rgba(87,83,78,.35) 0 16%, transparent 17%), radial-gradient(circle at 85% 20%, rgba(68,64,60,.3) 0 8%, transparent 9%)",
            }
          : { backgroundColor: color }
      }
    >
      <span className={`text-xs font-medium uppercase tracking-widest ${isBefore ? "text-stone-700/70" : "text-navy-900/40"}`}>
        {isBefore ? "Before photo" : "After photo"}
      </span>
    </div>
  );
}
