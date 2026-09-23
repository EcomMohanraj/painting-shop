"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import { site, yearsInBusiness } from "@/lib/site";
import { ColorFanDeck } from "./ColorFanDeck";

export function Hero() {
  const reduce = useReducedMotion();
  const fadeUp = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gold-50/60 via-white to-white pb-16 pt-28 sm:pb-24 sm:pt-36">
      <div aria-hidden className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-gold-200/40 blur-3xl" />

      <div className="container relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <motion.p {...fadeUp(0)} className="inline-flex items-center gap-2 rounded-full border border-gold-200 bg-white px-4 py-1.5 text-xs font-semibold text-navy-800">
            <Sparkles className="h-3.5 w-3.5 text-gold-500" aria-hidden />
            Trusted painting experts since {site.established}
          </motion.p>

          <motion.h1 {...fadeUp(0.1)} className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Transforming spaces with{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">colour & care</span>
              <span aria-hidden className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-gold-300/70 sm:h-4" />
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal-600">
            Professional residential and commercial painting — clean workmanship, premium paints and on-time delivery for homes, offices and industrial spaces.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              Get a Free Quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/gallery" className="btn-outline">
              View Our Work
            </Link>
          </motion.div>

          <motion.ul {...fadeUp(0.4)} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-charcoal-700">
            <li className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-gold-500" aria-hidden />
              {yearsInBusiness}+ years experience
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-gold-500" aria-hidden />
              Workmanship warranty
            </li>
          </motion.ul>
        </div>

        {/* Interactive paint colour fan deck */}
        <motion.div {...fadeUp(0.3)} className="w-full">
          <ColorFanDeck />
        </motion.div>
      </div>
    </section>
  );
}
