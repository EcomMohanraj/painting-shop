import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { DatabaseNotice, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/lib/db";
import { updateTestimonial } from "../actions";

export const metadata: Metadata = { title: "Edit testimonial" };

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  if (!isDatabaseConfigured) return <DatabaseNotice />;

  const testimonial = await db.testimonial.findUnique({ where: { id: params.id } });
  if (!testimonial) notFound();

  return (
    <>
      <PageHeader title={`Edit: ${testimonial.name}`} backHref="/admin/testimonials" />
      <TestimonialForm action={updateTestimonial.bind(null, testimonial.id)} initial={testimonial} />
    </>
  );
}
