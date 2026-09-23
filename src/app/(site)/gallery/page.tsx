import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getProjects } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery — Before & After",
  description: `Before and after photos of residential and commercial painting projects completed by ${site.name}.`,
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Before & after gallery"
        description="Drag the slider on any project to see the transformation."
      />
      <section className="section">
        <div className="container">
          <GalleryGrid projects={projects} />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
