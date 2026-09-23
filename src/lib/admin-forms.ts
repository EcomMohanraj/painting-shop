import { z } from "zod";
import { slugify } from "./slug";
import { isOwnCloudinaryUrl } from "./storage";

// Helpers shared by the admin server actions.

/**
 * Image URLs we accept: our Cloudinary folder, our /uploads/ folder, a static
 * /images/ file, or an Unsplash photo (used by the placeholder seed data).
 */
export const imageUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) =>
      isOwnCloudinaryUrl(v) ||
      /^https:\/\/images\.unsplash\.com\/photo-[\w-]+(\?[\w=&.%-]*)?$/.test(v) ||
      (/^\/(uploads|images)\/[\w\-./]+$/.test(v) && !v.includes("..")),
    "Invalid image URL.",
  );

/** "" -> null, otherwise a trimmed string up to `max` chars. */
export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer.`)
    .transform((v) => v || null);

export const requiredText = (label: string, max: number) =>
  z.string().trim().min(1, `${label} is required.`).max(max, `Must be ${max} characters or fewer.`);

export const sortOrder = z.coerce.number().int().min(0).max(9999).catch(0);

export const checkbox = (formData: FormData, name: string) => formData.get(name) === "on";

/** Reads a text field, treating a missing field as "". */
export const text = (formData: FormData, name: string) => {
  const v = formData.get(name);
  return typeof v === "string" ? v : "";
};

export const fieldErrors = (error: z.ZodError) => z.flattenError(error).fieldErrors as Record<string, string[]>;

/** Slug from `source`, suffixed -2, -3… until `exists` says it's free. */
export async function uniqueSlug(source: string, exists: (slug: string) => Promise<boolean>) {
  const base = slugify(source) || "item";
  let slug = base;
  for (let n = 2; await exists(slug); n++) slug = `${base}-${n}`;
  return slug;
}
