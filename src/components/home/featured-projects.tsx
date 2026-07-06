import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/types/project";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Projets"
          title="Études de cas techniques"
          description="Deux systèmes backend analysés en profondeur : architecture, patterns et arbitrages réels."
          className="max-w-xl"
        />
        <Reveal delay={0.15}>
          <Button href="/projects" variant="outline">
            Tous les projets
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Reveal>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.1}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
