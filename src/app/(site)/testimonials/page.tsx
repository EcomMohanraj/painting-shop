import type { Metadata } from "next";
import { Star } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { getTestimonials } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Testimonials",
  description: `Read what homeowners and businesses say about ${site.name}'s painting services.`,
  alternates: { canonical: "/testimonials" },
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  const average = testimonials.length ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length : 0;

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Trusted by homeowners & businesses"
        description="Real feedback from clients whose spaces we've transformed."
      />

      <section className="section">
        <div className="container">
          {testimonials.length === 0 ? (
            <p className="text-center text-charcoal-600">Customer reviews coming soon.</p>
          ) : (
            <Reveal className="mx-auto mb-12 flex w-fit items-center gap-4 rounded-full border border-gold-200 bg-gold-50 px-6 py-3">
              <Star className="h-6 w-6 fill-gold-400 text-gold-400" aria-hidden />
              <p className="text-sm text-navy-900">
                <span className="font-display text-xl font-bold">{average.toFixed(1)}</span> / 5 average from{" "}
                {testimonials.length} {testimonials.length === 1 ? "review" : "reviews"}
              </p>
            </Reveal>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={(i % 3) * 0.08}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
