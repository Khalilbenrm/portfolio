import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { Progress } from "@/components/ui/progress";
import { DynamicIcon } from "@/components/common/icon";
import type { Skill } from "@/types/site";

export function Skills({ skills }: { skills: Skill[] }) {
  const t = useTranslations("Skills");
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {categories.map((category, catIdx) => (
          <Reveal
            key={category}
            delay={catIdx * 0.05}
            className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-6"
          >
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
              {category}
            </h3>
            <div className="flex flex-col gap-5">
              {skills
                .filter((s) => s.category === category)
                .map((skill) => {
                  const levelText = t(`levels.${skill.levelLabel}`);
                  return (
                    <div key={skill.name}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface)] text-[var(--accent)]">
                            <DynamicIcon name={skill.icon} className="h-4 w-4" strokeWidth={1.75} />
                          </span>
                          <span className="text-sm font-medium">{skill.name}</span>
                        </div>
                        <span className="text-xs text-[var(--muted-foreground)]">{levelText}</span>
                      </div>
                      <Progress
                        value={skill.level}
                        label={t("progressLabel", { name: skill.name, level: levelText })}
                      />
                    </div>
                  );
                })}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
