"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ProjectType } from "@/generated/prisma/enums";
import type { FormState } from "@/components/admin/ui";
import { checkbox, fieldErrors, imageUrl, optionalText, requiredText, sortOrder, text, uniqueSlug } from "@/lib/admin-forms";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteImages } from "@/lib/storage";

const projectSchema = z.object({
  name: requiredText("Project name", 120),
  location: requiredText("Location", 120),
  type: z.enum(ProjectType, "Choose a project type."),
  serviceId: z.string().transform((v) => v || null),
  description: optionalText(5000),
  completedAt: z
    .string()
    .transform((v) => (v ? new Date(v) : null))
    .refine((d) => d === null || !Number.isNaN(d.getTime()), "Invalid date."),
  beforeImage: z.union([z.literal("").transform(() => null), imageUrl]),
  afterImage: z.union([z.literal("").transform(() => null), imageUrl]),
  photos: z.array(imageUrl).max(30, "Up to 30 photos per project."),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder,
});

function parse(formData: FormData) {
  return projectSchema.safeParse({
    name: text(formData, "name"),
    location: text(formData, "location"),
    type: text(formData, "type"),
    serviceId: text(formData, "serviceId"),
    description: text(formData, "description"),
    completedAt: text(formData, "completedAt"),
    beforeImage: text(formData, "beforeImage"),
    afterImage: text(formData, "afterImage"),
    photos: formData.getAll("photos").filter((p): p is string => typeof p === "string" && p !== ""),
    featured: checkbox(formData, "featured"),
    published: checkbox(formData, "published"),
    sortOrder: text(formData, "sortOrder"),
  });
}

function revalidate() {
  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function createProject(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };

  const { photos, ...data } = parsed.data;
  const slug = await uniqueSlug(data.name, async (s) => Boolean(await db.project.findUnique({ where: { slug: s } })));
  await db.project.create({
    data: { ...data, slug, photos: { create: photos.map((url, i) => ({ url, sortOrder: i })) } },
  });

  revalidate();
  redirect("/admin/projects?saved=1");
}

export async function updateProject(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };

  const existing = await db.project.findUnique({ where: { id }, include: { photos: true } });
  if (!existing) return { message: "This project no longer exists." };

  const { photos, ...data } = parsed.data;
  await db.$transaction([
    db.project.update({ where: { id }, data }),
    db.projectPhoto.deleteMany({ where: { projectId: id } }),
    db.projectPhoto.createMany({ data: photos.map((url, i) => ({ projectId: id, url, sortOrder: i })) }),
  ]);

  // Remove files that are no longer used by this project.
  const kept = new Set([data.beforeImage, data.afterImage, ...photos]);
  const old = [existing.beforeImage, existing.afterImage, ...existing.photos.map((p) => p.url)];
  await deleteImages(old.filter((u) => u && !kept.has(u)));

  revalidate();
  redirect("/admin/projects?saved=1");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const project = await db.project.findUnique({ where: { id }, include: { photos: true } });
  if (project) {
    await db.project.delete({ where: { id } });
    await deleteImages([project.beforeImage, project.afterImage, ...project.photos.map((p) => p.url)]);
  }
  revalidate();
  redirect("/admin/projects?deleted=1");
}
