import type { Metadata } from "next";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { DatabaseNotice, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { createTestimonial } from "../actions";

export const metadata: Metadata = { title: "Add testimonial" };

export default async function NewTestimonialPage() {
  await requireAdmin();
  if (!isDatabaseConfigured) return <DatabaseNotice />;

  return (
    <>
      <PageHeader title="Add testimonial" backHref="/admin/testimonials" />
      <TestimonialForm action={createTestimonial} />
    </>
  );
}
