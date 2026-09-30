"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/admin/ui";
import { siteImageSlots } from "@/lib/admin-options";
import { fieldErrors, imageUrl, text } from "@/lib/admin-forms";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteImages } from "@/lib/storage";

// One optional image per slot; the form field name is the slot key.
const siteImagesSchema = z.object(
  Object.fromEntries(siteImageSlots.map((s) => [s.key, z.union([z.literal("").transform(() => null), imageUrl])])),
);

function revalidate() {
  // Slots can appear on any public page, so refresh the whole site.
  revalidatePath("/", "layout");
}

export async function updateSiteImages(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = siteImagesSchema.safeParse(Object.fromEntries(siteImageSlots.map((s) => [s.key, text(formData, s.key)])));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };

  const keys = siteImageSlots.map((s) => s.key);
  const existing = await db.siteImage.findMany({ where: { key: { in: keys } } });
  const oldUrl = (key: string) => existing.find((r) => r.key === key)?.url ?? null;
  const data = parsed.data as Record<string, string | null>;

  await db.$transaction(
    keys.map((key) =>
      db.siteImage.upsert({ where: { key }, create: { key, url: data[key] }, update: { url: data[key] } }),
    ),
  );

  // Remove photos that were replaced or cleared.
  await deleteImages(keys.filter((key) => oldUrl(key) !== data[key]).map(oldUrl));

  revalidate();
  redirect("/admin/site-content?saved=1");
}
