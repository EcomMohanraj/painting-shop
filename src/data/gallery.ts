// Placeholder before/after projects — used by prisma/seed.ts, and by the site
// only when DATABASE_URL isn't set. Live content is managed in /admin.
// Photos are free Unsplash stock photos
// (Unsplash License: free to use, no attribution required). The before and
// after photos are NOT the same space — replace them with real job photos,
// either via the admin panel or by editing `before` / `after` here.
export type GalleryProject = {
  id: string;
  title: string;
  /** Display label, e.g. "Interior", "Waterproofing". */
  category: string;
  location: string;
  before?: string;
  after?: string;
  // Used for the placeholder panels when a project has no images.
  afterColor: string;
};

/** Unsplash image URL, resized and served as WebP/AVIF by Unsplash's CDN. */
export const unsplash = (id: string, width = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

export const galleryProjects: GalleryProject[] = [
  {
    id: "p1",
    title: "Living Room Repaint",
    category: "Interior",
    location: "City Area",
    before: unsplash("1763667083561-90f384685999"), // empty room, peeling wallpaper
    after: unsplash("1600210491369-e753d80a41f3"), // bright living room, white walls
    afterColor: "#e8dcc4",
  },
  {
    id: "p2",
    title: "Villa Exterior",
    category: "Exterior",
    location: "City Area",
    before: unsplash("1634759413657-cf9a268f36f5"), // weathered old house
    after: unsplash("1602343168117-bb8ffe3e2e9f"), // freshly finished white villa
    afterColor: "#c9d6df",
  },
  {
    id: "p3",
    title: "Corporate Office",
    category: "Commercial",
    location: "City Area",
    before: unsplash("1768321901750-f7b96d774456"), // interior under renovation
    after: unsplash("1577412647305-991150c7d163"), // finished open-plan office
    afterColor: "#dfe6f1",
  },
  {
    id: "p4",
    title: "Feature Wall",
    category: "Texture",
    location: "City Area",
    before: unsplash("1668079334321-e51822308968"), // cracked, flaking wall
    after: unsplash("1780123942992-bb7a449452c4"), // two-tone textured wall
    afterColor: "#d8c3a5",
  },
  {
    id: "p5",
    title: "Kids' Bedroom",
    category: "Interior",
    location: "City Area",
    before: unsplash("1741105820091-3d150a451cfe"), // bare empty room
    after: unsplash("1763478958800-3a2a6321f645"), // finished child's bedroom
    afterColor: "#cfe3d4",
  },
  {
    id: "p6",
    title: "Retail Showroom",
    category: "Commercial",
    location: "City Area",
    before: unsplash("1751486403890-793880b12adb"), // bare plastered wall, work lights
    after: unsplash("1764795850238-7a024db5e3ee"), // finished retail store
    afterColor: "#f3e1b4",
  },
];

