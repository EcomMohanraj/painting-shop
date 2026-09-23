"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ServiceCategory } from "@/generated/prisma/enums";
import type { FormState } from "@/components/admin/ui";
import { serviceIcons } from "@/lib/admin-options";
import { checkbox, fieldErrors, optionalText, requiredText, sortOrder, text, uniqueSlug } from "@/lib/admin-forms";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const serviceSchema = z.object({
  title: requiredText("Title", 100),
  category: z.enum(ServiceCategory, "Choose a category."),
  summary: requiredText("Summary", 300),
  description: optionalText(5000),
  // One feature per line in the textarea.
  features: z
    .string()
    .transform((v) => v.split("\n").map((l) => l.trim()).filter(Boolean))
    .pipe(z.array(z.string().max(120, "Each feature must be 120 characters or fewer.")).max(12, "Up to 12 features.")),
  icon: z.enum(serviceIcons.map((i) => i.value) as [string, ...string[]], "Choose an icon."),
  published: z.boolean(),
  sortOrder,
});

function parse(formData: FormData) {
  return serviceSchema.safeParse({
    title: text(formData, "title"),
    category: text(formData, "category"),
    summary: text(formData, "summary"),
    description: text(formData, "description"),
    features: text(formData, "features"),
    icon: text(formData, "icon"),
    published: checkbox(formData, "published"),
    sortOrder: text(formData, "sortOrder"),
  });
}

function revalidate() {
  // Services appear on every public page (footer) and in the contact form,
  // so refresh the whole site rather than individual pages.
  revalidatePath("/", "layout");
}

export async function createService(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };

  const slug = await uniqueSlug(parsed.data.title, async (s) => Boolean(await db.service.findUnique({ where: { slug: s } })));
  await db.service.create({ data: { ...parsed.data, slug } });

  revalidate();
  redirect("/admin/services?saved=1");
}

export async function updateService(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };

  // The slug stays the same on edit so existing links (/services#slug) keep working.
  const updated = await db.service.updateMany({ where: { id }, data: parsed.data });
  if (updated.count === 0) return { message: "This service no longer exists." };

  revalidate();
  redirect("/admin/services?saved=1");
}
