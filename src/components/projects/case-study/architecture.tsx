import { useTranslations } from "next-intl";
import { Reveal } from "@/components/common/reveal";
import { MermaidDiagram } from "@/components/common/mermaid-diagram";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseStudySection } from "./section";
import type { Project } from "@/types/project";

export function Architecture({ architecture }: { architecture: Project["architecture"] }) {
  const t = useTranslations("CaseStudy.architecture");

  return (
    <CaseStudySection eyebrow={t("eyebrow")} title={t("title")} description={architecture.overview}>
      <div className="grid gap-8 lg:grid-cols-3">
        <Reveal>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            {t("layersTitle")}
          </h3>
          <div className="flex flex-col gap-3">
            {architecture.layers.map((layer) => (
              <Card key={layer.name} className="p-4">
                <p className="text-sm font-semibold">{layer.name}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{layer.responsibility}</p>
              </Card>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            {t("patternsTitle")}
          </h3>
          <div className="flex flex-col gap-3">
            {architecture.patterns.map((pattern) => (
              <Card key={pattern.name} className="p-4">
                <p className="text-sm font-semibold">{pattern.name}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{pattern.description}</p>
              </Card>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            {t("solidTitle")}
          </h3>
          <div className="flex flex-col gap-3">
            {architecture.solid.map((s) => (
              <Card key={s.principle} className="p-4">
                <p className="text-sm font-semibold">{s.principle}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{s.application}</p>
              </Card>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="mt-14 flex flex-col gap-8">
        {architecture.diagrams.map((diagram, i) => (
          <Reveal key={diagram.title} delay={i * 0.05}>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>{diagram.title}</CardTitle>
                {diagram.description && <p className="text-sm text-[var(--muted-foreground)]">{diagram.description}</p>}
              </CardHeader>
              <CardContent>
                <MermaidDiagram diagram={diagram.diagram} />
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </CaseStudySection>
  );
}
