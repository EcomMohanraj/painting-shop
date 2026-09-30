import type { Metadata } from "next";
import { Star } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
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

      <section className="section overflow-x-clip bg-navy-50/60">
        <div className="container">
          {testimonials.length === 0 ? (
            <p className="text-center text-charcoal-600">Customer reviews coming soon.</p>
          ) : (
            <>
              <Reveal className="mx-auto mb-16 flex w-fit items-center gap-5 rounded-full bg-white px-7 py-4 shadow-lift">
                <Star className="h-8 w-8 fill-gold-400 text-gold-400" aria-hidden />
                <p className="text-navy-900">
                  <span className="font-display text-3xl font-extrabold">{average.toFixed(1)}</span>
                  <span className="text-charcoal-600">
                    {" "}
                    / 5 average from {testimonials.length} {testimonials.length === 1 ? "review" : "reviews"}
                  </span>
                </p>
              </Reveal>
              <Reveal>
                <TestimonialCarousel testimonials={testimonials} />
              </Reveal>
            </>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
