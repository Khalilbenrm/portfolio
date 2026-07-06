import type { Metadata } from "next";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { InProgressCard } from "@/components/projects/in-progress-card";
import { getAllProjects, getInProgressProjects, getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projets",
  description: "Études de cas techniques détaillées : architecture, stack et arbitrages réels.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const inProgress = getInProgressProjects();
  const site = getSiteConfig();
  void site;

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Portfolio"
        title="Projets"
        description="Chaque projet ci-dessous est une étude de cas complète : architecture, stack technique, diagrammes et défis rencontrés — tout est déduit directement du code source."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      {inProgress.length > 0 && (
        <div className="mt-24">
          <SectionHeading eyebrow="À venir" title="Projects in progress" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.08}>
                <InProgressCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
