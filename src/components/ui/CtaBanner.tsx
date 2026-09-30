import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { site, telLink } from "@/lib/site";
import { BrushStroke } from "./BrushStroke";
import { PaintWipe } from "./PaintWipe";
import { Reveal } from "./Reveal";

/** Full-bleed gold call to action, closing most pages before the footer. */
export function CtaBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-gold-400">
      <div aria-hidden className="absolute -left-[10%] top-1/2 -z-10 w-[90%] -translate-y-1/2 text-gold-300 lg:w-[65%]">
        <BrushStroke inView className="h-auto w-full" strokeWidth={70} />
      </div>
      <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45),rgba(255,255,255,0)_65%)]" />

      <div className="container grid items-end gap-10 py-24 sm:py-32 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="eyebrow text-navy-900">Free site visit · No obligation</p>
          </Reveal>
          <h2 className="mt-5 text-display-lg font-extrabold text-navy-950">
            <PaintWipe inView className="block">
              Ready to give your space a fresh new look?
            </PaintWipe>
          </h2>
        </div>
        <Reveal delay={0.15}>
          <p className="text-lg leading-relaxed text-navy-900/85">
            Get a free site visit and a transparent, no-obligation quote from the {site.name} team.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link href="/contact" className="btn-lg btn group bg-navy-950 text-white shadow-hero hover:bg-navy-800">
              Get a Free Quote
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" aria-hidden />
            </Link>
            <a href={telLink} className="btn-lg btn border-2 border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-gold-300">
              <Phone className="h-4 w-4" aria-hidden />
              {site.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
