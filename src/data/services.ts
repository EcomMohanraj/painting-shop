import { unsplash } from "./gallery";

// Placeholder services — used by prisma/seed.ts, and by the site only when
// DATABASE_URL isn't set. Live content is managed in /admin.
// Images are free Unsplash stock photos (Unsplash License).
export type Service = {
  slug: string;
  title: string;
  category: "Residential" | "Commercial";
  summary: string;
  features: string[];
  icon: "home" | "brush" | "building" | "droplets" | "layers" | "paint";
  image?: string;
};

export const services: Service[] = [
  {
    slug: "interior-painting",
    title: "Interior Painting",
    category: "Residential",
    summary:
      "Fresh, even finishes for living rooms, bedrooms and kitchens with low-odour, washable paints.",
    features: ["Wall & ceiling painting", "Surface prep & putty work", "Furniture protection & cleanup"],
    icon: "home",
    image: unsplash("1717281234297-3def5ae3eee1", 1200), // painter rolling an interior wall
  },
  {
    slug: "exterior-painting",
    title: "Exterior Painting",
    category: "Residential",
    summary:
      "Weather-resistant exterior coatings that protect your home from sun, rain and fading.",
    features: ["Crack filling & primer", "Weatherproof emulsions", "Scaffolding & safety"],
    icon: "paint",
    image: unsplash("1742900280864-bcc27353ceba", 1200), // painter on a building exterior
  },
  {
    slug: "texture-designer-finishes",
    title: "Texture & Designer Finishes",
    category: "Residential",
    summary:
      "Feature walls, stencils and textured finishes that give your space a distinctive look.",
    features: ["Royale play & stucco", "Stencil art", "Accent walls"],
    icon: "brush",
    image: unsplash("1785850564762-e046c16fbcf9", 1200), // textured wall in warm light
  },
  {
    slug: "commercial-painting",
    title: "Commercial Painting",
    category: "Commercial",
    summary:
      "Offices, showrooms and retail spaces painted on schedule, with minimal disruption to your business.",
    features: ["After-hours scheduling", "Brand colour matching", "Large-area project management"],
    icon: "building",
    image: unsplash("1631193816258-28b44b21e78b", 1200), // open-plan office
  },
  {
    slug: "industrial-coatings",
    title: "Industrial & Floor Coatings",
    category: "Commercial",
    summary:
      "Durable epoxy and PU coatings for warehouses, factories and parking areas.",
    features: ["Epoxy flooring", "Anti-corrosive metal coatings", "Line marking"],
    icon: "layers",
    image: unsplash("1772305595483-6b058aff40f9", 1200), // workers coating a warehouse floor
  },
  {
    slug: "waterproofing",
    title: "Waterproofing",
    category: "Commercial",
    summary:
      "Terrace, wall and bathroom waterproofing to stop leaks and dampness before they damage paint.",
    features: ["Terrace & roof treatment", "Damp-proof coatings", "Leak inspection"],
    icon: "droplets",
    image: unsplash("1674485169641-bcb2bf6f1df9", 1200), // roof waterproofing spray
  },
];
