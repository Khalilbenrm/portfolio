import { useTranslations } from "next-intl";
import { Lightbulb } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { CaseStudySection } from "./section";
import type { LessonLearned } from "@/types/project";

export function LessonsLearned({ items }: { items: LessonLearned[] }) {
  const t = useTranslations("CaseStudy.lessonsLearned");

  if (items.length === 0) return null;

  return (
    <CaseStudySection eyebrow={t("eyebrow")} title={t("title")}>
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.05}>
            <div className="flex gap-3 rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-5">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" strokeWidth={1.75} />
              <div>
                <h3 className="text-sm font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {item.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </CaseStudySection>
  );
}
