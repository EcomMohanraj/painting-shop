"use client";

import { useFormState } from "react-dom";
import { serviceCategories, serviceIcons } from "@/lib/admin-options";
import { SubmitButton } from "./FormControls";
import { Checkbox, Field, FormError, type FormState } from "./ui";

export type ServiceFormValues = {
  title: string;
  category: string;
  summary: string;
  description: string | null;
  features: string[];
  icon: string;
  published: boolean;
  sortOrder: number;
};

export function ServiceForm({
  action,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: ServiceFormValues;
}) {
  const [state, formAction] = useFormState(action, undefined);
  const err = (name: string) => state?.errors?.[name];

  return (
    <form action={formAction} className="space-y-6">
      <FormError state={state} />
      <section className="grid gap-5 rounded-2xl border border-navy-50 bg-white p-6 shadow-card sm:grid-cols-2">
        <Field label="Title" name="title" errors={err("title")} required>
          <input id="title" name="title" className="field" defaultValue={initial?.title} required maxLength={100} />
        </Field>
        <Field label="Category" name="category" errors={err("category")} required>
          <select id="category" name="category" className="field" defaultValue={initial?.category ?? ""} required>
            <option value="" disabled>
              Select a category
            </option>
            {serviceCategories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Summary" name="summary" errors={err("summary")} hint="One or two sentences shown on service cards." required className="sm:col-span-2">
          <textarea id="summary" name="summary" rows={2} className="field resize-y" defaultValue={initial?.summary} required maxLength={300} />
        </Field>
        <Field label="Description" name="description" errors={err("description")} className="sm:col-span-2">
          <textarea id="description" name="description" rows={4} className="field resize-y" defaultValue={initial?.description ?? ""} maxLength={5000} />
        </Field>
        <Field label="Features" name="features" errors={err("features")} hint="One per line, e.g. “Crack filling & primer”." className="sm:col-span-2">
          <textarea id="features" name="features" rows={4} className="field resize-y" defaultValue={initial?.features.join("\n")} />
        </Field>
        <Field label="Icon" name="icon" errors={err("icon")} required>
          <select id="icon" name="icon" className="field" defaultValue={initial?.icon ?? "paint"}>
            {serviceIcons.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Sort order" name="sortOrder" errors={err("sortOrder")} hint="Lower numbers show first.">
          <input id="sortOrder" name="sortOrder" type="number" min={0} max={9999} className="field" defaultValue={initial?.sortOrder ?? 0} />
        </Field>
        <div className="sm:col-span-2">
          <Checkbox name="published" label="Published (visible on website)" defaultChecked={initial?.published ?? true} />
        </div>
      </section>
      <SubmitButton label="Save service" />
    </form>
  );
}
