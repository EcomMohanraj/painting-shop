"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { enquiryToText, validateEnquiry, type Enquiry as FormValues, type EnquiryErrors as Errors } from "@/lib/enquiry";
import { whatsappLink } from "@/lib/site";

type EmailStatus = "idle" | "sending" | "sent" | "failed";

const initialValues: FormValues = {
  name: "",
  phone: "",
  email: "",
  location: "",
  propertyType: "Residential",
  service: "",
  message: "",
};

/**
 * Quote enquiry form. A valid submission does two things:
 *  1. Opens WhatsApp with the enquiry pre-filled (must happen synchronously in
 *     the click handler, or browsers treat it as a blocked pop-up).
 *  2. Emails the enquiry to the business via /api/enquiry (Resend) in the background.
 */
export function QuoteForm({ serviceNames }: { serviceNames: string[] }) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  // Honeypot field — hidden from people, often filled in by spam bots.
  const [company, setCompany] = useState("");

  const update = (field: keyof FormValues) => (e: { target: { value: string } }) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailStatus === "sending") return;

    const found = validateEnquiry(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.getElementById(`quote-${first}`)?.focus();
      return;
    }

    window.open(whatsappLink(enquiryToText(values)), "_blank", "noopener,noreferrer");
    setSubmitted(true);
    setEmailStatus("sending");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company }),
      });
      setEmailStatus(res.ok ? "sent" : "failed");
    } catch {
      setEmailStatus("failed");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center rounded-2xl border border-navy-50 bg-white p-10 text-center shadow-card"
          role="status"
        >
          <CheckCircle2 className="h-14 w-14 text-gold-500" aria-hidden />
          <h3 className="mt-4 text-2xl font-bold">Thank you, {values.name.split(" ")[0]}!</h3>
          <p className="mt-2 max-w-sm text-charcoal-600">
            {emailStatus === "failed"
              ? "Your enquiry is ready in WhatsApp — please press send there so it reaches us."
              : "We've received your enquiry and our team will get back to you shortly. It's also ready in WhatsApp if you'd like to message us directly."}
          </p>
          {emailStatus === "sending" && (
            <p className="mt-3 flex items-center gap-2 text-xs text-charcoal-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              Sending your enquiry…
            </p>
          )}
          <button
            type="button"
            className="btn-outline mt-6"
            onClick={() => {
              setValues(initialValues);
              setSubmitted(false);
              setEmailStatus("idle");
            }}
          >
            Send another enquiry
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={handleSubmit}
          exit={{ opacity: 0, y: -12 }}
          className="rounded-2xl border border-navy-50 bg-white p-6 shadow-card sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" id="name" error={errors.name} required>
              <input id="quote-name" type="text" autoComplete="name" className="field" value={values.name} onChange={update("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "quote-name-error" : undefined} />
            </Field>
            <Field label="Phone number" id="phone" error={errors.phone} required>
              <input id="quote-phone" type="tel" autoComplete="tel" inputMode="tel" className="field" value={values.phone} onChange={update("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "quote-phone-error" : undefined} />
            </Field>
            <Field label="Email" id="email" error={errors.email}>
              <input id="quote-email" type="email" autoComplete="email" className="field" value={values.email} onChange={update("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "quote-email-error" : undefined} />
            </Field>
            <Field label="Location / Area" id="location">
              <input id="quote-location" type="text" autoComplete="address-level2" className="field" value={values.location} onChange={update("location")} />
            </Field>
            <Field label="Property type" id="propertyType">
              <select id="quote-propertyType" className="field" value={values.propertyType} onChange={update("propertyType")}>
                <option>Residential</option>
                <option>Commercial</option>
              </select>
            </Field>
            <Field label="Service required" id="service" error={errors.service} required>
              <select id="quote-service" className="field" value={values.service} onChange={update("service")} aria-invalid={!!errors.service} aria-describedby={errors.service ? "quote-service-error" : undefined}>
                <option value="">Select a service</option>
                {serviceNames.map((name) => (
                  <option key={name}>{name}</option>
                ))}
                <option>Other / Not sure</option>
              </select>
            </Field>
            <Field label="Project details" id="message" className="sm:col-span-2">
              <textarea id="quote-message" rows={4} className="field resize-y" placeholder="Rooms, approximate area, preferred dates…" value={values.message} onChange={update("message")} />
            </Field>
          </div>
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="quote-company">Company</label>
            <input id="quote-company" type="text" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
            <Send className="h-4 w-4" aria-hidden />
            Request Free Quote
          </button>
          <p className="mt-3 text-xs text-charcoal-500">We usually respond within a few hours during business hours.</p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  id,
  error,
  required,
  className = "",
  children,
}: {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={`quote-${id}`} className="mb-1.5 block text-sm font-medium text-navy-900">
        {label}
        {required && <span className="text-gold-600"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`quote-${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
