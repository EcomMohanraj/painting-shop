import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero, type HeroPhoto } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ColorFanDeck, type FanPhoto } from "@/components/home/ColorFanDeck";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { getHomeProjects, getHomeTestimonials, getServices, getSiteImage } from "@/lib/content";

export default async function HomePage() {
  const [services, projects, testimonials, heroPhoto] = await Promise.all([
    getServices(),
    getHomeProjects(3),
    getHomeTestimonials(3),
    getSiteImage("home-hero-photo"),
  ]);

  // Photos for the visual set pieces, taken from the content already loaded above.
  const projectPhotos: FanPhoto[] = projects
    .filter((p) => p.after)
    .map((p) => ({ src: p.after!, alt: `${p.title}, ${p.location} — finished`, caption: p.title }));
  const servicePhotos: FanPhoto[] = services
    .filter((s) => s.image)
    .map((s) => ({ src: s.image!, alt: s.title, caption: s.title }));
  // Used by the hero only until a dedicated photo is uploaded in Admin → Site Photos.
  const heroFallback: HeroPhoto | undefined = projectPhotos[0] ?? servicePhotos[0];

  return (
    <>
      <Hero photo={heroPhoto} fallbackPhoto={heroFallback} />
      <Stats />

      <section className="section">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              align="left"
              eyebrow="Our services"
              title="Painting solutions for every space"
              description="From cosy apartments to large commercial sites, we handle preparation, painting and cleanup end to end."
            />
            <Reveal delay={0.1}>
              <Link href="/services" className="btn-outline btn-lg group">
                Explore all services
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" aria-hidden />
              </Link>
            </Reveal>
          </div>
          <Reveal stagger className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:items-start">
            {services.map((service, i) => (
              <RevealItem key={service.slug} className={i % 3 === 1 ? "lg:mt-16" : ""}>
                <ServiceCard service={service} />
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      <WhyChooseUs images={servicePhotos.map((p) => p.src)} />

      <section className="section overflow-hidden bg-[#fbf8f1]">
        <div className="container">
          <SectionHeading
            eyebrow="Colour studio"
            title="Find the shade that feels like home"
            description="Fan through our most-loved shades and watch each one roll across a real finished space."
          />
          <div className="mt-16">
            <ColorFanDeck photos={[...projectPhotos, ...servicePhotos]} />
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <SectionHeading
                align="left"
                eyebrow="Before & after"
                title="See the transformation"
                description="Drag the slider on each project to compare the before and after."
              />
              <Reveal delay={0.1}>
                <Link href="/gallery" className="btn-outline btn-lg group">
                  View full gallery
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" aria-hidden />
                </Link>
              </Reveal>
            </div>
            <div className="mt-16">
              <GalleryGrid projects={projects} showFilters={false} />
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="section overflow-x-clip bg-navy-50/60">
          <div className="container">
            <SectionHeading eyebrow="Testimonials" title="What our clients say" />
            <div className="mt-16">
              <TestimonialCarousel testimonials={testimonials} />
            </div>
            <div className="mt-12 text-center">
              <Link href="/testimonials" className="btn-outline btn-lg group">
                Read more reviews
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
