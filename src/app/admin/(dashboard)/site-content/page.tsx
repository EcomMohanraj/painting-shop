import type { Metadata } from "next";
import { SiteContentForm } from "@/components/admin/SiteContentForm";
import { DatabaseNotice, PageHeader, SavedBanner } from "@/components/admin/ui";
import { siteImageSlots } from "@/lib/admin-options";
import { requireAdmin } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/lib/db";
import { updateSiteImages } from "./actions";

export const metadata: Metadata = { title: "Site Photos" };

export default async function SiteContentPage({ searchParams }: { searchParams: { saved?: string } }) {
  await requireAdmin();
  if (!isDatabaseConfigured) return <DatabaseNotice />;

  const rows = await db.siteImage.findMany({ where: { key: { in: siteImageSlots.map((s) => s.key) } } });
  const initial = Object.fromEntries(siteImageSlots.map((s) => [s.key, rows.find((r) => r.key === s.key)?.url ?? null]));

  return (
    <>
      <PageHeader title="Site Photos" description="Standalone photos used around the website. Leave a slot empty to show its placeholder." />
      <SavedBanner show={searchParams.saved === "1"} text="Photos saved." />
      <SiteContentForm action={updateSiteImages} initial={initial} />
    </>
  );
}
