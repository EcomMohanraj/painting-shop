import Link from "next/link";
import { Phone } from "lucide-react";
import { site, telLink } from "@/lib/site";
import { Reveal } from "./Reveal";

export function CtaBanner() {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-12 text-center sm:px-12 sm:py-16">
            <div aria-hidden className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-gold-400/20 blur-3xl" />
            <div aria-hidden className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to give your space a fresh new look?
              </h2>
              <p className="mt-4 text-navy-100/80">
                Get a free site visit and a transparent, no-obligation quote from the {site.name} team.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/contact" className="btn-primary">
                  Get a Free Quote
                </Link>
                <a href={telLink} className="btn-outline-light">
                  <Phone className="h-4 w-4" aria-hidden />
                  {site.phone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
