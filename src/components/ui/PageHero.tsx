import { Reveal } from "./Reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

/** Compact navy banner used at the top of every inner page. */
export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-16 pt-32 sm:pb-20 sm:pt-40">
      <div
        aria-hidden
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl"
      />
      <div className="container relative">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-gold-300">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
          {description && <p className="mt-5 text-lg leading-relaxed text-navy-100/80">{description}</p>}
        </Reveal>
      </div>
    </section>
  );
}
