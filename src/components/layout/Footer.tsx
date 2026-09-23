import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { navLinks, site, telLink } from "@/lib/site";
import type { Service } from "@/data/services";
import { Logo } from "./Logo";

export function Footer({ services }: { services: Pick<Service, "slug" | "title">[] }) {
  return (
    // Extra bottom padding on mobile keeps the floating buttons from covering footer text.
    <footer className="bg-navy-950 pb-24 pt-16 text-navy-100/80 sm:pb-16">
      <div className="container grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            {site.tagline}. Trusted by homeowners and businesses since {site.established}.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-gold-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Services</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services#${s.slug}`} className="transition-colors hover:text-gold-300">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Get in Touch</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
              <a href={telLink} className="hover:text-gold-300">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
              <a href={`mailto:${site.email}`} className="break-all hover:text-gold-300">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
              <span>{site.address}</span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
              <span>{site.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mt-12 border-t border-white/10 pt-6 text-xs text-navy-100/60 sm:flex sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <p className="mt-2 sm:mt-0">Established {site.established}</p>
      </div>
    </footer>
  );
}
