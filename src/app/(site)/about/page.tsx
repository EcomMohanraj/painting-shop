import type { Metadata } from "next";
import { Eye, Target } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Timeline } from "@/components/ui/Timeline";
import { site, yearsInBusiness } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${site.name} — a professional residential and commercial painting company serving clients since ${site.established}.`,
  alternates: { canonical: "/about" },
};

// Placeholder milestones — replace with the real company story.
const milestones = [
  { year: String(site.established), text: `${site.name} founded with a small team of skilled painters.` },
  { year: "2019", text: "Expanded into commercial and office painting projects." },
  { year: "2021", text: "Added texture finishes and waterproofing services." },
  { year: "Today", text: "Hundreds of homes and businesses transformed across the region." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={`Painting with pride since ${site.established}`}
        description={`For ${yearsInBusiness}+ years, ${site.name} has helped homeowners and businesses bring their spaces to life.`}
      />

      <section className="section">
        <div className="container grid items-center gap-16 lg:grid-cols-2">
          <Reveal direction="right">
            {/* Placeholder image block — replace with a team or project photo */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-100 via-navy-50 to-gold-100 shadow-hero">
              <div className="absolute inset-0 grid place-items-center text-sm font-medium uppercase tracking-widest text-navy-700/50">
                Team photo
              </div>
              <div className="absolute bottom-6 left-6 rounded-2xl bg-gold-400 px-6 py-5 text-navy-950 shadow-lift">
                <p className="font-display text-5xl font-extrabold leading-none">{yearsInBusiness}+</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider">Years of excellence</p>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading align="left" eyebrow="Our story" title="Built on craftsmanship and trust" />
            <Reveal delay={0.1} className="mt-8 space-y-5 text-lg leading-relaxed text-charcoal-600">
              <p>
                Placeholder copy. {site.name} started in {site.established} with a simple goal: deliver painting work
                that looks great, lasts long, and is completed without hassle for the customer.
              </p>
              <p>
                Today our trained team handles everything from single-room makeovers to large commercial and industrial
                projects — with the same attention to surface preparation, finish quality and cleanliness.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[1.75rem] bg-white p-10 shadow-lift ring-1 ring-navy-50">
              <Target className="h-8 w-8 text-gold-500" aria-hidden />
              <h3 className="mt-4 text-xl font-bold">Our mission</h3>
              <p className="mt-2 leading-relaxed text-charcoal-600">
                To deliver reliable, high-quality painting services with honest pricing and a stress-free experience.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-[1.75rem] bg-navy-950 p-10 shadow-lift [&_h3]:text-white [&_p]:text-navy-100/75">
              <Eye className="h-8 w-8 text-gold-500" aria-hidden />
              <h3 className="mt-4 text-xl font-bold">Our vision</h3>
              <p className="mt-2 leading-relaxed text-charcoal-600">
                To be the most trusted name in residential and commercial painting in our region.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-[#fbf8f1]">
        <div className="container max-w-5xl">
          <SectionHeading eyebrow="Our journey" title={`Since ${site.established}, one wall at a time`} />
          <div className="mt-20">
            <Timeline items={milestones} />
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <CtaBanner />
    </>
  );
}
