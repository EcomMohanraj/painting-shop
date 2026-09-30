import type { Testimonial } from "@/data/testimonials";
import { StarRating } from "./StarRating";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { name, location, project, rating, quote } = testimonial;
  return (
    <figure className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-white p-8 shadow-lift sm:p-12">
      {/* Oversized quote mark, like a gallery wall label. */}
      <span aria-hidden className="pointer-events-none absolute -right-2 -top-10 font-display text-[12rem] font-extrabold leading-none text-gold-100">
        &rdquo;
      </span>
      <StarRating rating={rating} />
      <blockquote className="relative mt-6 flex-1 font-display text-xl font-medium leading-relaxed tracking-tight text-navy-900 sm:text-2xl">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="relative mt-8 flex items-center gap-4">
        <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy-900 font-display text-lg font-bold text-gold-300">
          {name.charAt(0)}
        </span>
        <span>
          <span className="block font-semibold text-navy-900">{name}</span>
          {(project || location) && (
            <span className="block text-sm text-charcoal-500">{[project, location].filter(Boolean).join(" · ")}</span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
