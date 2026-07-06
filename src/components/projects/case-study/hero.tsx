import { useTranslations } from "next-intl";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Placeholder } from "@/components/common/placeholder";
import { Reveal } from "@/components/common/reveal";
import type { Project } from "@/types/project";

export function CaseStudyHero({ project }: { project: Project }) {
  const t = useTranslations("CaseStudy.hero");
  const allTech = project.techStack.flatMap((c) => c.items);

  return (
    <section className="mx-auto max-w-6xl px-6 pt-16">
      <Reveal>
        <Button href="/projects" variant="ghost" size="sm" className="mb-8 -ml-4">
          <ArrowLeft className="h-4 w-4" />
          {t("backToProjects")}
        </Button>
      </Reveal>

      <Reveal delay={0.05}>
        <Placeholder label={project.name} icon="LayoutTemplate" className="mb-10" />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mb-4 flex flex-wrap gap-2">
          {allTech.slice(0, 5).map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </Reveal>

      {/* Not wrapped in Reveal: often the LCP candidate, see case-study/about.tsx. */}
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
        {project.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)]">
        {project.tagline}
      </p>

      <Reveal delay={0.15}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={project.github} external>
            <FaGithub className="h-4 w-4" />
            {t("codeSource")}
          </Button>
          {project.demo && (
            <Button href={project.demo} variant="outline" external>
              <ExternalLink className="h-4 w-4" />
              {t("demo")}
            </Button>
          )}
        </div>
      </Reveal>
    </section>
  );
}
