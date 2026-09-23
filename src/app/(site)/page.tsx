import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { getHomeProjects, getHomeTestimonials, getServices } from "@/lib/content";

export default async function HomePage() {
  const [services, projects, testimonials] = await Promise.all([
    getServices(),
    getHomeProjects(3),
    getHomeTestimonials(3),
  ]);

  return (
    <>
      <Hero />
      <Stats />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Our services"
            title="Painting solutions for every space"
            description="From cosy apartments to large commercial sites, we handle preparation, painting and cleanup end to end."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={(i % 3) * 0.08}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/services" className="btn-outline">
              Explore all services <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs />

      {projects.length > 0 && (
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Before & after"
            title="See the transformation"
            description="Drag the slider on each project to compare the before and after."
          />
          <div className="mt-12">
            <GalleryGrid projects={projects} showFilters={false} />
          </div>
          <div className="mt-10 text-center">
            <Link href="/gallery" className="btn-outline">
              View full gallery <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
      )}

      {testimonials.length > 0 && (
      <section className="section bg-navy-50/50">
        <div className="container">
          <SectionHeading eyebrow="Testimonials" title="What our clients say" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/testimonials" className="btn-outline">
              Read more reviews <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
      )}

      <CtaBanner />
    </>
  );
}
