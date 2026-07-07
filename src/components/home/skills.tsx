import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { TechIcon } from "@/components/common/tech-icon";
import type { Skill } from "@/types/site";

export function Skills({ skills }: { skills: Skill[] }) {
  const t = useTranslations("Skills");
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      <div className="mt-14 flex flex-col gap-10">
        {categories.map((category, catIdx) => (
          <Reveal key={category} delay={catIdx * 0.05}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
              {category}
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills
                .filter((s) => s.category === category)
                .sort((a, b) => b.level - a.level)
                .map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-2.5 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 transition-colors hover:border-[var(--accent)]"
                  >
                    <TechIcon name={skill.icon} className="h-5 w-5 shrink-0 text-[var(--accent)]" />
                    <span className="text-sm font-medium">{skill.name}</span>
                  </div>
                ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
