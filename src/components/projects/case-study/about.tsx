import { useTranslations } from "next-intl";
import { Markdown } from "@/components/common/markdown";
import { CaseStudySection } from "./section";

export function CaseStudyAbout({ content }: { content: string }) {
  const t = useTranslations("CaseStudy.about");

  return (
    <CaseStudySection eyebrow={t("eyebrow")} title={t("title")}>
      {/* Not wrapped in Reveal: this is often the largest text block on the
          page and a common LCP candidate — opacity-gating it behind a
          scroll animation would delay when it counts as "rendered". */}
      <Markdown content={content} className="max-w-3xl text-base" />
    </CaseStudySection>
  );
}
