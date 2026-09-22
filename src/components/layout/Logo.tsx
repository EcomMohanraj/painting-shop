import Link from "next/link";
import { PaintRoller } from "lucide-react";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="Krisha Paintings — home">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-gold-400 text-navy-950 transition-transform group-hover:-rotate-6">
        <PaintRoller className="h-5 w-5" aria-hidden />
      </span>
      <span className="leading-none">
        <span className={`block font-display text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-navy-900"}`}>
          KRISHA
        </span>
        <span className={`block text-[0.65rem] font-semibold uppercase tracking-[0.3em] ${light ? "text-gold-300" : "text-gold-600"}`}>
          Paintings
        </span>
      </span>
    </Link>
  );
}
