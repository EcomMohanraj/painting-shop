import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/layout/Logo";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

// Only allow redirects back into the admin area (no open redirects).
function safeCallback(url: string | string[] | undefined) {
  if (typeof url !== "string") return "/admin";
  try {
    const path = url.startsWith("/") ? url : new URL(url).pathname;
    return path.startsWith("/admin") && !path.startsWith("/admin/login") && !path.startsWith("//") ? path : "/admin";
  } catch {
    return "/admin";
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string | string[]; error?: string | string[] };
}) {
  const callbackUrl = safeCallback(searchParams.callbackUrl);
  if (await getServerSession(authOptions)) redirect(callbackUrl);

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-navy-50 bg-white p-6 shadow-card sm:p-8">
          <h1 className="text-xl font-bold">Admin sign in</h1>
          <p className="mt-1 text-sm text-charcoal-600">Sign in to manage your website.</p>
          <LoginForm callbackUrl={callbackUrl} initialError={typeof searchParams.error === "string" ? searchParams.error : undefined} />
        </div>
      </div>
    </main>
  );
}
