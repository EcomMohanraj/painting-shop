import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/admin/FormControls";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { DatabaseNotice, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/lib/db";
import { deleteProject, updateProject } from "../actions";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  if (!isDatabaseConfigured) return <DatabaseNotice />;

  const [project, services] = await Promise.all([
    db.project.findUnique({ where: { id: params.id }, include: { photos: { orderBy: { sortOrder: "asc" } } } }),
    db.service.findMany({ select: { id: true, title: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  if (!project) notFound();

  return (
    <>
      <PageHeader title={`Edit: ${project.name}`} backHref="/admin/projects" />
      <ProjectForm
        action={updateProject.bind(null, project.id)}
        services={services}
        initial={{
          ...project,
          completedAt: project.completedAt?.toISOString().slice(0, 10) ?? null,
          photos: project.photos.map((p) => p.url),
        }}
      />
      <div className="mt-10 border-t border-navy-100 pt-6">
        <DeleteButton
          action={deleteProject.bind(null, project.id)}
          confirmText={`Delete "${project.name}" and all its photos? This can't be undone.`}
          label="Delete project"
        />
      </div>
    </>
  );
}
