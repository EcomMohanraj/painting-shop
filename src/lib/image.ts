// Blur-up placeholders for remote photos (Cloudinary/Unsplash), which Next.js
// can't generate automatically. A tiny two-tone SVG wash in the brand palette
// shows while the real image loads.

export function blurDataURL(from = "#dfe6f1", to = "#fff1c6") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="6"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="8" height="6" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/** Shared default so every photo on the site fades in from the same wash. */
export const PHOTO_BLUR = blurDataURL();
