"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Check, Loader2, Send } from "lucide-react";
import { enquiryToText, validateEnquiry, type Enquiry as FormValues, type EnquiryErrors as Errors } from "@/lib/enquiry";
import { whatsappLink } from "@/lib/site";
import { DURATION, SPRING, ease } from "@/lib/motion";

type EmailStatus = "idle" | "sending" | "sent" | "failed";
type FieldName = keyof FormValues;

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
 * Fields validate when you leave them, then live as you correct them.
 */
export function QuoteForm({ serviceNames }: { serviceNames: string[] }) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  // Honeypot field — hidden from people, often filled in by spam bots.
  const [company, setCompany] = useState("");

  const update = (field: FieldName) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...values, [field]: e.target.value };
    setValues(next);
    // Once a field has been visited, re-check it live so it turns valid as you fix it.
    if (touched[field] || errors[field]) setErrors((prev) => ({ ...prev, [field]: validateEnquiry(next)[field] }));
  };

  const blur = (field: FieldName) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateEnquiry(values)[field] }));
  };

  /** "valid" once visited, filled in and error-free — shown with a gold border and tick. */
  const stateOf = (field: FieldName): FieldState =>
    errors[field] ? "error" : touched[field] && values[field].trim() && !validateEnquiry(values)[field] ? "valid" : "idle";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailStatus === "sending") return;

    const found = validateEnquiry(values);
    setErrors(found);
    setTouched({ name: true, phone: true, email: true, location: true, service: true, message: true });
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

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitted(false);
    setEmailStatus("idle");
  };

  const field = (name: FieldName) => ({
    id: `quote-${name}`,
    value: values[name],
    onChange: update(name),
    onBlur: blur(name),
    error: errors[name],
    state: stateOf(name),
  });

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-hero ring-1 ring-navy-50 sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {submitted ? (
          <Success key="success" name={values.name} emailStatus={emailStatus} onReset={reset} />
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={ease(DURATION.fast)}
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Request your free quote</h2>
            <p className="mt-2 text-charcoal-600">
              Takes under a minute. Fields marked <span className="text-gold-600">*</span> are required.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <FloatingField label="Full name" required {...field("name")} autoComplete="name" />
              <FloatingField label="Phone number" required {...field("phone")} type="tel" autoComplete="tel" inputMode="tel" />
              <FloatingField label="Email" {...field("email")} type="email" autoComplete="email" />
              <FloatingField label="Location / Area" {...field("location")} autoComplete="address-level2" />

              <fieldset className="sm:col-span-2">
                <legend className="mb-2 text-sm font-medium text-navy-900">Property type</legend>
                <div className="grid grid-cols-2 gap-3">
                  {(["Residential", "Commercial"] as const).map((type, i) => {
                    const checked = values.propertyType === type;
                    return (
                      <label
                        key={type}
                        className={`relative flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-3.5 text-sm font-semibold transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-400 ${
                          checked ? "border-navy-900 bg-navy-900 text-white" : "border-navy-100 text-navy-900 hover:border-navy-300"
                        }`}
                      >
                        <input
                          id={i === 0 ? "quote-propertyType" : undefined}
                          type="radio"
                          name="propertyType"
                          value={type}
                          checked={checked}
                          onChange={update("propertyType")}
                          className="sr-only"
                        />
                        {type}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <FloatingField label="Service required" required select {...field("service")} className="sm:col-span-2">
                {(props) => (
                  <select {...props}>
                    <option value="" disabled hidden />
                    {serviceNames.map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                    <option>Other / Not sure</option>
                  </select>
                )}
              </FloatingField>

              <FloatingField
                label="Project details"
                {...field("message")}
                hint="Rooms, approximate area, preferred dates…"
                className="sm:col-span-2"
              >
                {(props) => <textarea {...props} rows={4} className={`${props.className} resize-y`} />}
              </FloatingField>
            </div>

            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="quote-company">Company</label>
              <input id="quote-company" type="text" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>

            <button type="submit" className="btn-primary btn-lg group mt-8 w-full shadow-lift sm:w-auto">
              <Send className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              Request Free Quote
            </button>
            <p className="mt-4 text-sm text-charcoal-500">We usually respond within a few hours during business hours.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Floating-label field ───────────────────────────────────────────────────

type FieldState = "idle" | "valid" | "error";

type ControlProps = {
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur: () => void;
  placeholder: string;
  className: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
};

const controlBase =
  "peer block w-full rounded-xl border-2 bg-white px-4 pb-2.5 pt-6 text-base text-navy-900 transition-[border-color,box-shadow] duration-300 ease-brand focus:outline-none focus:ring-4";
const controlState: Record<FieldState, string> = {
  idle: "border-navy-100 hover:border-navy-200 focus:border-navy-900 focus:ring-navy-900/10",
  valid: "border-gold-400 pr-11 focus:border-navy-900 focus:ring-navy-900/10",
  error: "border-red-500 pr-11 focus:border-red-600 focus:ring-red-500/15",
};

function FloatingField({
  label,
  id,
  value,
  onChange,
  onBlur,
  error,
  state,
  required,
  hint,
  className = "",
  type = "text",
  autoComplete,
  inputMode,
  select = false,
  children,
}: {
  label: string;
  id: string;
  value: string;
  onChange: ControlProps["onChange"];
  onBlur: () => void;
  error?: string;
  state: FieldState;
  required?: boolean;
  hint?: string;
  className?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "tel" | "email" | "text";
  /** Render a <select> (via children); moves the status icon clear of the arrow. */
  select?: boolean;
  children?: (props: ControlProps) => ReactNode;
}) {
  const reduce = useReducedMotion();
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;
  const props: ControlProps = {
    id,
    value,
    onChange,
    onBlur,
    // A blank placeholder lets CSS know when the field is empty (:placeholder-shown).
    placeholder: " ",
    className: `${controlBase} ${controlState[state]}`,
    "aria-invalid": state === "error",
    "aria-describedby": describedBy,
    "aria-required": required || undefined,
  };
  // Selects never match :placeholder-shown, so their label is always floated.

  return (
    <div className={className}>
      <div className="relative">
        {children ? children(props) : <input {...props} type={type} autoComplete={autoComplete} inputMode={inputMode} />}
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 top-4 origin-left text-base text-charcoal-500 transition-transform duration-300 ease-brand peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-navy-900 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75`}
        >
          {label}
          {required && <span className="text-gold-600"> *</span>}
        </label>
        <AnimatePresence>
          {state !== "idle" && (
            <motion.span
              key={state}
              aria-hidden
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={reduce ? ease(DURATION.fast) : SPRING}
              className={`pointer-events-none absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full ${
                state === "valid" ? "bg-gold-400 text-navy-950" : "text-red-600"
              } ${select ? "right-10" : ""}`}
            >
              {state === "valid" ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <AlertCircle className="h-5 w-5" />}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={ease(DURATION.fast)}
            className="mt-1.5 text-sm font-medium text-red-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-charcoal-500">
          {hint}
        </p>
      )}
    </div>
  );
}

// ─── Success state ──────────────────────────────────────────────────────────

const splash = ["#f8b820", "#C97C5D", "#4A7A96", "#B5C4A7", "#2c4a7c", "#E8B4B8", "#2F7F7A", "#ffcd4a"];

function Success({ name, emailStatus, onReset }: { name: string; emailStatus: EmailStatus; onReset: () => void }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={ease(DURATION.fast)}
      className="flex flex-col items-center py-6 text-center"
      role="status"
    >
      <div className="relative grid h-28 w-28 place-items-center">
        {/* Paint splash bursting out from the tick. */}
        {!reduce &&
          splash.map((color, i) => {
            const angle = (i / splash.length) * Math.PI * 2;
            return (
              <motion.span
                key={color}
                aria-hidden
                className="absolute h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{ x: Math.cos(angle) * 68, y: Math.sin(angle) * 68, scale: [0, 1.3, 0.9], opacity: [1, 1, 0] }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              />
            );
          })}
        <svg viewBox="0 0 64 64" className="h-28 w-28" aria-hidden>
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            fill="#f8b820"
            initial={reduce ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={reduce ? undefined : { type: "spring", stiffness: 260, damping: 16 }}
            style={{ originX: "50%", originY: "50%" }}
          />
          <motion.path
            d="M20 33 l8 8 l16 -18"
            fill="none"
            stroke="#0a1426"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={ease(0.4, 0.25)}
          />
        </svg>
      </div>

      <motion.h3
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ease(DURATION.base, 0.35)}
        className="mt-6 text-display-md font-extrabold"
      >
        Thank you, {name.split(" ")[0]}!
      </motion.h3>
      <p className="mt-3 max-w-sm text-lg text-charcoal-600">
        {emailStatus === "failed"
          ? "Your enquiry is ready in WhatsApp — please press send there so it reaches us."
          : "We've received your enquiry and our team will get back to you shortly. It's also ready in WhatsApp if you'd like to message us directly."}
      </p>
      {emailStatus === "sending" && (
        <p className="mt-3 flex items-center gap-2 text-sm text-charcoal-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Sending your enquiry…
        </p>
      )}
      <button type="button" className="btn-outline btn-lg mt-8" onClick={onReset}>
        Send another enquiry
      </button>
    </motion.div>
  );
}
