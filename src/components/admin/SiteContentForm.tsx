"use client";

import { useFormState } from "react-dom";
import { siteImageSlots } from "@/lib/admin-options";
import { SubmitButton } from "./FormControls";
import { ImageUpload } from "./ImageUpload";
import { FormError, type FormState } from "./ui";

/** Current URL per slot key (null = not set). */
export type SiteContentFormValues = Record<string, string | null>;

export function SiteContentForm({
  action,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial: SiteContentFormValues;
}) {
  const [state, formAction] = useFormState(action, undefined);
  const err = (name: string) => state?.errors?.[name];

  return (
    <form action={formAction} className="space-y-6">
      <FormError state={state} />
      <section className="grid gap-8 rounded-2xl border border-navy-50 bg-white p-6 shadow-card sm:grid-cols-2">
        {siteImageSlots.map((slot) => (
          <div key={slot.key}>
            <ImageUpload name={slot.key} label={slot.label} defaultValue={initial[slot.key]} />
            {err(slot.key) && <p className="mt-2 text-xs font-medium text-red-600">{err(slot.key)?.join(" ")}</p>}
          </div>
        ))}
      </section>
      <SubmitButton label="Save photos" />
    </form>
  );
}
