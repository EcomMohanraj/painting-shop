import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Brush, Building2, Check, Droplets, Home, Layers, PaintBucket, type LucideIcon } from "lucide-react";
import type { Service } from "@/data/services";
import { PHOTO_BLUR } from "@/lib/image";

const icons: Record<Service["icon"], LucideIcon> = {
  home: Home,
  brush: Brush,
  building: Building2,
  droplets: Droplets,
  layers: Layers,
  paint: PaintBucket,
};

/**
 * Service card. On mouse/trackpad devices the photo starts as a desaturated
 * "primer" coat that wipes away to full colour on hover, and (when `detailed`)
 * the feature list slides up over the photo. Touch devices simply show the
 * colour photo with the features listed underneath — nothing is hover-only there.
 * CSS transitions only (transform/opacity/clip-path), so no JS is needed.
 */
export function ServiceCard({ service, detailed = false }: { service: Service; detailed?: boolean }) {
  const Icon = icons[service.icon];
  const features = (
    <ul className="space-y-2.5">
      {service.features.map((f) => (
        <li key={f} className="flex items-start gap-2.5 text-sm">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
          {f}
        </li>
      ))}
    </ul>
  );

  return (
    <article
      id={detailed ? service.slug : undefined}
      className="group flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-lift ring-1 ring-navy-50 transition duration-500 ease-brand can-hover:hover:-translate-y-1.5 can-hover:hover:shadow-hero"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-900">
        {service.image ? (
          <>
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              placeholder="blur"
              blurDataURL={PHOTO_BLUR}
              className="object-cover transition-transform duration-700 ease-brand can-hover:group-hover:scale-105"
            />
            {/* Primer coat: same photo in greyscale, wiped away on hover. */}
            <Image
              src={service.image}
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="hidden object-cover grayscale transition-[clip-path,transform] duration-700 ease-brand [clip-path:inset(0_0_0_0)] can-hover:block can-hover:group-hover:scale-105 can-hover:group-hover:[clip-path:inset(0_0_0_100%)]"
            />
          </>
        ) : (
          <div aria-hidden className="absolute inset-0 grid place-items-center bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950">
            <Icon className="h-20 w-20 text-gold-400/30" />
          </div>
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />

        <span className="absolute left-4 top-4 grid h-12 w-12 place-items-center rounded-2xl bg-gold-400 text-navy-950 shadow-lift transition-transform duration-500 ease-brand can-hover:group-hover:-rotate-6">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-800 backdrop-blur">
          {service.category}
        </span>

        {detailed && service.features.length > 0 && (
          // Hover reveal (mouse devices only): slides up over the photo, no layout shift.
          <div className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-navy-950/90 p-6 text-white backdrop-blur-md transition-transform duration-500 ease-brand can-hover:block can-hover:group-hover:translate-y-0 can-hover:group-focus-within:translate-y-0">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gold-300">What&apos;s included</p>
            {features}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 className="text-2xl font-bold tracking-tight">{service.title}</h3>
        <p className="mt-3 leading-relaxed text-charcoal-600">{service.summary}</p>
        {detailed && service.features.length > 0 && <div className="mt-6 text-charcoal-700 can-hover:hidden">{features}</div>}
        {detailed && (
          // Also gives keyboard users a focus target that opens the hover panel.
          <Link
            href="/contact"
            className="mt-auto inline-flex items-center gap-2 self-start pt-6 text-sm font-semibold text-navy-900 underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
          >
            Get a quote for this
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" aria-hidden />
          </Link>
        )}
      </div>
    </article>
  );
}
