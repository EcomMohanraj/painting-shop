import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma CLI doesn't read Next.js env files, so load them the same way Next does.
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations need Neon's direct (non-pooled) connection; the app itself uses
    // the pooled DATABASE_URL via the Neon adapter in src/lib/db.ts.
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
});
