// Option lists shared by admin server pages and client forms.
// (Kept out of "use client" files so server components can read the actual values.)

export const projectTypes = [
  { value: "INTERIOR", label: "Interior" },
  { value: "EXTERIOR", label: "Exterior" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "TEXTURE", label: "Texture" },
  { value: "WATERPROOFING", label: "Waterproofing" },
  { value: "INDUSTRIAL", label: "Industrial" },
] as const;

export const serviceCategories = [
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "COMMERCIAL", label: "Commercial" },
] as const;

// Must match the icon keys in src/components/ui/ServiceCard.tsx.
export const serviceIcons = [
  { value: "home", label: "House" },
  { value: "paint", label: "Paint bucket" },
  { value: "brush", label: "Brush" },
  { value: "building", label: "Building" },
  { value: "layers", label: "Layers" },
  { value: "droplets", label: "Water drops" },
] as const;

export const labelFor = (options: readonly { value: string; label: string }[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value;

// Standalone site photos (SiteImage rows), managed in /admin/site-content.
// Add a slot here to make it editable — no migration or new form needed.
export const siteImageSlots = [
  { key: "about-team-photo", label: "About page — Team photo" },
] as const;
