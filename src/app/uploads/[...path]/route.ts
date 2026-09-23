import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR, contentTypeByExt } from "@/lib/storage";

// Serves images saved to ./uploads when Cloudinary isn't configured.
// (Files added to /public after `next build` aren't served in production.)
export async function GET(_req: Request, { params }: { params: { path: string[] } }) {
  const target = path.resolve(UPLOAD_DIR, ...params.path);
  const ext = path.extname(target).slice(1).toLowerCase();
  const contentType = contentTypeByExt[ext];

  if (!target.startsWith(UPLOAD_DIR + path.sep) || !contentType) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const data = await readFile(target);
    return new Response(data, {
      headers: {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        // File names are random UUIDs and never reused, so they can be cached forever.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
