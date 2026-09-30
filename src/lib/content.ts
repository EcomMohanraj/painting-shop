import "server-only";
import { galleryProjects as staticProjects, type GalleryProject } from "@/data/gallery";
import { services as staticServices, type Service } from "@/data/services";
import { testimonials as staticTestimonials, type Testimonial } from "@/data/testimonials";
import { labelFor, projectTypes, serviceIcons } from "./admin-options";
import { db, isDatabaseConfigured } from "./db";

// Published website content, read from the database (managed in /admin).
//
// Pages using these are statically generated and refreshed on demand when the
// admin saves changes (revalidatePath in the admin server actions), plus a
// periodic safety-net refresh set in app/(site)/layout.tsx. If the database is
// briefly unreachable during a refresh, Next keeps serving the last good page.
//
// Without DATABASE_URL (e.g. a fresh checkout), the placeholder content in
// src/data is used so the site still renders.

const PLACEHOLDER_COLOR = "#e8e2d6";

// ─── Services ───────────────────────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  if (!isDatabaseConfigured) return staticServices;
  const rows = await db.service.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
  return rows.map((s) => ({
    slug: s.slug,
    title: s.title,
    category: s.category === "COMMERCIAL" ? "Commercial" : "Residential",
    summary: s.summary,
    features: s.features,
    icon: (serviceIcons.some((i) => i.value === s.icon) ? s.icon : "paint") as Service["icon"],
    image: s.image ?? undefined,
  }));
}

// ─── Projects (before & after gallery) ──────────────────────────────────────

export async function getProjects({ featured }: { featured?: boolean } = {}): Promise<GalleryProject[]> {
  if (!isDatabaseConfigured) return staticProjects;
  const rows = await db.project.findMany({
    where: { published: true, ...(featured ? { featured: true } : {}) },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return rows.map((p) => ({
    id: p.id,
    title: p.name,
    category: labelFor(projectTypes, p.type),
    location: p.location,
    before: p.beforeImage ?? undefined,
    after: p.afterImage ?? undefined,
    afterColor: PLACEHOLDER_COLOR,
  }));
}

/** Home page: projects marked "Featured", or the first few if none are. */
export async function getHomeProjects(limit = 3): Promise<GalleryProject[]> {
  const featured = await getProjects({ featured: true });
  return (featured.length ? featured : await getProjects()).slice(0, limit);
}

// ─── Testimonials ───────────────────────────────────────────────────────────

export async function getTestimonials({ featured }: { featured?: boolean } = {}): Promise<Testimonial[]> {
  if (!isDatabaseConfigured) return staticTestimonials;
  const rows = await db.testimonial.findMany({
    where: { published: true, ...(featured ? { featured: true } : {}) },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return rows.map((t) => ({
    name: t.name,
    location: t.location ?? "",
    project: t.project ?? "",
    rating: Math.min(5, Math.max(1, t.rating)) as Testimonial["rating"],
    quote: t.quote,
    photo: t.photo ?? undefined,
  }));
}

/** Home page: testimonials marked "Featured", or the first few if none are. */
export async function getHomeTestimonials(limit = 3): Promise<Testimonial[]> {
  const featured = await getTestimonials({ featured: true });
  return (featured.length ? featured : await getTestimonials()).slice(0, limit);
}

// ─── Site photos ────────────────────────────────────────────────────────────

/** URL of a standalone site photo (see siteImageSlots), or null if not set. */
export async function getSiteImage(key: string): Promise<string | null> {
  if (!isDatabaseConfigured) return null;
  const row = await db.siteImage.findUnique({ where: { key } });
  return row?.url ?? null;
}
