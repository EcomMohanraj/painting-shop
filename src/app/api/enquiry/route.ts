import { NextResponse } from "next/server";
import { Resend } from "resend";
import { enquiryFields, enquiryToText, validateEnquiry, type Enquiry } from "@/lib/enquiry";
import { site } from "@/lib/site";

// Emails each quote enquiry to the business via Resend.
// Required env vars (see .env.example): RESEND_API_KEY, ENQUIRY_TO_EMAIL.
// Optional: ENQUIRY_FROM_EMAIL — defaults to Resend's shared test sender, which
// can only deliver to the email address the Resend account was created with.

const DEFAULT_FROM = `${site.name} Website <onboarding@resend.dev>`;

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[enquiry] RESEND_API_KEY or ENQUIRY_TO_EMAIL is not set — email not sent.");
    return NextResponse.json({ ok: false, error: "Email is not configured." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill the "company" field; bots often do.
  // Pretend success so the bot doesn't retry.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const enquiry = Object.fromEntries(
    enquiryFields.map((f) => [f, typeof body[f] === "string" ? (body[f] as string).trim() : ""]),
  ) as Enquiry;

  const errors = validateEnquiry(enquiry);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.ENQUIRY_FROM_EMAIL || DEFAULT_FROM,
    to: to.split(",").map((s) => s.trim()),
    replyTo: enquiry.email || undefined,
    subject: `New quote enquiry: ${enquiry.service} — ${enquiry.name}`,
    text: enquiryToText(enquiry),
    html: renderHtml(enquiry),
  });

  if (error) {
    console.error("[enquiry] Resend error:", error);
    return NextResponse.json({ ok: false, error: "Could not send email." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function renderHtml(e: Enquiry) {
  const rows: [string, string][] = [
    ["Name", e.name],
    ["Phone", e.phone],
    ["Email", e.email || "—"],
    ["Location", e.location || "—"],
    ["Property type", e.propertyType],
    ["Service", e.service],
    ["Project details", e.message || "—"],
  ];
  const phoneDigits = e.phone.replace(/[^\d+]/g, "");

  return `
<div style="font-family:Arial,sans-serif;max-width:560px;color:#262a31">
  <h2 style="color:#0f1d35;margin:0 0 4px">New quote enquiry</h2>
  <p style="margin:0 0 16px;color:#5b6270">Submitted via the ${escapeHtml(site.name)} website contact form.</p>
  <table cellpadding="8" style="border-collapse:collapse;width:100%">
    ${rows
      .map(
        ([label, value]) => `<tr>
      <td style="border-bottom:1px solid #dfe6f1;font-weight:bold;width:140px;vertical-align:top;color:#0f1d35">${label}</td>
      <td style="border-bottom:1px solid #dfe6f1;white-space:pre-wrap">${escapeHtml(value)}</td>
    </tr>`,
      )
      .join("")}
  </table>
  <p style="margin-top:20px">
    <a href="tel:${escapeHtml(phoneDigits)}" style="background:#f8b820;color:#0a1426;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Call ${escapeHtml(e.name)}</a>
  </p>
</div>`;
}
