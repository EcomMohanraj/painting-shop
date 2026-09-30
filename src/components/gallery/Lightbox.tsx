"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import type { GalleryProject } from "@/data/gallery";
import { DURATION, ease } from "@/lib/motion";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

type LightboxProps = {
  projects: GalleryProject[];
  /** Index of the open project, or null when closed. */
  index: number | null;
  onChange: (index: number | null) => void;
};

/** Full-screen before/after viewer. Esc closes; ←/→ move between projects. */
export function Lightbox({ projects, index, onChange }: LightboxProps) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const indexRef = useRef(index);
  indexRef.current = index;
  const isOpen = index !== null && index < projects.length;
  const project = isOpen ? projects[index] : null;
  const n = projects.length;

  // Focus management, scroll lock and keyboard shortcuts while open.
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onChange(null);
        return;
      }
      // Arrow keys on the slider move the slider, not the gallery.
      const onSlider = (e.target as HTMLElement | null)?.matches?.('input[type="range"]');
      if (!onSlider && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        onChange((indexRef.current! + (e.key === "ArrowRight" ? 1 : -1) + n) % n);
      }
      // Keep Tab inside the dialog.
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>("button, input, [href], [tabindex]:not([tabindex='-1'])");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
    // Re-run only when opening/closing (the handler reads the index from a ref).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={ease(DURATION.fast)}
          className="fixed inset-0 z-[70] flex flex-col bg-navy-950/95 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onChange(null)}
        >
          <div className="container flex items-center justify-between gap-4 py-4 text-white">
            <p className="text-sm tabular-nums text-navy-100/70">
              {index! + 1} / {n}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={() => onChange(null)}
              aria-label="Close"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="container flex min-h-0 flex-1 flex-col justify-center pb-6" onClick={(e) => e.target === e.currentTarget && onChange(null)}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={project.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={ease(DURATION.base)}
                className="mx-auto w-full max-w-5xl"
              >
                <div className="overflow-hidden rounded-[1.5rem] shadow-hero">
                  <BeforeAfterSlider project={project} className="aspect-[4/3] max-h-[70svh] sm:aspect-[16/10]" sizes="(min-width: 1024px) 1024px, 100vw" />
                </div>
                <div className="mt-5 flex flex-wrap items-end justify-between gap-4 text-white">
                  <div>
                    <span className="inline-block rounded-full bg-gold-400 px-3 py-1 text-xs font-semibold text-navy-950">{project.category}</span>
                    <h2 id="lightbox-title" className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                      {project.title}
                    </h2>
                    <p className="mt-1 flex items-center gap-1 text-sm text-navy-100/75">
                      <MapPin className="h-4 w-4" aria-hidden />
                      {project.location}
                    </p>
                  </div>
                  {n > 1 && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onChange((index! - 1 + n) % n)}
                        aria-label="Previous project"
                        className="grid h-12 w-12 place-items-center rounded-full bg-white/10 transition-colors hover:bg-gold-400 hover:text-navy-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
                      >
                        <ChevronLeft className="h-5 w-5" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange((index! + 1) % n)}
                        aria-label="Next project"
                        className="grid h-12 w-12 place-items-center rounded-full bg-white/10 transition-colors hover:bg-gold-400 hover:text-navy-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
                      >
                        <ChevronRight className="h-5 w-5" aria-hidden />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
