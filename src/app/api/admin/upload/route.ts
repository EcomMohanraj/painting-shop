import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UploadError, cloudinaryConfigured, saveImageLocally } from "@/lib/storage";

// Local-disk upload, used only when Cloudinary isn't configured (e.g. local
// development). With Cloudinary, the browser uploads directly — see ./sign.
export async function POST(request: Request) {
  if (!(await getServerSession(authOptions))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (cloudinaryConfigured()) {
    return NextResponse.json({ error: "Uploads go directly to Cloudinary." }, { status: 400 });
  }

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  try {
    return NextResponse.json({ url: await saveImageLocally(file) });
  } catch (err) {
    if (err instanceof UploadError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("[upload] Failed:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
