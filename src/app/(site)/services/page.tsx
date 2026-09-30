import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { getServices } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: `Interior, exterior, texture, commercial, industrial painting and waterproofing services by ${site.name}.`,
  alternates: { canonical: "/services" },
};

const process = [
  { step: "01", title: "Site visit", text: "We inspect surfaces and understand your requirements." },
  { step: "02", title: "Detailed quote", text: "Clear, itemised pricing with paint and finish options." },
  { step: "03", title: "Preparation", text: "Covering, scraping, crack-filling, putty and primer." },
  { step: "04", title: "Painting & handover", text: "Finish coats, final inspection and complete cleanup." },
];

export default async function ServicesPage() {
  const services = await getServices();
  // Only show a group if it has at least one published service.
  const groups = (["Residential", "Commercial"] as const).filter((g) => services.some((s) => s.category === g));

  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Complete painting solutions"
        description="Residential and commercial painting services delivered by a trained team using premium materials."
      />

      {groups.map((group, gi) => (
        <section key={group} className={`section ${gi % 2 === 1 ? "bg-navy-50/60" : ""}`}>
          <div className="container">
            <SectionHeading eyebrow={group} title={`${group} painting`} align="left" />
            {/* Editorial offset: every middle-column card sits lower. */}
            <Reveal stagger className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:items-start">
              {services
                .filter((s) => s.category === group)
                .map((service, i) => (
                  <RevealItem key={service.slug} className={i % 3 === 1 ? "lg:mt-16" : ""}>
                    <ServiceCard service={service} detailed />
                  </RevealItem>
                ))}
            </Reveal>
          </div>
        </section>
      ))}

      <section className="section bg-navy-950">
        <div className="container">
          <SectionHeading tone="light" eyebrow="How we work" title="A simple, stress-free process" />
          <div className="relative mt-16">
          <span aria-hidden className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-gold-400/0 via-gold-400/60 to-gold-400/0 lg:block" />
          <Reveal as="ol" stagger className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {process.map((p) => (
              <RevealItem as="li" key={p.step} className="relative">
                <span aria-hidden className="relative grid h-14 w-14 place-items-center rounded-full bg-gold-400 font-display text-lg font-extrabold text-navy-950 shadow-lift ring-8 ring-navy-950">
                  {p.step}
                </span>
                <h3 className="mt-6 text-xl font-bold text-white">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-navy-100/70">{p.text}</p>
              </RevealItem>
            ))}
          </Reveal>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
