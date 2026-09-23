import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Server-only. In production DATABASE_URL is Neon's pooled connection string.
// Any other Postgres URL (e.g. a local `npx prisma dev` database) uses the
// standard TCP driver instead, so the app can be developed without Neon.

export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

function createClient() {
  const url = process.env.DATABASE_URL ?? "";
  const adapter = url.includes(".neon.tech")
    ? new PrismaNeon({ connectionString: url })
    : new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
}

// Reuse one client across hot reloads in development instead of opening a new
// connection pool every time a file changes.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
