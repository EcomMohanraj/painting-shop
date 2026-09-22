import { Brush, Building2, Check, Droplets, Home, Layers, PaintBucket, type LucideIcon } from "lucide-react";
import type { Service } from "@/data/services";

const icons: Record<Service["icon"], LucideIcon> = {
  home: Home,
  brush: Brush,
  building: Building2,
  droplets: Droplets,
  layers: Layers,
  paint: PaintBucket,
};

export function ServiceCard({ service, detailed = false }: { service: Service; detailed?: boolean }) {
  const Icon = icons[service.icon];
  return (
    <article
      id={detailed ? service.slug : undefined}
      className="group h-full scroll-mt-28 rounded-2xl border border-navy-50 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:border-gold-200 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-50 text-gold-600 transition-colors group-hover:bg-gold-400 group-hover:text-navy-950">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-700">
          {service.category}
        </span>
      </div>
      <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{service.summary}</p>
      {detailed && (
        <ul className="mt-5 space-y-2">
          {service.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-charcoal-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
