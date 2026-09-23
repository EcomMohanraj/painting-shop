import { withAuth } from "next-auth/middleware";

// Redirects signed-out visitors from /admin/* to /admin/login.
// (withAuth lets the sign-in page itself through.) Pages also call
// requireAdmin() server-side, so protection doesn't rely on this alone.
export default withAuth({
  pages: { signIn: "/admin/login", error: "/admin/login" },
});

export const config = {
  matcher: ["/admin/:path*"],
};
