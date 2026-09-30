"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DURATION, ease } from "@/lib/motion";

// Set after the first page has mounted, so the very first load isn't covered
// (that would delay the first paint for nothing).
let hasNavigated = false;

/**
 * Route transition: a navy panel, then a gold one, wipe off the screen to
 * reveal each newly navigated page — a colour wash between rooms.
 * (A template re-mounts on every navigation, unlike the persistent layout.)
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [wash] = useState(() => typeof window !== "undefined" && hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <>
      {wash && !reduce && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[80] origin-right bg-gold-400"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={ease(DURATION.slow, 0.08)}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[81] origin-right bg-navy-950"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={ease(DURATION.base)}
          />
        </>
      )}
      {/* Opacity only: a transform here would break position: fixed inside pages (e.g. the lightbox). */}
      <motion.div initial={wash ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={ease(DURATION.base, 0.15)}>
        {children}
      </motion.div>
    </>
  );
}
