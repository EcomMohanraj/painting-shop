"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { galleryCategories, galleryProjects } from "@/data/gallery";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

type Category = (typeof galleryCategories)[number];

export function GalleryGrid({ limit, showFilters = true }: { limit?: number; showFilters?: boolean }) {
  const [active, setActive] = useState<Category>("All");

  const projects = galleryProjects
    .filter((p) => active === "All" || p.category === active)
    .slice(0, limit);

  return (
    <div>
      {showFilters && (
        <div role="group" aria-label="Filter projects" className="mb-10 flex flex-wrap justify-center gap-2">
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                active === cat
                  ? "bg-navy-900 text-white"
                  : "bg-navy-50 text-navy-800 hover:bg-navy-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {projects.map((project) => (
            <motion.article
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-navy-50 bg-white p-3 shadow-card"
            >
              <BeforeAfterSlider project={project} />
              <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-4">
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-charcoal-500">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {project.location}
                  </p>
                </div>
                <span className="rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-gold-600">
                  {project.category}
                </span>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
