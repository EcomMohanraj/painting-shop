"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import { site, yearsInBusiness } from "@/lib/site";
import { DURATION, SPRING_SOFT, ease } from "@/lib/motion";
import { PHOTO_BLUR } from "@/lib/image";
import { FINE_POINTER, useMediaQuery } from "@/lib/use-media-query";
import { BrushStroke } from "@/components/ui/BrushStroke";
import { PaintWipe } from "@/components/ui/PaintWipe";

export type HeroPhoto = { src: string; alt: string; caption?: string };

// Swatch chips beside the hero photo (illustrative shades from the colour studio).
const chips = ["#C97C5D", "#B5C4A7", "#4A7A96"];

type HeroProps = {
  /** Dedicated hero photo URL (Admin → Site Photos → "home-hero-photo"), or null if not uploaded. */
  photo?: string | null;
  /** Shown when there's no dedicated photo: a finished project or service photo. */
  fallbackPhoto?: HeroPhoto;
};

export function Hero({ photo: dedicated, fallbackPhoto }: HeroProps) {
  const photo: HeroPhoto | undefined = dedicated
    ? { src: dedicated, alt: `A freshly painted space by ${site.name}` }
    : fallbackPhoto;
  const reduce = useReducedMotion();
  const finePointer = useMediaQuery(FINE_POINTER);
  const ref = useRef<HTMLElement>(null);

  // Paint blob that drifts after the cursor (mouse/trackpad only).
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const blobX = useSpring(pointerX, SPRING_SOFT);
  const blobY = useSpring(pointerY, SPRING_SOFT);
  const counterX = useTransform(blobX, (v) => v * -0.35);
  const counterY = useTransform(blobY, (v) => v * -0.35);

  // Gentle parallax as the hero scrolls away.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const strokeY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!finePointer || reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    pointerX.set((e.clientX - r.left - r.width * 0.62) * 0.6);
    pointerY.set((e.clientY - r.top - r.height * 0.45) * 0.6);
  };

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: ease(DURATION.base, delay),
  });

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      className="relative isolate overflow-hidden bg-[#fbf8f1] pb-20 pt-28 sm:pb-28 sm:pt-36 lg:flex lg:min-h-[100svh] lg:items-center lg:pb-24"
    >
      {/* Cursor-reactive paint blobs (transform-only, GPU friendly). */}
      <motion.div
        aria-hidden
        style={{ x: blobX, y: blobY }}
        className="pointer-events-none absolute left-[62%] top-[45%] -z-10 -ml-[20rem] -mt-[20rem] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(255,205,74,0.55),rgba(255,205,74,0)_65%)]"
      />
      <motion.div
        aria-hidden
        style={{ x: counterX, y: counterY }}
        className="pointer-events-none absolute left-[12%] top-[78%] -z-10 -ml-[14rem] -mt-[14rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(188,203,226,0.7),rgba(188,203,226,0)_65%)]"
      />

      {/* Oversized brushstroke behind the headline. */}
      <motion.div aria-hidden style={{ y: strokeY }} className="pointer-events-none absolute -left-[10%] top-[30%] -z-10 w-[85%] text-gold-200/80 lg:top-[34%] lg:w-[62%]">
        <BrushStroke className="h-auto w-full" delay={0.25} />
      </motion.div>

      <div className="container relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold text-navy-800 shadow-sm ring-1 ring-gold-200 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold-500" aria-hidden />
            Trusted painting experts since {site.established}
          </motion.p>

          <h1 className="mt-8 font-display text-display-xl font-extrabold text-navy-950">
            <PaintWipe roller delay={0.1} className="block">
              Transforming
            </PaintWipe>{" "}
            <PaintWipe roller delay={0.19} className="block">
              spaces with
            </PaintWipe>{" "}
            <PaintWipe roller delay={0.28} className="block">
              <span className="relative inline-block">
                colour <span className="text-gold-600">&amp;</span> care
                <span className="pointer-events-none absolute -bottom-[0.14em] left-0 w-full text-gold-400">
                  <BrushStroke variant="underline" className="h-[0.22em] w-full" delay={0.6} />
                </span>
              </span>
            </PaintWipe>
          </h1>

          <motion.p {...rise(0.35)} className="mt-8 max-w-xl text-lg leading-relaxed text-charcoal-600 sm:text-xl">
            Professional residential and commercial painting — clean workmanship, premium paints and on-time delivery for homes, offices and industrial spaces.
          </motion.p>

          <motion.div {...rise(0.42)} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary btn-lg group shadow-lift">
              Get a Free Quote
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link href="/gallery" className="btn-outline btn-lg bg-white/60 backdrop-blur">
              View Our Work
            </Link>
          </motion.div>

          <motion.ul {...rise(0.5)} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-charcoal-700">
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

        {/* Finished-project photo, revealed as a gold paint panel rolls off it. */}
        <motion.div style={{ y: photoY }} className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-navy-100 shadow-hero">
            {photo ? (
              <motion.div
                className="absolute inset-0"
                initial={reduce ? false : { scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={ease(DURATION.slow, 0.2)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 100vw"
                  placeholder="blur"
                  blurDataURL={PHOTO_BLUR}
                  className="object-cover"
                />
                {/* Warm grade: lifted shadows, golden highlights. */}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-gold-200/15" />
              </motion.div>
            ) : (
              <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-gold-300 via-gold-100 to-navy-100" />
            )}
            <motion.div
              aria-hidden
              className="absolute inset-0 origin-bottom bg-gold-400"
              initial={reduce ? { scaleY: 0 } : { scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={ease(DURATION.slow, 0.15)}
            />
            {photo?.caption && (
              <p className="absolute bottom-5 left-5 right-5 text-sm font-medium text-white/90">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-gold-400 align-middle" aria-hidden />
                {photo.caption}
              </p>
            )}
          </div>

          <motion.div
            {...rise(0.55)}
            className="absolute -left-4 top-10 rounded-2xl bg-navy-950 px-5 py-4 text-white shadow-hero sm:-left-8"
          >
            <p className="font-display text-3xl font-extrabold leading-none text-gold-400">{yearsInBusiness}+</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-navy-100/80">Years of colour</p>
          </motion.div>

          <ul aria-hidden className="absolute -right-3 bottom-16 flex flex-col gap-2.5 sm:-right-5">
            {chips.map((hex, i) => (
              <motion.li
                key={hex}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reduce ? ease(DURATION.fast) : { type: "spring", stiffness: 300, damping: 18, delay: 0.6 + i * 0.08 }}
                className="h-11 w-11 rounded-full shadow-lift ring-4 ring-white"
                style={{ backgroundColor: hex }}
              />
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
