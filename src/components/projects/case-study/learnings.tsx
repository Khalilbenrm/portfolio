import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { CaseStudySection } from "./section";

export function Learnings({ items }: { items: string[] }) {
  return (
    <CaseStudySection eyebrow="Ce que j'ai appris" title="Compétences acquises">
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item} delay={i * 0.05} className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
            <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{item}</p>
          </Reveal>
        ))}
      </div>
    </CaseStudySection>
  );
}
