import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { EnquiryStatus } from "@/generated/prisma/enums";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { Badge, Card, DatabaseNotice, EmptyState, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/lib/db";
import { updateEnquiryStatus } from "./actions";

export const metadata: Metadata = { title: "Enquiries" };

const filters = [
  { value: undefined, label: "All" },
  { value: EnquiryStatus.NEW, label: "New" },
  { value: EnquiryStatus.CONTACTED, label: "Contacted" },
  { value: EnquiryStatus.CLOSED, label: "Closed" },
];

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export default async function EnquiriesPage({ searchParams }: { searchParams: { status?: string } }) {
  await requireAdmin();
  if (!isDatabaseConfigured) return <DatabaseNotice />;

  const status = Object.values(EnquiryStatus).find((s) => s === searchParams.status);

  const [enquiries, counts] = await Promise.all([
    db.enquiry.findMany({ where: status ? { status } : undefined, orderBy: { createdAt: "desc" }, take: 200 }),
    db.enquiry.groupBy({ by: ["status"], _count: true }),
  ]);
  const countFor = (s?: EnquiryStatus) =>
    s ? counts.find((c) => c.status === s)?._count ?? 0 : counts.reduce((n, c) => n + c._count, 0);

  return (
    <>
      <PageHeader title="Enquiries" description="Quote requests from the website contact form." />

      <div role="tablist" aria-label="Filter by status" className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = f.value === status;
          return (
            <Link
              key={f.label}
              role="tab"
              aria-selected={active}
              href={f.value ? `/admin/enquiries?status=${f.value}` : "/admin/enquiries"}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                active ? "bg-navy-900 text-white" : "bg-white text-charcoal-600 hover:text-navy-900"
              }`}
            >
              {f.label} <span className="opacity-60">({countFor(f.value)})</span>
            </Link>
          );
        })}
      </div>

      {enquiries.length === 0 ? (
        <EmptyState>No enquiries {status ? "with this status " : ""}yet.</EmptyState>
      ) : (
        <ul className="space-y-4">
          {enquiries.map((e) => (
            <li key={e.id}>
              <Card className="p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">{e.name}</h2>
                      {e.status === EnquiryStatus.NEW && <Badge tone="gold">New</Badge>}
                    </div>
                    <p className="mt-0.5 text-xs text-charcoal-500">{dateFormat.format(e.createdAt)}</p>
                  </div>
                  <StatusSelect id={e.id} status={e.status} name={e.name} action={updateEnquiryStatus} />
                </div>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <a href={`tel:${e.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 font-medium text-navy-900 hover:text-gold-600">
                    <Phone className="h-4 w-4 text-gold-500" aria-hidden /> {e.phone}
                  </a>
                  {e.email && (
                    <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1.5 break-all text-navy-900 hover:text-gold-600">
                      <Mail className="h-4 w-4 text-gold-500" aria-hidden /> {e.email}
                    </a>
                  )}
                  {e.location && (
                    <span className="inline-flex items-center gap-1.5 text-charcoal-600">
                      <MapPin className="h-4 w-4 text-gold-500" aria-hidden /> {e.location}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>{e.service}</Badge>
                  <Badge>{e.propertyType === "COMMERCIAL" ? "Commercial" : "Residential"}</Badge>
                  {!e.emailSent && <Badge>Email not sent</Badge>}
                </div>

                {e.message && (
                  <p className="mt-4 whitespace-pre-wrap rounded-lg bg-navy-50/60 p-3 text-sm text-charcoal-700">{e.message}</p>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
