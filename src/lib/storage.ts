import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";

// Image storage for admin uploads.
//  - CLOUDINARY_* env vars set -> Cloudinary. The browser uploads straight to
//    Cloudinary using a signature from /api/admin/upload/sign (see cloudinaryUploadParams).
//  - otherwise                 -> ./uploads on the server's disk via /api/admin/upload,
//    served by /uploads/[...path]. Fine for local development or a VPS, but not
//    Vercel (its disk isn't persistent).

// ─── Cloudinary ─────────────────────────────────────────────────────────────

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

/** Everything we upload lives under this Cloudinary folder. */
export const CLOUDINARY_FOLDER = "krisha-paintings";

export const cloudinaryConfigured = () => Boolean(CLOUD_NAME && API_KEY && API_SECRET);

if (cloudinaryConfigured()) {
  cloudinary.config({ cloud_name: CLOUD_NAME, api_key: API_KEY, api_secret: API_SECRET, secure: true });
}

/**
 * Signed parameters for one direct browser upload. The browser posts these plus
 * the file to https://api.cloudinary.com/v1_1/<cloudName>/image/upload.
 * Because they're signed, the browser can't change the folder, formats or resizing.
 */
export function cloudinaryUploadParams(subfolder = "projects") {
  const params = {
    timestamp: Math.round(Date.now() / 1000),
    folder: `${CLOUDINARY_FOLDER}/${subfolder}`,
    allowed_formats: "jpg,jpeg,png,webp,avif,heic,heif",
    // Phone photos are often 4000px+ HEIC files: cap the size and store as JPEG
    // so every browser can show them and the free-tier storage lasts longer.
    transformation: "c_limit,w_2400,h_2400,q_auto:good",
    format: "jpg",
  };
  const signature = cloudinary.utils.api_sign_request(params, API_SECRET!);
  return { ...params, signature, api_key: API_KEY!, cloud_name: CLOUD_NAME! };
}

/** Is this a URL for an image in our own Cloudinary folder? */
export function isOwnCloudinaryUrl(url: string) {
  return cloudinaryPublicId(url) !== null;
}

/** https://res.cloudinary.com/<cloud>/image/upload/v123/krisha-paintings/projects/abc.jpg -> "krisha-paintings/projects/abc" */
export function cloudinaryPublicId(url: string): string | null {
  if (!CLOUD_NAME) return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const prefix = `/${CLOUD_NAME}/image/upload/`;
  if (u.protocol !== "https:" || u.hostname !== "res.cloudinary.com" || !u.pathname.startsWith(prefix)) return null;
  const publicId = u.pathname
    .slice(prefix.length)
    .replace(/^v\d+\//, "")
    .replace(/\.[a-z0-9]+$/i, "");
  return publicId.startsWith(`${CLOUDINARY_FOLDER}/`) ? decodeURIComponent(publicId) : null;
}

// ─── Local disk fallback ────────────────────────────────────────────────────

export const MAX_LOCAL_IMAGE_BYTES = 4 * 1024 * 1024;

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export const contentTypeByExt: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

// Identify images by their first bytes, not by the (spoofable) filename or MIME type.
function sniffImage(bytes: Uint8Array): string | null {
  const starts = (sig: number[], offset = 0) => sig.every((b, i) => bytes[offset + i] === b);
  if (starts([0xff, 0xd8, 0xff])) return "jpg";
  if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (starts([0x52, 0x49, 0x46, 0x46]) && starts([0x57, 0x45, 0x42, 0x50], 8)) return "webp";
  if (starts([0x66, 0x74, 0x79, 0x70], 4) && (starts([0x61, 0x76, 0x69, 0x66], 8) || starts([0x61, 0x76, 0x69, 0x73], 8)))
    return "avif";
  return null;
}

export class UploadError extends Error {}

/** Validates and saves an image to ./uploads. Returns its public URL. */
export async function saveImageLocally(file: File, folder = "projects"): Promise<string> {
  if (process.env.VERCEL) {
    throw new UploadError("Image storage isn't configured. Add the CLOUDINARY_* variables in Vercel.");
  }
  if (file.size === 0) throw new UploadError("The file is empty.");
  if (file.size > MAX_LOCAL_IMAGE_BYTES) throw new UploadError("Images must be 4 MB or smaller.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = sniffImage(bytes);
  if (!ext) throw new UploadError("Only JPEG, PNG, WebP or AVIF images are allowed.");

  const name = `${folder}/${randomUUID()}.${ext}`;
  const target = path.join(UPLOAD_DIR, name);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
  return `/uploads/${name}`;
}

// ─── Deleting ───────────────────────────────────────────────────────────────

/** Best-effort removal of an image we stored. Ignores URLs we don't own. */
export async function deleteImage(url: string | null | undefined): Promise<void> {
  if (!url) return;
  try {
    if (url.startsWith("/uploads/")) {
      const target = path.resolve(UPLOAD_DIR, url.slice("/uploads/".length));
      if (target.startsWith(UPLOAD_DIR + path.sep)) await unlink(target);
      return;
    }
    const publicId = cloudinaryPublicId(url);
    if (publicId && cloudinaryConfigured()) {
      const res = await cloudinary.uploader.destroy(publicId, { invalidate: true });
      if (res?.result !== "ok" && res?.result !== "not found") console.warn("[storage] Cloudinary destroy:", publicId, res);
    }
  } catch (err) {
    console.warn("[storage] Could not delete", url, err);
  }
}

export async function deleteImages(urls: (string | null | undefined)[]) {
  await Promise.all(urls.map(deleteImage));
}
