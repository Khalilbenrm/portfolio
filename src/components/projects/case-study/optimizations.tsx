import { useTranslations } from "next-intl";
import { Gauge, ShieldCheck, Wrench, TrendingUp, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { CaseStudySection } from "./section";
import type { Optimizations as OptimizationsType } from "@/types/project";

const CONFIG = [
  { key: "performance", icon: Gauge },
  { key: "security", icon: ShieldCheck },
  { key: "maintainability", icon: Wrench },
  { key: "scalability", icon: TrendingUp },
  { key: "quality", icon: BadgeCheck },
] as const;

export function Optimizations({ optimizations }: { optimizations: OptimizationsType }) {
  const t = useTranslations("CaseStudy.optimizations");

  return (
    <CaseStudySection eyebrow={t("eyebrow")} title={t("title")}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CONFIG.map(({ key, icon: Icon }, i) => {
          const items = optimizations[key];
          if (!items?.length) return null;
          return (
            <Reveal key={key} delay={i * 0.05}>
              <div className="h-full rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-6">
                <div className="mb-4 flex items-center gap-2.5">
                  <Icon className="h-4.5 w-4.5 text-[var(--accent)]" />
                  <h3 className="font-semibold">{t(key)}</h3>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {items.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </CaseStudySection>
  );
}
