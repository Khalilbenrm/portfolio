import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { TechIcon } from "@/components/common/tech-icon";
import { DynamicIcon } from "@/components/common/icon";
import { cn } from "@/lib/utils";
import type { Certification, Skill } from "@/types/site";

export function Skills({ skills, certifications }: { skills: Skill[]; certifications: Certification[] }) {
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

        {certifications.length > 0 && (
          <Reveal delay={categories.length * 0.05}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
              {t("certifications")}
            </h3>
            <div className="flex flex-wrap gap-3">
              {certifications.map((cert) => {
                const content = (
                  <>
                    {cert.logo ? (
                      <span className="relative flex h-9 w-12 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-white">
                        <Image src={cert.logo} alt={cert.issuer ?? cert.name} fill className="object-contain p-0.5" quality={100} />
                      </span>
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                        <DynamicIcon name={cert.icon} className="h-4.5 w-4.5" />
                      </span>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold leading-tight">{cert.name}</span>
                      {cert.issuer && <span className="text-xs text-[var(--muted-foreground)]">{cert.issuer}</span>}
                    </div>
                    <span
                      className={cn(
                        "ml-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium",
                        cert.status === "obtained"
                          ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                          : "bg-[var(--surface-hover)] text-[var(--muted-foreground)]"
                      )}
                    >
                      {cert.status === "obtained" ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                      {cert.status === "obtained" ? t("obtained") : t("inProgress")}
                    </span>
                    {cert.url && <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)]" />}
                  </>
                );

                return cert.url ? (
                  <a
                    key={cert.name}
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 transition-colors hover:border-[var(--accent)]"
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={cert.name}
                    className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] px-4 py-3"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
