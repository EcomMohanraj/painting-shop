"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { EnquiryStatus } from "@/generated/prisma/enums";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

// Server actions are callable endpoints, so every one checks the session itself.

const statusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(EnquiryStatus),
});

export async function updateEnquiryStatus(formData: FormData) {
  await requireAdmin();
  const parsed = statusSchema.safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) return;
  await db.enquiry.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status } });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}
