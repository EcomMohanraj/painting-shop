"use client";

import { useFormStatus } from "react-dom";

const options = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "CLOSED", label: "Closed" },
];

function Select({ defaultValue, label }: { defaultValue: string; label: string }) {
  const { pending } = useFormStatus();
  return (
    <select
      name="status"
      defaultValue={defaultValue}
      disabled={pending}
      aria-label={label}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className="rounded-full border border-navy-100 bg-white px-3 py-1.5 text-sm font-medium text-navy-900 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200 disabled:opacity-60"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Changing the status saves immediately. */
export function StatusSelect({
  id,
  status,
  name,
  action,
}: {
  id: string;
  status: string;
  name: string;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <Select defaultValue={status} label={`Status for enquiry from ${name}`} />
    </form>
  );
}
