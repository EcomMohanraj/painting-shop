import { yearsInBusiness } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

// Placeholder figures — update with real numbers.
const stats = [
  { value: `${yearsInBusiness}+`, label: "Years of experience" },
  { value: "500+", label: "Projects completed" },
  { value: "350+", label: "Happy clients" },
  { value: "25+", label: "Skilled painters" },
];

export function Stats() {
  return (
    <section className="border-y border-navy-50 bg-navy-900">
      <div className="container grid grid-cols-2 gap-y-8 py-12 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <p className="font-display text-3xl font-extrabold text-gold-400 sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm text-navy-100/80">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
