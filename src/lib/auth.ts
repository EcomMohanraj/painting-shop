import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
import { verifyPassword } from "./password";

// Single admin account, configured via env vars (see .env.example):
//   ADMIN_EMAIL, ADMIN_PASSWORD_HASH (create with `npm run admin:hash`),
//   NEXTAUTH_SECRET, NEXTAUTH_URL.
// Move to a database-backed users table when more than one admin is needed.

// Basic brute-force protection: after MAX_FAILURES wrong passwords from one IP,
// further attempts are refused for LOCKOUT_MS. In-memory, so it resets on
// restart and isn't shared between serverless instances — a speed bump, not a wall.
const MAX_FAILURES = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; firstAt: number }>();

// Used so a wrong email takes as long as a wrong password (no timing hint).
const DUMMY_HASH = "scrypt:00000000000000000000000000000000:" + "0".repeat(128);

function clientIp(headers: Record<string, unknown> | undefined): string {
  const forwarded = headers?.["x-forwarded-for"];
  return (typeof forwarded === "string" && forwarded.split(",")[0].trim()) || "unknown";
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminHash = process.env.ADMIN_PASSWORD_HASH?.trim();
        if (!adminEmail || !adminHash) {
          console.error("[auth] ADMIN_EMAIL or ADMIN_PASSWORD_HASH is not set.");
          return null;
        }

        const ip = clientIp(req?.headers);
        const record = failures.get(ip);
        if (record && Date.now() - record.firstAt > LOCKOUT_MS) failures.delete(ip);
        else if (record && record.count >= MAX_FAILURES) {
          throw new Error("TooManyAttempts");
        }

        const email = credentials?.email?.trim().toLowerCase() ?? "";
        const password = credentials?.password ?? "";
        const emailMatches = email === adminEmail;
        const passwordMatches = verifyPassword(password, emailMatches ? adminHash : DUMMY_HASH);

        if (emailMatches && passwordMatches) {
          failures.delete(ip);
          return { id: "admin", email: adminEmail, name: "Admin" };
        }

        const current = failures.get(ip);
        failures.set(ip, { count: (current?.count ?? 0) + 1, firstAt: current?.firstAt ?? Date.now() });
        return null;
      },
    }),
  ],
};

/** For server components/pages under /admin: returns the session or redirects to login. */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  return session;
}
