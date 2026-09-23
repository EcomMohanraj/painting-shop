import type { Metadata } from "next";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { DatabaseNotice, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { createService } from "../actions";

export const metadata: Metadata = { title: "Add service" };

export default async function NewServicePage() {
  await requireAdmin();
  if (!isDatabaseConfigured) return <DatabaseNotice />;

  return (
    <>
      <PageHeader title="Add service" backHref="/admin/services" />
      <ServiceForm action={createService} />
    </>
  );
}
