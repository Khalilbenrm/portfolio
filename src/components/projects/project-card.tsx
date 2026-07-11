import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import { ProjectCover } from "@/components/projects/project-cover";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/project";

export function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations("ProjectCard");

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
    >
      <ProjectCover slug={project.slug} name={project.name} className="rounded-none border-0 border-b" />
      <div className="p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge>{t("caseStudy")}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            <FaGithub className="h-3.5 w-3.5" /> {t("codeSource")}
          </span>
        </div>
        <h3 className="flex items-center gap-1.5 text-lg font-semibold tracking-tight">
          {project.name}
          <ArrowUpRight className="h-4 w-4 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {project.tagline}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 2).flatMap((c) => c.items.slice(0, 2)).slice(0, 4).map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
