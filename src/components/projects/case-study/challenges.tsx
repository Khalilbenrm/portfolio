import { AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "@/components/common/reveal";
import { CaseStudySection } from "./section";
import type { Challenge } from "@/types/project";

export function Challenges({ challenges }: { challenges: Challenge[] }) {
  return (
    <CaseStudySection eyebrow="Défis techniques" title="Problèmes rencontrés & solutions apportées">
      <Reveal>
        <div className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] px-6">
          {challenges.map((challenge, i) => (
            <AccordionItem key={challenge.problem} title={challenge.problem} defaultOpen={i === 0}>
              {challenge.solution}
            </AccordionItem>
          ))}
        </div>
      </Reveal>
    </CaseStudySection>
  );
}
