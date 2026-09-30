"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/admin/ui";
import { checkbox, fieldErrors, imageUrl, optionalText, requiredText, sortOrder, text } from "@/lib/admin-forms";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteImage } from "@/lib/storage";

const testimonialSchema = z.object({
  name: requiredText("Customer name", 100),
  location: optionalText(100),
  project: optionalText(120),
  rating: z.coerce.number().int().min(1, "Rating must be 1–5.").max(5, "Rating must be 1–5."),
  quote: requiredText("Review", 2000),
  photo: z.union([z.literal("").transform(() => null), imageUrl]),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder,
});

function parse(formData: FormData) {
  return testimonialSchema.safeParse({
    name: text(formData, "name"),
    location: text(formData, "location"),
    project: text(formData, "project"),
    rating: text(formData, "rating"),
    quote: text(formData, "quote"),
    photo: text(formData, "photo"),
    featured: checkbox(formData, "featured"),
    published: checkbox(formData, "published"),
    sortOrder: text(formData, "sortOrder"),
  });
}

function revalidate() {
  revalidatePath("/admin/testimonials");
  revalidatePath("/admin");
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export async function createTestimonial(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };

  await db.testimonial.create({ data: parsed.data });

  revalidate();
  redirect("/admin/testimonials?saved=1");
}

export async function updateTestimonial(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };

  const existing = await db.testimonial.findUnique({ where: { id }, select: { photo: true } });
  if (!existing) return { message: "This testimonial no longer exists." };
  await db.testimonial.update({ where: { id }, data: parsed.data });

  // Remove the old photo if it was replaced or cleared.
  if (existing.photo !== parsed.data.photo) await deleteImage(existing.photo);

  revalidate();
  redirect("/admin/testimonials?saved=1");
}
