"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, Loader2, X } from "lucide-react";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif,.heic,.heif";
const MAX_CLOUDINARY_BYTES = 10 * 1024 * 1024; // Cloudinary free-plan image limit
const MAX_LOCAL_BYTES = 4 * 1024 * 1024;
const HINT = "JPG, PNG, WebP or HEIC photos, up to 10 MB.";

type SignResponse =
  | { provider: "cloudinary"; params: Record<string, string | number> & { cloud_name: string } }
  | { provider: "local" }
  | { error: string };

/**
 * Uploads one image and returns its URL. With Cloudinary the file goes straight
 * from the browser to Cloudinary using a server-signed request; otherwise it's
 * posted to our own /api/admin/upload.
 */
async function uploadFile(file: File): Promise<string> {
  const signRes = await fetch("/api/admin/upload/sign", { method: "POST" });
  const sign = (await signRes.json().catch(() => ({ error: "Upload failed." }))) as SignResponse;
  if (!signRes.ok || "error" in sign) throw new Error("error" in sign ? sign.error : "Upload failed.");

  if (sign.provider === "cloudinary") {
    if (file.size > MAX_CLOUDINARY_BYTES) throw new Error(`${file.name} is larger than 10 MB.`);
    const { cloud_name, ...params } = sign.params;
    const body = new FormData();
    body.append("file", file);
    for (const [key, value] of Object.entries(params)) body.append(key, String(value));
    const res = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud_name)}/image/upload`, {
      method: "POST",
      body,
    });
    const data = (await res.json().catch(() => ({}))) as { secure_url?: string; error?: { message?: string } };
    if (!res.ok || !data.secure_url) {
      const msg = data.error?.message ?? "";
      throw new Error(/format/i.test(msg) ? `${file.name}: only JPG, PNG, WebP or HEIC photos are allowed.` : msg || "Upload failed.");
    }
    return data.secure_url;
  }

  if (file.size > MAX_LOCAL_BYTES) throw new Error(`${file.name} is larger than 4 MB.`);
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed.");
  return data.url;
}

function Preview({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} fill unoptimized sizes="240px" className="object-cover" />;
}

/** Single image field. Uploads on pick; submits the resulting URL in a hidden input. */
export function ImageUpload({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string | null }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const onPick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      setUrl(await uploadFile(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy-900">
        {label}
      </label>
      <input type="hidden" name={name} value={url} />
      <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden rounded-xl border-2 border-dashed border-navy-100 bg-navy-50/50">
        {url ? (
          <>
            <Preview src={url} alt={label} />
            <button
              type="button"
              onClick={() => setUrl("")}
              aria-label={`Remove ${label.toLowerCase()}`}
              className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-navy-900 shadow hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-charcoal-500 hover:text-navy-900"
          >
            {busy ? <Loader2 className="h-6 w-6 animate-spin" aria-hidden /> : <ImagePlus className="h-6 w-6" aria-hidden />}
            {busy ? "Uploading…" : "Choose image"}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => onPick(e.target.files?.[0])}
      />
      {url && (
        <button type="button" onClick={() => inputRef.current?.click()} className="mt-2 text-xs font-medium text-navy-700 underline">
          Replace image
        </button>
      )}
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      <p className="mt-1 text-xs text-charcoal-500">{HINT}</p>
    </div>
  );
}

/** Multiple photos with reorder/remove. Submits each URL as a repeated hidden input. */
export function PhotosUpload({ name, defaultValue = [] }: { name: string; defaultValue?: string[] }) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const onPick = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    const failures: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const url = await uploadFile(file);
        setUrls((prev) => [...prev, url]);
      } catch (e) {
        failures.push(e instanceof Error ? e.message : `${file.name}: upload failed.`);
      }
    }
    if (failures.length) setError(failures.join(" "));
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const move = (from: number, to: number) =>
    setUrls((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-navy-900">More photos</p>
      {urls.map((u) => (
        <input key={u} type="hidden" name={name} value={u} />
      ))}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {urls.map((u, i) => (
          <li key={u} className="relative aspect-square overflow-hidden rounded-xl bg-navy-50">
            <Preview src={u} alt={`Photo ${i + 1}`} />
            <div className="absolute inset-x-1 bottom-1 flex justify-between">
              <span className="flex gap-1">
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move earlier" className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-navy-900 shadow disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => move(i, i + 1)} disabled={i === urls.length - 1} aria-label="Move later" className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-navy-900 shadow disabled:opacity-40">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </span>
              <button type="button" onClick={() => setUrls((prev) => prev.filter((x) => x !== u))} aria-label={`Remove photo ${i + 1}`} className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-red-600 shadow">
                <X className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
        <li>
          <label
            htmlFor={id}
            className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-100 bg-navy-50/50 text-sm text-charcoal-500 hover:text-navy-900"
          >
            {busy ? <Loader2 className="h-6 w-6 animate-spin" aria-hidden /> : <ImagePlus className="h-6 w-6" aria-hidden />}
            {busy ? "Uploading…" : "Add photos"}
          </label>
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={ACCEPT}
            multiple
            disabled={busy}
            className="sr-only"
            onChange={(e) => onPick(e.target.files)}
          />
        </li>
      </ul>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
