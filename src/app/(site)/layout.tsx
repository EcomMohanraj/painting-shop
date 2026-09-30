import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { PaintCursor } from "@/components/ui/PaintCursor";
import { getServices } from "@/lib/content";

// Public pages are static and refreshed immediately when content is saved in
// /admin (revalidatePath). This hourly refresh is a safety net for changes made
// outside the admin, e.g. `npm run db:seed` or editing in Prisma Studio.
export const revalidate = 3600;

/** Chrome for the public website. Route group "(site)" doesn't affect URLs. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const services = await getServices();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer services={services} />
      <FloatingActions />
      <PaintCursor />
    </>
  );
}
