import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
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
        <section key={group} className={`section ${gi % 2 === 1 ? "bg-navy-50/50" : ""}`}>
          <div className="container">
            <SectionHeading eyebrow={group} title={`${group} painting`} align="left" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services
                .filter((s) => s.category === group)
                .map((service, i) => (
                  <Reveal key={service.slug} delay={i * 0.08}>
                    <ServiceCard service={service} detailed />
                  </Reveal>
                ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="How we work" title="A simple, stress-free process" />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <li key={p.step}>
                <Reveal delay={i * 0.08} className="h-full rounded-2xl border border-navy-50 p-6 shadow-card">
                  <span className="font-display text-4xl font-extrabold text-gold-300">{p.step}</span>
                  <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal-600">{p.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
