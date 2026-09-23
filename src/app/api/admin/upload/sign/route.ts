import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cloudinaryConfigured, cloudinaryUploadParams } from "@/lib/storage";

// Tells the admin image picker how to upload. With Cloudinary configured it
// returns signed parameters for a direct browser -> Cloudinary upload (valid for
// one hour); otherwise the picker falls back to POST /api/admin/upload.
export async function POST() {
  if (!(await getServerSession(authOptions))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!cloudinaryConfigured()) {
    return NextResponse.json({ provider: "local" });
  }
  return NextResponse.json({ provider: "cloudinary", params: cloudinaryUploadParams() });
}
