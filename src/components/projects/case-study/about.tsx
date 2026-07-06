import { Markdown } from "@/components/common/markdown";
import { CaseStudySection } from "./section";

export function CaseStudyAbout({ content }: { content: string }) {
  return (
    <CaseStudySection eyebrow="À propos" title="Contexte, problème & solution">
      {/* Not wrapped in Reveal: this is often the largest text block on the
          page and a common LCP candidate — opacity-gating it behind a
          scroll animation would delay when it counts as "rendered". */}
      <Markdown content={content} className="max-w-3xl text-base" />
    </CaseStudySection>
  );
}
