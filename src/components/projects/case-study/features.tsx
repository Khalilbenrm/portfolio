import { Reveal } from "@/components/common/reveal";
import { DynamicIcon } from "@/components/common/icon";
import { CaseStudySection } from "./section";
import type { ProjectFeature } from "@/types/project";

export function Features({ features }: { features: ProjectFeature[] }) {
  return (
    <CaseStudySection eyebrow="Fonctionnalités" title="Ce que le système fait concrètement">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <Reveal key={feature.title} delay={i * 0.05}>
            <div className="h-full rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <DynamicIcon name={feature.icon} className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="font-semibold tracking-tight">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {feature.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </CaseStudySection>
  );
}
