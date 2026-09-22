"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import type { GalleryProject } from "@/data/gallery";

/**
 * Drag (or use arrow keys) to compare before/after.
 * An invisible full-size range input handles pointer, touch and keyboard input.
 */
export function BeforeAfterSlider({ project }: { project: GalleryProject }) {
  const [position, setPosition] = useState(50);
  const id = useId();

  return (
    <div className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-xl bg-navy-50">
      {/* After (bottom layer) */}
      <Panel src={project.after} alt={`${project.title} — after`} variant="after" color={project.afterColor} />

      {/* Before (top layer, clipped from the right) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Panel src={project.before} alt={`${project.title} — before`} variant="before" color={project.afterColor} />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-semibold text-white">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-xs font-semibold text-navy-950">
        After
      </span>

      {/* Divider + handle */}
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${position}%` }}>
        <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy-900 shadow-lg">
          <MoveHorizontal className="h-5 w-5" aria-hidden />
        </span>
      </div>

      <label htmlFor={id} className="sr-only">
        Compare before and after for {project.title}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

function Panel({
  src,
  alt,
  variant,
  color,
}: {
  src?: string;
  alt: string;
  variant: "before" | "after";
  color: string;
}) {
  if (src) {
    return <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />;
  }

  // Placeholder until real photos are added in src/data/gallery.ts
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
