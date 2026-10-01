"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Clock, Paintbrush, ShieldCheck, Sparkles, Users, Wallet } from "lucide-react";
import { DURATION, ease } from "@/lib/motion";
import { PHOTO_BLUR } from "@/lib/image";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const reasons = [
  { icon: Users, title: "Trained, in-house team", text: "Experienced painters — no untrained subcontractors on your site.", swatch: "#f8b820" },
  { icon: Paintbrush, title: "Premium branded paints", text: "We work with trusted brands and recommend the right finish for every surface.", swatch: "#C97C5D" },
  { icon: Clock, title: "On-time completion", text: "Clear timelines agreed upfront, with daily progress you can see.", swatch: "#4A7A96" },
  { icon: Wallet, title: "Transparent pricing", text: "Detailed written quotes with no hidden charges.", swatch: "#7D8254" },
  { icon: Sparkles, title: "Clean & tidy work", text: "Furniture and floors covered; site cleaned before we leave.", swatch: "#2F7F7A" },
  { icon: ShieldCheck, title: "Workmanship warranty", text: "We stand behind our work with an after-service warranty.", swatch: "#2c4a7c" },
];

/**
 * Interactive feature showcase: every reason is listed in full, and hovering
 * (or tapping) one swaps the large image beside it. `images` are optional
 * photos to pair with the reasons; without them each reason gets a colour panel.
 */
export function WhyChooseUs({ images = [] }: { images?: string[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const reason = reasons[active];
  const image = images.length ? images[active % images.length] : undefined;
  const Icon = reason.icon;

  return (
    <section className="section overflow-hidden bg-navy-950">
      <div className="container grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            tone="light"
            align="left"
            eyebrow="Why choose us"
            title="Quality you can see, service you can trust"
            description="Every project gets the same attention to detail — whether it's a single room or an entire commercial complex."
          />

          <Reveal as="ol" stagger className="mt-12 border-t border-white/10">
            {reasons.map((r, i) => {
              const isActive = i === active;
              return (
                <RevealItem as="li" key={r.title} className="border-b border-white/10">
                  <div
                    onPointerEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="group relative flex gap-5 py-6 pl-5"
                  >
                    <motion.span
                      aria-hidden
                      className="absolute inset-y-4 left-0 w-1 origin-top rounded-full bg-gold-400"
                      initial={false}
                      animate={{ scaleY: isActive ? 1 : 0 }}
                      transition={ease(DURATION.fast)}
                    />
                    <span className={`font-display text-sm font-bold tabular-nums transition-colors duration-300 ${isActive ? "text-gold-400" : "text-navy-100/40"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className={`block font-display text-xl font-bold transition-colors duration-300 sm:text-2xl ${isActive ? "text-white" : "text-navy-100/70"}`}>
                        {r.title}
                      </span>
                      <span className={`mt-1.5 block leading-relaxed transition-colors duration-300 ${isActive ? "text-navy-100/85" : "text-navy-100/55"}`}>{r.text}</span>
                    </span>
                  </div>
                </RevealItem>
              );
            })}
          </Reveal>
        </div>

        {/* Image panel (decorative: the text above carries the content). */}
        <div aria-hidden className="relative order-first lg:order-none">
          <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] shadow-hero lg:sticky lg:top-28 lg:aspect-[4/5]">
            <AnimatePresence initial={false}>
              {/* Keyed by the photo when there is one, so a single photo (e.g. the
                  About page's team photo) stays put instead of re-animating on
                  every hover; without photos, each reason crossfades its colour. */}
              <motion.div
                key={image ?? active}
                className="absolute inset-0"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={ease(DURATION.slow)}
                style={{ backgroundColor: reason.swatch }}
              >
                {image && <Image src={image} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" placeholder="blur" blurDataURL={PHOTO_BLUR} className="object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-400 text-navy-950 shadow-lift">
                <Icon className="h-7 w-7" />
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={active}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={ease(DURATION.fast)}
                  className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl"
                >
                  {reason.title}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
