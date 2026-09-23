import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { DatabaseNotice, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/lib/db";
import { updateService } from "../actions";

export const metadata: Metadata = { title: "Edit service" };

export default async function EditServicePage({ params }: { params: { id: string } }) {
  await requireAdmin();
  if (!isDatabaseConfigured) return <DatabaseNotice />;

  const service = await db.service.findUnique({ where: { id: params.id } });
  if (!service) notFound();

  return (
    <>
      <PageHeader title={`Edit: ${service.title}`} backHref="/admin/services" />
      <ServiceForm action={updateService.bind(null, service.id)} initial={service} />
    </>
  );
}
