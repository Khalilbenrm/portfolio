import { useTranslations } from "next-intl";
import { Reveal } from "@/components/common/reveal";
import { CaseStudySection } from "./section";
import type { WorkflowStep } from "@/types/project";

export function Workflow({ steps }: { steps: WorkflowStep[] }) {
  const t = useTranslations("CaseStudy.workflow");

  return (
    <CaseStudySection eyebrow={t("eyebrow")} title={t("title")}>
      <div className="relative flex flex-col gap-8 pl-8">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[var(--border)]" aria-hidden />
        {steps.map((step, i) => (
          <Reveal key={step.step} delay={i * 0.06} className="relative">
            <span className="absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-[var(--accent-foreground)]">
              {i + 1}
            </span>
            <p className="font-semibold">{step.step.replace(/^\d+\.\s*/, "")}</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
              {step.description}
            </p>
          </Reveal>
        ))}
      </div>
    </CaseStudySection>
  );
}
