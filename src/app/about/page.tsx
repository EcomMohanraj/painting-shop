import type { Metadata } from "next";
import { Eye, Target } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
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
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            {/* Placeholder image block — replace with a team or project photo */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-navy-100">
              <div className="absolute inset-0 grid place-items-center text-sm font-medium uppercase tracking-widest text-navy-700/50">
                Team photo
              </div>
              <div className="absolute bottom-4 left-4 rounded-2xl bg-gold-400 px-5 py-4 text-navy-950 shadow-lg">
                <p className="font-display text-3xl font-extrabold leading-none">{yearsInBusiness}+</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider">Years of excellence</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow">Our story</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Built on craftsmanship and trust</h2>
            <div className="mt-5 space-y-4 leading-relaxed text-charcoal-600">
              <p>
                Placeholder copy. {site.name} started in {site.established} with a simple goal: deliver painting work
                that looks great, lasts long, and is completed without hassle for the customer.
              </p>
              <p>
                Today our trained team handles everything from single-room makeovers to large commercial and industrial
                projects — with the same attention to surface preparation, finish quality and cleanliness.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-navy-50 p-8 shadow-card">
              <Target className="h-8 w-8 text-gold-500" aria-hidden />
              <h3 className="mt-4 text-xl font-bold">Our mission</h3>
              <p className="mt-2 leading-relaxed text-charcoal-600">
                To deliver reliable, high-quality painting services with honest pricing and a stress-free experience.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-navy-50 p-8 shadow-card">
              <Eye className="h-8 w-8 text-gold-500" aria-hidden />
              <h3 className="mt-4 text-xl font-bold">Our vision</h3>
              <p className="mt-2 leading-relaxed text-charcoal-600">
                To be the most trusted name in residential and commercial painting in our region.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-navy-50/50">
        <div className="container max-w-3xl">
          <p className="eyebrow text-center">Our journey</p>
          <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">Milestones</h2>
          <ol className="relative mt-12 space-y-8 border-l-2 border-gold-200 pl-8">
            {milestones.map((m, i) => (
              <li key={m.year} className="relative">
                <Reveal delay={i * 0.08}>
                  <span className="absolute -left-[2.6rem] top-1 h-4 w-4 rounded-full border-4 border-white bg-gold-400 shadow" />
                  <p className="font-display text-lg font-bold text-navy-900">{m.year}</p>
                  <p className="mt-1 text-charcoal-600">{m.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <WhyChooseUs />
      <CtaBanner />
    </>
  );
}
