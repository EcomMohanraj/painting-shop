"use client";

import { useFormState } from "react-dom";
import { Checkbox, Field, FormError, type FormState } from "./ui";
import { SubmitButton } from "./FormControls";
import { ImageUpload, PhotosUpload } from "./ImageUpload";
import { projectTypes } from "@/lib/admin-options";

export type ProjectFormValues = {
  name: string;
  location: string;
  type: string;
  serviceId: string | null;
  description: string | null;
  completedAt: string | null; // yyyy-mm-dd
  beforeImage: string | null;
  afterImage: string | null;
  photos: string[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export function ProjectForm({
  action,
  services,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  services: { id: string; title: string }[];
  initial?: ProjectFormValues;
}) {
  const [state, formAction] = useFormState(action, undefined);
  const err = (name: string) => state?.errors?.[name];

  return (
    <form action={formAction} className="space-y-8">
      <FormError state={state} />

      <section className="grid gap-5 rounded-2xl border border-navy-50 bg-white p-6 shadow-card sm:grid-cols-2">
        <Field label="Project name" name="name" errors={err("name")} required>
          <input id="name" name="name" className="field" defaultValue={initial?.name} required maxLength={120} />
        </Field>
        <Field label="Location" name="location" errors={err("location")} required>
          <input id="location" name="location" className="field" defaultValue={initial?.location} required maxLength={120} placeholder="e.g. Dindigul" />
        </Field>
        <Field label="Type" name="type" errors={err("type")} required>
          <select id="type" name="type" className="field" defaultValue={initial?.type ?? ""} required>
            <option value="" disabled>
              Select a type
            </option>
            {projectTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Related service" name="serviceId" errors={err("serviceId")}>
          <select id="serviceId" name="serviceId" className="field" defaultValue={initial?.serviceId ?? ""}>
            <option value="">None</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Description" name="description" errors={err("description")} className="sm:col-span-2">
          <textarea id="description" name="description" rows={4} className="field resize-y" defaultValue={initial?.description ?? ""} maxLength={5000} />
        </Field>
        <Field label="Completed on" name="completedAt" errors={err("completedAt")}>
          <input id="completedAt" name="completedAt" type="date" className="field" defaultValue={initial?.completedAt ?? ""} />
        </Field>
        <Field label="Sort order" name="sortOrder" errors={err("sortOrder")} hint="Lower numbers show first.">
          <input id="sortOrder" name="sortOrder" type="number" min={0} max={9999} className="field" defaultValue={initial?.sortOrder ?? 0} />
        </Field>
        <div className="flex flex-wrap gap-6 sm:col-span-2">
          <Checkbox name="published" label="Published (visible on website)" defaultChecked={initial?.published ?? true} />
          <Checkbox name="featured" label="Featured on home page" defaultChecked={initial?.featured ?? false} />
        </div>
      </section>

      <section className="rounded-2xl border border-navy-50 bg-white p-6 shadow-card">
        <h2 className="font-semibold">Before & after</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <ImageUpload name="beforeImage" label="Before image" defaultValue={initial?.beforeImage} />
          <ImageUpload name="afterImage" label="After image" defaultValue={initial?.afterImage} />
        </div>
        {(err("beforeImage") || err("afterImage")) && (
          <p className="mt-2 text-xs font-medium text-red-600">{[...(err("beforeImage") ?? []), ...(err("afterImage") ?? [])].join(" ")}</p>
        )}
        <div className="mt-8">
          <PhotosUpload name="photos" defaultValue={initial?.photos} />
          {err("photos") && <p className="mt-2 text-xs font-medium text-red-600">{err("photos")?.join(" ")}</p>}
        </div>
      </section>

      <SubmitButton label="Save project" />
    </form>
  );
}
