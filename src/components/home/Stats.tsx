import { yearsInBusiness } from "@/lib/site";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

// Placeholder figures — update with real numbers.
const stats = [
  { value: yearsInBusiness, suffix: "+", label: "Years of experience" },
  { value: 500, suffix: "+", label: "Projects completed" },
  { value: 350, suffix: "+", label: "Happy clients" },
  { value: 25, suffix: "+", label: "Skilled painters" },
];

export function Stats() {
  return (
    <section className="bg-navy-950">
      <Reveal as="ul" stagger className="container grid grid-cols-2 gap-y-12 py-16 sm:py-20 lg:grid-cols-4">
        {stats.map((s, i) => (
          <RevealItem as="li" key={s.label} className={`px-4 text-center ${i > 0 ? "lg:border-l lg:border-white/10" : ""}`}>
            <p className="font-display text-display-lg font-extrabold text-gold-400">
              <CountUp value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-navy-100/70">{s.label}</p>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
