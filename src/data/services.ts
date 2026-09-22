// Placeholder services — replace copy with real offerings.
export type Service = {
  slug: string;
  title: string;
  category: "Residential" | "Commercial";
  summary: string;
  features: string[];
  icon: "home" | "brush" | "building" | "droplets" | "layers" | "paint";
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
  },
  {
    slug: "exterior-painting",
    title: "Exterior Painting",
    category: "Residential",
    summary:
      "Weather-resistant exterior coatings that protect your home from sun, rain and fading.",
    features: ["Crack filling & primer", "Weatherproof emulsions", "Scaffolding & safety"],
    icon: "paint",
  },
  {
    slug: "texture-designer-finishes",
    title: "Texture & Designer Finishes",
    category: "Residential",
    summary:
      "Feature walls, stencils and textured finishes that give your space a distinctive look.",
    features: ["Royale play & stucco", "Stencil art", "Accent walls"],
    icon: "brush",
  },
  {
    slug: "commercial-painting",
    title: "Commercial Painting",
    category: "Commercial",
    summary:
      "Offices, showrooms and retail spaces painted on schedule, with minimal disruption to your business.",
    features: ["After-hours scheduling", "Brand colour matching", "Large-area project management"],
    icon: "building",
  },
  {
    slug: "industrial-coatings",
    title: "Industrial & Floor Coatings",
    category: "Commercial",
    summary:
      "Durable epoxy and PU coatings for warehouses, factories and parking areas.",
    features: ["Epoxy flooring", "Anti-corrosive metal coatings", "Line marking"],
    icon: "layers",
  },
  {
    slug: "waterproofing",
    title: "Waterproofing",
    category: "Commercial",
    summary:
      "Terrace, wall and bathroom waterproofing to stop leaks and dampness before they damage paint.",
    features: ["Terrace & roof treatment", "Damp-proof coatings", "Leak inspection"],
    icon: "droplets",
  },
];
