import { Info } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { CaseStudySection } from "./section";

export function Caveats({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <CaseStudySection
      eyebrow="Limites connues"
      title="État actuel & pistes d'amélioration"
      description="Une revue de code honnête inclut ce qui n'est pas encore fait — voici les points identifiés directement dans le dépôt."
    >
      <Reveal>
        <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-6">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-500" />
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{item}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </CaseStudySection>
  );
}
