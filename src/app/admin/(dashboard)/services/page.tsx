import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Badge, Card, DatabaseNotice, EmptyState, PageHeader, SavedBanner } from "@/components/admin/ui";
import { labelFor, serviceCategories } from "@/lib/admin-options";
import { requireAdmin } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage({ searchParams }: { searchParams: { saved?: string } }) {
  await requireAdmin();
  if (!isDatabaseConfigured) return <DatabaseNotice />;

  const services = await db.service.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] });

  return (
    <>
      <PageHeader title="Services" description="Services listed on the website." newHref="/admin/services/new" newLabel="Add service" />
      <SavedBanner show={searchParams.saved === "1"} text="Service saved." />

      {services.length === 0 ? (
        <EmptyState>No services yet.</EmptyState>
      ) : (
        <Card className="divide-y divide-navy-50">
          {services.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{s.title}</h2>
                  <Badge>{labelFor(serviceCategories, s.category)}</Badge>
                  {!s.published && <Badge>Hidden</Badge>}
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-charcoal-500">{s.summary}</p>
              </div>
              <Link href={`/admin/services/${s.id}`} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-navy-900 hover:bg-navy-50">
                <Pencil className="h-4 w-4" aria-hidden /> Edit
              </Link>
            </div>
          ))}
        </Card>
      )}
    </>
  );
}
