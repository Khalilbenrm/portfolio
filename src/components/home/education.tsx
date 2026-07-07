import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import type { EducationEntry } from "@/types/experience";

export function Education({ items }: { items: EducationEntry[] }) {
  const t = useTranslations("Education");

  return (
    <section id="education" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      <div className="relative mt-10">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--card-border)]" aria-hidden />

        <div className="flex flex-col gap-6">
          {items.map((item, i) => (
            <Reveal key={`${item.school}-${item.period}`} delay={i * 0.05} className="relative pl-10">
              <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--card-border)] bg-[var(--background)]" />

              <div className="flex flex-wrap items-baseline justify-between gap-2 rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] px-6 py-4">
                <div>
                  <p className="text-sm font-semibold">{item.degree}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{item.school}</p>
                </div>
                <span className="whitespace-nowrap text-sm text-[var(--muted-foreground)]">{item.period}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
