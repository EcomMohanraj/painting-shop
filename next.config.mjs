import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Admin uploads are stored on Cloudinary; placeholder photos come from Unsplash.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

// Installable admin app (PWA), scoped to /admin only. next-pwa just generates
// public/sw.js at build time; the service worker is registered by
// src/components/admin/RegisterServiceWorker.tsx, which only the /admin layout
// renders — so the public site never registers it or links the manifest.
const pwaConfig = withPWA({
  dest: "public",
  // next-pwa's auto-register script targets the Pages Router entry, which App
  // Router pages never load (and it would apply site-wide if they did).
  register: false,
  skipWaiting: true,
  scope: "/admin",
  disable: process.env.NODE_ENV === "development",
  // Don't cache the site root as a "start URL" (the admin app starts at /admin).
  cacheStartUrl: false,
  dynamicStartUrl: false,
  runtimeCaching: [
    // Static assets (JS/CSS/images/fonts): cache-first for speed.
    {
      urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|webp)$/i,
      handler: "CacheFirst",
      options: { cacheName: "admin-static", expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 } },
    },
    // Admin pages and API data: always network, never cached, so enquiry counts
    // and stats are never stale. (Workbox tests regexes against the full URL,
    // so these match on the path instead.)
    { urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/admin"), handler: "NetworkOnly" },
    { urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/api/"), handler: "NetworkOnly" },
  ],
});

export default pwaConfig(nextConfig);
