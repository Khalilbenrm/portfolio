import { useTranslations } from "next-intl";
import { Placeholder } from "@/components/common/placeholder";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { InProgressProject } from "@/types/project";

export function InProgressCard({ project }: { project: InProgressProject }) {
  const t = useTranslations("InProgressCard");

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] opacity-90">
      <Placeholder label={project.name} icon="Hammer" className="rounded-none border-0 border-b" />
      <div className="p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge variant={project.status === "in-development" ? "warning" : "outline"}>
            {project.status === "in-development" ? t("inDevelopment") : t("comingSoon")}
          </Badge>
          <span className="text-xs text-[var(--muted-foreground)]">{project.progress}%</span>
        </div>
        <h3 className="text-lg font-semibold tracking-tight">{project.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {project.description}
        </p>
        <div className="mt-4">
          <Progress value={project.progress} label={`${project.name}: ${project.progress}%`} />
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
