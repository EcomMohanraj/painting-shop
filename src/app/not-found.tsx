import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section grid min-h-[70vh] place-items-center pt-32">
      <div className="container text-center">
        <p className="font-display text-7xl font-extrabold text-gold-400">404</p>
        <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-charcoal-600">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <Link href="/" className="btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </section>
  );
}
