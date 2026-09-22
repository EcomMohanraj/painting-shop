"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Phone } from "lucide-react";
import { site, telLink, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

/** Sticky "Call Now" pill (bottom-left) and floating WhatsApp button (bottom-right). */
export function FloatingActions() {
  const reduce = useReducedMotion();
  const enter = reduce ? false : { opacity: 0, scale: 0.6, y: 20 };

  return (
    <>
      <motion.a
        href={telLink}
        aria-label={`Call ${site.name} at ${site.phone}`}
        initial={enter}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-40 inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-navy-900/30 transition-colors hover:bg-navy-800 sm:left-6"
      >
        <Phone className="h-4 w-4 text-gold-300" aria-hidden />
        Call Now
      </motion.a>

      <motion.a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${site.name} on WhatsApp`}
        initial={enter}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.75, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={reduce ? undefined : { scale: 1.08 }}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 sm:right-6"
      >
        {!reduce && (
          <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
        )}
        <WhatsAppIcon className="relative h-7 w-7" />
      </motion.a>
    </>
  );
}
