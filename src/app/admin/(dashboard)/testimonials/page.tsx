import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Star } from "lucide-react";
import { Badge, Card, DatabaseNotice, EmptyState, PageHeader, SavedBanner } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = { title: "Testimonials" };

export default async function TestimonialsPage({ searchParams }: { searchParams: { saved?: string } }) {
  await requireAdmin();
  if (!isDatabaseConfigured) return <DatabaseNotice />;

  const testimonials = await db.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Customer reviews shown on the website."
        newHref="/admin/testimonials/new"
        newLabel="Add testimonial"
      />
      <SavedBanner show={searchParams.saved === "1"} text="Testimonial saved." />

      {testimonials.length === 0 ? (
        <EmptyState>No testimonials yet.</EmptyState>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <li key={t.id}>
              <Card className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{t.name}</h2>
                    <p className="text-xs text-charcoal-500">{[t.project, t.location].filter(Boolean).join(" · ")}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-navy-900" aria-label={`${t.rating} out of 5 stars`}>
                    <Star className="h-4 w-4 fill-gold-400 text-gold-400" aria-hidden /> {t.rating}
                  </span>
                </div>
                <p className="mt-3 line-clamp-3 flex-1 text-sm text-charcoal-700">“{t.quote}”</p>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <div className="flex gap-1.5">
                    {!t.published && <Badge>Hidden</Badge>}
                    {t.featured && <Badge tone="gold">Featured</Badge>}
                  </div>
                  <Link href={`/admin/testimonials/${t.id}`} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-navy-900 hover:bg-navy-50">
                    <Pencil className="h-4 w-4" aria-hidden /> Edit
                  </Link>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
