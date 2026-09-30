"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "./FormControls";
import { ImageUpload } from "./ImageUpload";
import { Checkbox, Field, FormError, type FormState } from "./ui";

export type TestimonialFormValues = {
  name: string;
  location: string | null;
  project: string | null;
  rating: number;
  quote: string;
  photo?: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export function TestimonialForm({
  action,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: TestimonialFormValues;
}) {
  const [state, formAction] = useFormState(action, undefined);
  const err = (name: string) => state?.errors?.[name];

  return (
    <form action={formAction} className="space-y-6">
      <FormError state={state} />
      <section className="grid gap-5 rounded-2xl border border-navy-50 bg-white p-6 shadow-card sm:grid-cols-2">
        <Field label="Customer name" name="name" errors={err("name")} required>
          <input id="name" name="name" className="field" defaultValue={initial?.name} required maxLength={100} />
        </Field>
        <Field label="Location" name="location" errors={err("location")}>
          <input id="location" name="location" className="field" defaultValue={initial?.location ?? ""} maxLength={100} placeholder="e.g. Dindigul" />
        </Field>
        <Field label="Project" name="project" errors={err("project")} hint="e.g. “3BHK Interior Painting”">
          <input id="project" name="project" className="field" defaultValue={initial?.project ?? ""} maxLength={120} />
        </Field>
        <Field label="Rating" name="rating" errors={err("rating")} required>
          <select id="rating" name="rating" className="field" defaultValue={initial?.rating ?? 5}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)} ({n})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Review" name="quote" errors={err("quote")} required className="sm:col-span-2">
          <textarea id="quote" name="quote" rows={5} className="field resize-y" defaultValue={initial?.quote} required maxLength={2000} />
        </Field>
        <Field label="Sort order" name="sortOrder" errors={err("sortOrder")} hint="Lower numbers show first.">
          <input id="sortOrder" name="sortOrder" type="number" min={0} max={9999} className="field" defaultValue={initial?.sortOrder ?? 0} />
        </Field>
        <div className="flex flex-wrap items-end gap-6">
          <Checkbox name="published" label="Published" defaultChecked={initial?.published ?? true} />
          <Checkbox name="featured" label="Featured on home page" defaultChecked={initial?.featured ?? false} />
        </div>
      </section>

      <section className="rounded-2xl border border-navy-50 bg-white p-6 shadow-card">
        <h2 className="font-semibold">Photo</h2>
        <p className="mt-1 text-sm text-charcoal-600">Shown as a round avatar beside the review. Without one, the customer&apos;s initial is shown.</p>
        <div className="mt-4">
          <ImageUpload name="photo" label="Customer photo (optional)" defaultValue={initial?.photo} />
        </div>
        {err("photo") && <p className="mt-2 text-xs font-medium text-red-600">{err("photo")?.join(" ")}</p>}
      </section>

      <SubmitButton label="Save testimonial" />
    </form>
  );
}
