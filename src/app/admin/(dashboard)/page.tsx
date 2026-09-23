import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FolderKanban, Inbox, MessageSquareQuote, Wrench } from "lucide-react";
import { Badge, Card, DatabaseNotice } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = { title: "Dashboard" };

const dateFormat = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });

export default async function AdminDashboardPage() {
  const session = await requireAdmin();

  return (
    <>
      <h1 className="text-2xl font-bold sm:text-3xl">Welcome back</h1>
      <p className="mt-1 text-charcoal-600">Signed in as {session.user?.email}</p>
      <div className="mt-8">{isDatabaseConfigured ? <Overview /> : <DatabaseNotice />}</div>
    </>
  );
}

async function Overview() {
  const [newEnquiries, projects, services, testimonials, recent] = await Promise.all([
    db.enquiry.count({ where: { status: "NEW" } }),
    db.project.count(),
    db.service.count(),
    db.testimonial.count(),
    db.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const tiles = [
    { href: "/admin/enquiries?status=NEW", icon: Inbox, label: "New enquiries", value: newEnquiries, highlight: newEnquiries > 0 },
    { href: "/admin/projects", icon: FolderKanban, label: "Projects", value: projects },
    { href: "/admin/services", icon: Wrench, label: "Services", value: services },
    { href: "/admin/testimonials", icon: MessageSquareQuote, label: "Testimonials", value: testimonials },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map(({ href, icon: Icon, label, value, highlight }) => (
          <Link key={href} href={href} className="group">
            <Card className={`h-full p-5 transition-colors group-hover:border-gold-200 ${highlight ? "border-gold-300 bg-gold-50" : ""}`}>
              <Icon className="h-5 w-5 text-gold-600" aria-hidden />
              <p className="mt-3 font-display text-3xl font-extrabold text-navy-900">{value}</p>
              <p className="text-sm text-charcoal-600">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Latest enquiries</h2>
        <Link href="/admin/enquiries" className="inline-flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-navy-900">
          View all <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <Card className="mt-3 divide-y divide-navy-50">
        {recent.length === 0 ? (
          <p className="p-6 text-sm text-charcoal-600">No enquiries yet.</p>
        ) : (
          recent.map((e) => (
            <div key={e.id} className="flex flex-wrap items-center justify-between gap-2 p-4 sm:px-6">
              <div className="min-w-0">
                <p className="font-medium text-navy-900">{e.name}</p>
                <p className="text-sm text-charcoal-500">
                  {e.service} · {e.phone}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-charcoal-500">{dateFormat.format(e.createdAt)}</span>
                <Badge tone={e.status === "NEW" ? "gold" : e.status === "CLOSED" ? "neutral" : "green"}>
                  {e.status === "NEW" ? "New" : e.status === "CONTACTED" ? "Contacted" : "Closed"}
                </Badge>
              </div>
            </div>
          ))
        )}
      </Card>
    </>
  );
}
