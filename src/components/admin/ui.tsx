import Link from "next/link";
import { ArrowLeft, CheckCircle2, DatabaseZap, Plus } from "lucide-react";
import type { ReactNode } from "react";

/** Returned by admin server actions to useFormState. */
export type FormState = { errors?: Record<string, string[] | undefined>; message?: string } | undefined;

export function PageHeader({
  title,
  description,
  backHref,
  newHref,
  newLabel,
}: {
  title: string;
  description?: string;
  backHref?: string;
  newHref?: string;
  newLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {backHref && (
          <Link href={backHref} className="mb-2 inline-flex items-center gap-1 text-sm text-charcoal-500 hover:text-navy-900">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back
          </Link>
        )}
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-charcoal-600">{description}</p>}
      </div>
      {newHref && (
        <Link href={newHref} className="btn-primary px-5 py-2.5">
          <Plus className="h-4 w-4" aria-hidden />
          {newLabel}
        </Link>
      )}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-navy-50 bg-white shadow-card ${className}`}>{children}</div>;
}

export function Field({
  label,
  name,
  errors,
  hint,
  required,
  className = "",
  children,
}: {
  label: string;
  name: string;
  errors?: string[];
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy-900">
        {label}
        {required && <span className="text-gold-600"> *</span>}
      </label>
      {children}
      {hint && !errors?.length && <p className="mt-1.5 text-xs text-charcoal-500">{hint}</p>}
      {errors?.map((e) => (
        <p key={e} className="mt-1.5 text-xs font-medium text-red-600">
          {e}
        </p>
      ))}
    </div>
  );
}

export function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-navy-900">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-navy-200 accent-navy-900"
      />
      {label}
    </label>
  );
}

export function FormError({ state }: { state: FormState }) {
  if (!state?.message) return null;
  return (
    <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {state.message}
    </p>
  );
}

export function SavedBanner({ show, text = "Saved." }: { show: boolean; text?: string }) {
  if (!show) return null;
  return (
    <p role="status" className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
      <CheckCircle2 className="h-4 w-4" aria-hidden />
      {text}
    </p>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <Card className="p-10 text-center text-charcoal-600">{children}</Card>;
}

export function DatabaseNotice() {
  return (
    <Card className="flex gap-4 p-6">
      <DatabaseZap className="h-6 w-6 shrink-0 text-gold-500" aria-hidden />
      <div>
        <h2 className="font-semibold">Database not connected</h2>
        <p className="mt-1 text-sm text-charcoal-600">
          Add <code className="rounded bg-navy-50 px-1">DATABASE_URL</code> and{" "}
          <code className="rounded bg-navy-50 px-1">DIRECT_URL</code> to <code className="rounded bg-navy-50 px-1">.env.local</code>,
          run <code className="rounded bg-navy-50 px-1">npm run db:migrate</code>, then restart the server.
        </p>
      </div>
    </Card>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "gold" | "green" | "navy" }) {
  const tones = {
    neutral: "bg-navy-50 text-charcoal-600",
    gold: "bg-gold-100 text-gold-600",
    green: "bg-green-50 text-green-700",
    navy: "bg-navy-900 text-white",
  };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
