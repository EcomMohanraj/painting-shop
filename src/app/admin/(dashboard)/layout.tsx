import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth";

// Every page in this group requires a signed-in admin (checked server-side,
// in addition to src/middleware.ts).
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <>
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-navy-50 bg-white">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden rounded-full bg-navy-900 px-2.5 py-0.5 text-xs font-semibold text-gold-300 sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-charcoal-500 md:inline">{session.user?.email}</span>
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-charcoal-600 hover:bg-navy-50 hover:text-navy-900 sm:inline-flex"
            >
              View site <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <SignOutButton />
          </div>
        </div>
        <AdminNav />
      </header>
      <main className="container py-8 sm:py-12">{children}</main>
    </>
  );
}
