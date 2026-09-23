import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { QuoteForm } from "@/components/contact/QuoteForm";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { getServices } from "@/lib/content";
import { site, telLink, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us — Get a Free Quote",
  description: `Contact ${site.name} for a free site visit and painting quote. Call, WhatsApp or send an enquiry online.`,
  alternates: { canonical: "/contact" },
};

const contactItems = [
  { icon: Phone, label: "Call us", value: site.phone, href: telLink },
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: MapPin, label: "Address", value: site.address },
  { icon: Clock, label: "Working hours", value: site.hours },
];

export default async function ContactPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="Get your free painting quote"
        description="Tell us about your project and we'll arrange a free site visit and a detailed quote."
      />

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <h2 className="text-2xl font-bold">Talk to our team</h2>
            <p className="mt-2 text-charcoal-600">Prefer to speak directly? Reach us any of these ways.</p>

            <ul className="mt-8 space-y-4">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex gap-4 rounded-xl border border-navy-50 p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gold-50 text-gold-600">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">{label}</p>
                    {href ? (
                      <a href={href} className="break-words font-medium text-navy-900 hover:text-gold-600">
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium text-navy-900">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-6 w-full bg-[#25D366] text-white hover:bg-[#1ebe5b]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chat on WhatsApp
            </a>

            {/* TODO: replace with a Google Maps embed of the business location */}
            <div className="mt-6 grid aspect-video place-items-center rounded-xl bg-navy-50 text-sm font-medium uppercase tracking-widest text-navy-700/50">
              Map placeholder
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <QuoteForm serviceNames={services.map((s) => s.title)} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
