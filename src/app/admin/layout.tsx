import type { Metadata, Viewport } from "next";
import { RegisterServiceWorker } from "@/components/admin/RegisterServiceWorker";

// The PWA manifest and home-screen tags live here, not in the root layout, so
// only /admin pages are installable — the public site never links them.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "KP Admin", statusBarStyle: "black-translucent" },
  // Setting `icons` here replaces the root's auto-detected icons, so re-add the
  // site favicon (src/app/icon.png) alongside the admin PWA's own Apple icon.
  icons: {
    icon: { url: "/icon.png", type: "image/png", sizes: "512x512" },
    apple: "/icons/admin-apple-touch-180.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1d35",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-50/60">
      <RegisterServiceWorker />
      {children}
    </div>
  );
}
