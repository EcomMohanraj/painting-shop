// Placeholder before/after projects.
// To use real photos: drop files in /public/images/gallery/ and set
// `before` / `after` to paths like "/images/gallery/living-room-before.jpg".
export type GalleryProject = {
  id: string;
  title: string;
  category: "Interior" | "Exterior" | "Commercial" | "Texture";
  location: string;
  before?: string;
  after?: string;
  // Used for the placeholder panels until real images are added.
  afterColor: string;
};

export const galleryProjects: GalleryProject[] = [
  { id: "p1", title: "Living Room Repaint", category: "Interior", location: "City Area", afterColor: "#e8dcc4" },
  { id: "p2", title: "Villa Exterior", category: "Exterior", location: "City Area", afterColor: "#c9d6df" },
  { id: "p3", title: "Corporate Office", category: "Commercial", location: "City Area", afterColor: "#dfe6f1" },
  { id: "p4", title: "Feature Wall", category: "Texture", location: "City Area", afterColor: "#d8c3a5" },
  { id: "p5", title: "Kids' Bedroom", category: "Interior", location: "City Area", afterColor: "#cfe3d4" },
  { id: "p6", title: "Retail Showroom", category: "Commercial", location: "City Area", afterColor: "#f3e1b4" },
];

export const galleryCategories = ["All", "Interior", "Exterior", "Commercial", "Texture"] as const;
