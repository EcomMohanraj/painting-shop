"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { DURATION, ease } from "@/lib/motion";
import { FINE_POINTER, useMediaQuery } from "@/lib/use-media-query";

type Mode = "hidden" | "default" | "link" | "drag" | "text";

const TEXT = 'input:not([type="range"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable]';
const LINK = 'a, button, label, summary, [role="button"], [role="radio"], [role="tab"]';

function modeFor(target: EventTarget | null): Mode {
  if (!(target instanceof Element)) return "default";
  if (target.closest(TEXT)) return "text"; // native caret takes over
  if (target.closest('[data-cursor="drag"]') && !target.closest(LINK)) return "drag";
  if (target.closest(LINK)) return "link";
  return "default";
}

/**
 * A paint-dot cursor for mouse/trackpad users: a gold dot exactly at the
 * pointer, trailed by a soft "brush tip" ring that swells over links and says
 * "Drag" over before/after sliders. Off on touch devices and with reduced motion.
 */
export function PaintCursor() {
  const reduce = useReducedMotion();
  const finePointer = useMediaQuery(FINE_POINTER);
  const enabled = finePointer && !reduce;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });
  const [mode, setMode] = useState<Mode>("hidden");
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("paint-cursor");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setMode(modeFor(e.target));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = (e: PointerEvent) => !e.relatedTarget && setMode("hidden");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerout", leave);
    return () => {
      root.classList.remove("paint-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerout", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const visible = mode !== "hidden" && mode !== "text";
  const ringScale = mode === "drag" ? 1.9 : mode === "link" ? 1.6 : 1;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      {/* Brush-tip ring (trails slightly behind). */}
      <motion.div className="absolute left-0 top-0 -ml-5 -mt-5 h-10 w-10" style={{ x: ringX, y: ringY }}>
        <motion.div
          className={`grid h-full w-full place-items-center rounded-full border-2 ${
            mode === "drag" ? "border-navy-950 bg-navy-950" : mode === "link" ? "border-gold-400 bg-gold-400/25" : "border-navy-900/35"
          }`}
          animate={{ scale: visible ? (pressed ? ringScale * 0.85 : ringScale) : 0, opacity: visible ? 1 : 0 }}
          transition={ease(DURATION.fast)}
        >
          <AnimatePresence>
            {mode === "drag" && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[0.5rem] font-bold uppercase tracking-wider text-white"
              >
                Drag
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      {/* Paint dot, exactly on the pointer. */}
      <motion.div className="absolute left-0 top-0 -ml-1 -mt-1 h-2 w-2" style={{ x, y }}>
        <motion.div
          className="h-full w-full rounded-full bg-gold-500"
          animate={{ scale: visible && mode !== "drag" ? (pressed ? 1.6 : 1) : 0 }}
          transition={ease(DURATION.fast)}
        />
      </motion.div>
    </div>
  );
}
