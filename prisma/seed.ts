// Seeds the database with the placeholder content from src/data so the site has
// something to show right after the first migration. Safe to re-run: services
// and projects are upserted by slug, testimonials are only added to an empty table.
//
//   npm run db:seed

import { config } from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ProjectType, ServiceCategory } from "../src/generated/prisma/client";
import { services } from "../src/data/services";
import { testimonials } from "../src/data/testimonials";
import { galleryProjects } from "../src/data/gallery";
import { slugify } from "../src/lib/slug";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set — add it to .env.local first.");

// Same adapter choice as src/lib/db.ts: Neon for *.neon.tech, plain TCP otherwise.
const db = new PrismaClient({
  adapter: url.includes(".neon.tech") ? new PrismaNeon({ connectionString: url }) : new PrismaPg({ connectionString: url }),
});

async function main() {
  for (const [i, s] of services.entries()) {
    const data = {
      title: s.title,
      category: s.category === "Residential" ? ServiceCategory.RESIDENTIAL : ServiceCategory.COMMERCIAL,
      summary: s.summary,
      features: s.features,
      icon: s.icon,
      image: s.image ?? null,
      sortOrder: i,
    };
    await db.service.upsert({ where: { slug: s.slug }, create: { slug: s.slug, ...data }, update: data });
  }
  console.log(`✔ ${services.length} services`);

  for (const [i, p] of galleryProjects.entries()) {
    const slug = slugify(p.title);
    const data = {
      name: p.title,
      location: p.location,
      type: p.category.toUpperCase() as ProjectType,
      beforeImage: p.before ?? null,
      afterImage: p.after ?? null,
      sortOrder: i,
    };
    await db.project.upsert({ where: { slug }, create: { slug, ...data }, update: data });
  }
  console.log(`✔ ${galleryProjects.length} projects`);

  if ((await db.testimonial.count()) === 0) {
    await db.testimonial.createMany({
      data: testimonials.map((t, i) => ({ ...t, sortOrder: i, featured: i < 3 })),
    });
    console.log(`✔ ${testimonials.length} testimonials`);
  } else {
    console.log("• testimonials already present — skipped");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
