// Central business details. Update these once — every page, the footer,
// the floating buttons and the SEO metadata read from here.
export const site = {
  name: "Krisha Paintings",
  tagline: "Professional Residential & Commercial Painting",
  description:
    "Krisha Paintings delivers professional residential and commercial painting services — interior, exterior, texture and waterproofing — with clean finishes and on-time delivery since 2017.",
  // TODO: placeholder domain — update once the real domain is live (used for sitemap, robots and SEO).
  url: "https://krishapaintings.com",
  established: 2017,
  phone: "+91 97153 34907",
  // Digits only, with country code — used for tel: and wa.me (WhatsApp) links.
  phoneRaw: "919715334907",
  whatsappMessage: "Hi Krisha Paintings, I'd like a painting quote.",
  email: "info@krishapaintings.com",
  address: "No. 12, Main Road, Dindigul, Tamil Nadu - 624001",
  // Structured parts of the address above, used for search-engine business data.
  addressParts: {
    street: "No. 12, Main Road",
    city: "Dindigul",
    region: "Tamil Nadu",
    postalCode: "624001",
    country: "IN",
  },
  hours: "Mon – Sat: 9 AM – 7 PM, Sunday closed",
  social: {
    facebook: "#",
    instagram: "#",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact Us" },
] as const;

export function whatsappLink(message: string = site.whatsappMessage) {
  return `https://wa.me/${site.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export const telLink = `tel:+${site.phoneRaw}`;

export const yearsInBusiness = new Date().getFullYear() - site.established;
