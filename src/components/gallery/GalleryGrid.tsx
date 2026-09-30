"use client";

import { useState, type CSSProperties } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Maximize2, MapPin } from "lucide-react";
import type { GalleryProject } from "@/data/gallery";
import { DURATION, ease } from "@/lib/motion";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { Lightbox } from "./Lightbox";

type Tile = { size: "big" | "wide" | "full" | "small"; style?: CSSProperties };

/**
 * Editorial bento layout for a 3-column desktop grid, built from blocks that
 * always fill whole rows: [big + 2 stacked] or [small + wide], mirrored every
 * other time. Returns each tile's size and explicit desktop grid placement.
 */
function bentoLayout(count: number): Tile[] {
  const tiles: Tile[] = [];
  let row = 1;
  let threes = 0;
  let twos = 0;
  let preferThree = true;

  const place = (size: Tile["size"], col: string, r: string) =>
    tiles.push({ size, style: { "--col": col, "--row": r } as CSSProperties });

  for (let left = count; left > 0; ) {
    let size = left === 1 ? 1 : left === 2 || left === 4 ? 2 : left === 3 ? 3 : preferThree ? 3 : 2;
    if (left > 4 && left - size === 1) size = size === 3 ? 2 : 3;

    if (size === 3) {
      const mirrored = threes++ % 2 === 1;
      place("big", mirrored ? "2 / span 2" : "1 / span 2", `${row} / span 2`);
      place("small", mirrored ? "1" : "3", `${row}`);
      place("small", mirrored ? "1" : "3", `${row + 1}`);
      row += 2;
    } else if (size === 2) {
      const mirrored = twos++ % 2 === 1;
      place(mirrored ? "wide" : "small", "1 / span " + (mirrored ? 2 : 1), `${row}`);
      place(mirrored ? "small" : "wide", mirrored ? "3" : "2 / span 2", `${row}`);
      row += 1;
    } else {
      place("full", "1 / span 3", `${row}`);
      row += 1;
    }
    left -= size;
    preferThree = !preferThree;
  }
  return tiles;
}

// Smaller screens: 1 column, then 2 columns where big/wide/full tiles span both.
const sizeClasses: Record<Tile["size"], string> = {
  big: "sm:col-span-2 sm:row-span-2",
  wide: "sm:col-span-2",
  full: "sm:col-span-2",
  small: "",
};

export function GalleryGrid({ projects: all, showFilters = true }: { projects: GalleryProject[]; showFilters?: boolean }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState("All");
  const [open, setOpen] = useState<number | null>(null);

  // Filter buttons only for categories that actually have projects.
  const galleryCategories = ["All", ...Array.from(new Set(all.map((p) => p.category)))];
  const projects = all.filter((p) => active === "All" || p.category === active);
  const tiles = bentoLayout(projects.length);

  if (all.length === 0) {
    return <p className="text-center text-charcoal-600">New projects coming soon.</p>;
  }

  return (
    <div>
      {showFilters && (
        <div role="group" aria-label="Filter projects" className="mb-12 flex flex-wrap justify-center gap-2">
          <LayoutGroup id="gallery-filters">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                aria-pressed={active === cat}
                className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                  active === cat ? "text-white" : "bg-navy-50 text-navy-800 hover:bg-navy-100"
                }`}
              >
                {active === cat && (
                  <motion.span layoutId="gallery-filter-pill" className="absolute inset-0 rounded-full bg-navy-900" transition={ease(DURATION.fast)} />
                )}
                <span className="relative">{cat}</span>
              </button>
            ))}
          </LayoutGroup>
        </div>
      )}

      <motion.ul layout className="grid gap-5 sm:auto-rows-[15rem] sm:grid-cols-2 sm:grid-flow-row-dense lg:auto-rows-[17rem] lg:grid-cols-3 lg:gap-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {projects.map((project, i) => {
            const tile = tiles[i];
            const big = tile.size === "big" || tile.size === "full";
            return (
              <motion.li
                key={project.id}
                layout={!reduce}
                initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                transition={ease(DURATION.base)}
                style={tile.style}
                className={`group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-navy-50 shadow-lift sm:aspect-auto lg:[grid-column:var(--col)] lg:[grid-row:var(--row)] ${sizeClasses[tile.size]}`}
              >
                <article className="h-full">
                  <BeforeAfterSlider
                    project={project}
                    className="h-full"
                    sizes={big ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                  />
                  {/* Caption (pointer-events off so dragging still works underneath). */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/85 via-navy-950/40 to-transparent p-5 pt-16 sm:p-6 sm:pt-20">
                    <div className="flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <span className="inline-block rounded-full bg-gold-400 px-3 py-1 text-xs font-semibold text-navy-950">{project.category}</span>
                        <h3 className={`mt-2 truncate font-bold text-white ${big ? "text-2xl sm:text-3xl" : "text-lg"}`}>{project.title}</h3>
                        <p className="mt-1 flex items-center gap-1 text-xs text-white/75">
                          <MapPin className="h-3.5 w-3.5" aria-hidden />
                          {project.location}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpen(i)}
                        aria-label={`View ${project.title} larger`}
                        className="pointer-events-auto grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/90 text-navy-900 shadow-lift backdrop-blur transition duration-300 ease-brand hover:scale-105 hover:bg-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
                      >
                        <Maximize2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                </article>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      <Lightbox projects={projects} index={open} onChange={setOpen} />
    </div>
  );
}
