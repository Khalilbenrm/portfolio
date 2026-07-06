import { Reveal } from "@/components/common/reveal";
import { Markdown } from "@/components/common/markdown";
import { CaseStudySection } from "./section";

export function CaseStudyAbout({ content }: { content: string }) {
  return (
    <CaseStudySection eyebrow="À propos" title="Contexte, problème & solution">
      <Reveal>
        <Markdown content={content} className="max-w-3xl text-base" />
      </Reveal>
    </CaseStudySection>
  );
}
