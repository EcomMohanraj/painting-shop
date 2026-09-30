import { BrushStroke } from "./BrushStroke";
import { PaintWipe } from "./PaintWipe";
import { Reveal } from "./Reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

/** Navy banner at the top of every inner page: oversized title, rolled on like paint. */
export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 pb-20 pt-36 sm:pb-28 sm:pt-44">
      <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(248,184,32,0.28),rgba(248,184,32,0)_65%)]" />
      <div aria-hidden className="absolute -bottom-6 right-[-8%] -z-10 w-[70%] text-gold-400/15 sm:w-[48%]">
        <BrushStroke className="h-auto w-full" delay={0.3} />
      </div>
      <div className="container relative">
        <Reveal>
          <p className="eyebrow text-gold-300">{eyebrow}</p>
        </Reveal>
        <h1 className="mt-5 max-w-4xl text-display-lg font-extrabold text-white">
          <PaintWipe roller delay={0.08} className="block">
            {title}
          </PaintWipe>
        </h1>
        {description && (
          <Reveal delay={0.2}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-navy-100/80 sm:text-xl">{description}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
