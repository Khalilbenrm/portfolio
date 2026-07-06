import { Reveal } from "@/components/common/reveal";
import { Badge } from "@/components/ui/badge";
import { CaseStudySection } from "./section";
import type { TechStackCategory } from "@/types/project";

export function TechStack({ stack }: { stack: TechStackCategory[] }) {
  return (
    <CaseStudySection eyebrow="Stack technique" title="Technologies utilisées">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stack.map((category, i) => (
          <Reveal key={category.category} delay={i * 0.05}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </CaseStudySection>
  );
}
