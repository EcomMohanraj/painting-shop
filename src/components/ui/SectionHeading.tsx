import { PaintWipe } from "./PaintWipe";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** "light" for headings on dark (navy) sections. */
  tone?: "dark" | "light";
};

export function SectionHeading({ eyebrow, title, description, align = "center", tone = "dark" }: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";
  const light = tone === "light";
  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow && (
        <Reveal>
          <p className={`eyebrow ${light ? "text-gold-300" : ""}`}>{eyebrow}</p>
        </Reveal>
      )}
      <h2 className={`mt-4 text-display-md font-extrabold ${light ? "text-white" : ""}`}>
        <PaintWipe inView delay={0.05} className="block">
          {title}
        </PaintWipe>
      </h2>
      {description && (
        <Reveal delay={0.12}>
          <p className={`mt-5 text-lg leading-relaxed ${light ? "text-navy-100/75" : "text-charcoal-600"} ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
