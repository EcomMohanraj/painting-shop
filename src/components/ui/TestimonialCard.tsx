import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/data/testimonials";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { name, location, project, rating, quote } = testimonial;
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-navy-50 bg-white p-6 shadow-card sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              aria-hidden
              className={`h-4 w-4 ${i < rating ? "fill-gold-400 text-gold-400" : "text-navy-100"}`}
            />
          ))}
        </div>
        <Quote className="h-8 w-8 text-gold-200" aria-hidden />
      </div>
      <blockquote className="mt-4 flex-1 text-base leading-relaxed text-charcoal-700">“{quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-navy-50 pt-5">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-navy-900 font-semibold text-gold-300">
          {name.charAt(0)}
        </span>
        <span>
          <span className="block font-semibold text-navy-900">{name}</span>
          <span className="block text-xs text-charcoal-500">
            {project} · {location}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
