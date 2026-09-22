import { Clock, Paintbrush, ShieldCheck, Sparkles, Users, Wallet } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const reasons = [
  { icon: Users, title: "Trained, in-house team", text: "Experienced painters — no untrained subcontractors on your site." },
  { icon: Paintbrush, title: "Premium branded paints", text: "We work with trusted brands and recommend the right finish for every surface." },
  { icon: Clock, title: "On-time completion", text: "Clear timelines agreed upfront, with daily progress you can see." },
  { icon: Wallet, title: "Transparent pricing", text: "Detailed written quotes with no hidden charges." },
  { icon: Sparkles, title: "Clean & tidy work", text: "Furniture and floors covered; site cleaned before we leave." },
  { icon: ShieldCheck, title: "Workmanship warranty", text: "We stand behind our work with an after-service warranty." },
];

export function WhyChooseUs() {
  return (
    <section className="section bg-navy-50/50">
      <div className="container">
        <SectionHeading
          eyebrow="Why choose us"
          title="Quality you can see, service you can trust"
          description="Every project gets the same attention to detail — whether it's a single room or an entire commercial complex."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.08}>
              <div className="flex h-full gap-4 rounded-2xl bg-white p-6 shadow-card">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-900 text-gold-400">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal-600">{text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
