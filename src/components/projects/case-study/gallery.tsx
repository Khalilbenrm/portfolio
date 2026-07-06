import { Reveal } from "@/components/common/reveal";
import { Placeholder } from "@/components/common/placeholder";
import { CaseStudySection } from "./section";
import type { GalleryItem } from "@/types/project";

export function Gallery({ items }: { items: GalleryItem[] }) {
  return (
    <CaseStudySection
      eyebrow="Galerie"
      title="Aperçu visuel"
      description="Captures d'écran à venir — les emplacements ci-dessous sont prêts à recevoir les visuels réels."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.caption} delay={i * 0.05}>
            <Placeholder label={item.caption} icon="Camera" />
          </Reveal>
        ))}
      </div>
    </CaseStudySection>
  );
}
