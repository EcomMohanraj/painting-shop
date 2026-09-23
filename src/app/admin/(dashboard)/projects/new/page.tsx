import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { DatabaseNotice, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/lib/db";
import { createProject } from "../actions";

export const metadata: Metadata = { title: "Add project" };

export default async function NewProjectPage() {
  await requireAdmin();
  if (!isDatabaseConfigured) return <DatabaseNotice />;

  const services = await db.service.findMany({ select: { id: true, title: true }, orderBy: { sortOrder: "asc" } });

  return (
    <>
      <PageHeader title="Add project" backHref="/admin/projects" />
      <ProjectForm action={createProject} services={services} />
    </>
  );
}
