import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ImageOff, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/FormControls";
import { Badge, Card, DatabaseNotice, EmptyState, PageHeader, SavedBanner } from "@/components/admin/ui";
import { labelFor, projectTypes } from "@/lib/admin-options";
import { requireAdmin } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/lib/db";
import { deleteProject } from "./actions";

export const metadata: Metadata = { title: "Projects" };

const typeLabel = (t: string) => labelFor(projectTypes, t);

export default async function ProjectsPage({ searchParams }: { searchParams: { saved?: string; deleted?: string } }) {
  await requireAdmin();
  if (!isDatabaseConfigured) return <DatabaseNotice />;

  const projects = await db.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { photos: true } } },
  });

  return (
    <>
      <PageHeader title="Projects" description="Before & after gallery projects." newHref="/admin/projects/new" newLabel="Add project" />
      <SavedBanner show={searchParams.saved === "1"} text="Project saved." />
      <SavedBanner show={searchParams.deleted === "1"} text="Project deleted." />

      {projects.length === 0 ? (
        <EmptyState>No projects yet. Add your first before & after project.</EmptyState>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <li key={p.id}>
              <Card className="flex gap-4 p-4">
                <div className="grid w-40 shrink-0 grid-cols-2 gap-1 overflow-hidden rounded-lg">
                  {[p.beforeImage, p.afterImage].map((src, i) => (
                    <div key={i} className="relative aspect-square bg-navy-50">
                      {src ? (
                        <Image src={src} alt={`${p.name} ${i === 0 ? "before" : "after"}`} fill unoptimized sizes="80px" className="object-cover" />
                      ) : (
                        <ImageOff className="absolute inset-0 m-auto h-5 w-5 text-navy-200" aria-label="No image" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold">{p.name}</h2>
                  <p className="text-sm text-charcoal-500">{p.location}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge>{typeLabel(p.type)}</Badge>
                    {!p.published && <Badge>Hidden</Badge>}
                    {p.featured && <Badge tone="gold">Featured</Badge>}
                    {p._count.photos > 0 && <Badge>+{p._count.photos} photos</Badge>}
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    <Link href={`/admin/projects/${p.id}`} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-navy-900 hover:bg-navy-50">
                      <Pencil className="h-4 w-4" aria-hidden /> Edit
                    </Link>
                    <DeleteButton
                      action={deleteProject.bind(null, p.id)}
                      confirmText={`Delete "${p.name}" and all its photos? This can't be undone.`}
                    />
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
