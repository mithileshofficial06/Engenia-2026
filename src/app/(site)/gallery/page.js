import PageHeader from "@/components/PageHeader";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata = {
  title: "Gallery",
  description: "Photographs from the onstage and offstage events of ENGENIA.",
};

export default function GalleryPage() {
  return (
    <div>
      <PageHeader
        hue="azure"
        eyebrow="Moments"
        title="Photo"
        accent="Gallery"
        subtitle="Two days, seven departments, one stage. A look back at the frames worth keeping."
      />
      <GalleryGrid />
    </div>
  );
}
