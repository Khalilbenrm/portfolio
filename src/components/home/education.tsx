import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import type { EducationEntry } from "@/types/experience";

export function Education({ items }: { items: EducationEntry[] }) {
  const t = useTranslations("Education");

  return (
    <section id="education" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
      <div className="mt-10 flex flex-col gap-4">
        {items.map((item, i) => (
          <Reveal
            key={`${item.school}-${item.period}`}
            delay={i * 0.05}
            className="flex flex-wrap items-baseline justify-between gap-2 rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] px-6 py-4"
          >
            <div>
              <p className="text-sm font-semibold">{item.degree}</p>
              <p className="text-sm text-[var(--muted-foreground)]">{item.school}</p>
            </div>
            <span className="whitespace-nowrap text-sm text-[var(--muted-foreground)]">{item.period}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
