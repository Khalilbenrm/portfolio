import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { Progress } from "@/components/ui/progress";
import { DynamicIcon } from "@/components/common/icon";
import type { Skill } from "@/types/site";

const LEVEL_LABELS: Record<Skill["levelLabel"], string> = {
  learning: "Apprentissage",
  proficient: "Opérationnel",
  advanced: "Avancé",
  expert: "Expert",
};

export function Skills({ skills }: { skills: Skill[] }) {
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading
        eyebrow="Compétences"
        title="Une boîte à outils complète, du backend au produit fini"
        description="Technologies et pratiques utilisées régulièrement, avec un niveau de maîtrise indicatif."
      />
      <div className="mt-14 grid gap-10 sm:grid-cols-2">
        {categories.map((category, catIdx) => (
          <Reveal key={category} delay={catIdx * 0.05}>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
              {category}
            </h3>
            <div className="flex flex-col gap-5">
              {skills
                .filter((s) => s.category === category)
                .map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--accent)]">
                          <DynamicIcon name={skill.icon} className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        <span className="text-sm font-medium">{skill.name}</span>
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {LEVEL_LABELS[skill.levelLabel]}
                      </span>
                    </div>
                    <Progress
                      value={skill.level}
                      label={`Niveau de maîtrise ${skill.name} : ${LEVEL_LABELS[skill.levelLabel]}`}
                    />
                  </div>
                ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
