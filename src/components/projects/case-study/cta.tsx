import { ArrowLeft } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/project";

export function CaseStudyCta({ project }: { project: Project }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <div className="glass flex flex-col items-center gap-6 rounded-[var(--radius-lg)] border p-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Envie d&apos;en savoir plus sur {project.name} ?
          </h2>
          <p className="max-w-md text-sm text-[var(--muted-foreground)]">
            Le code source complet est disponible sur GitHub, avec l&apos;historique et la configuration
            de déploiement.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href={project.github} external>
              <FaGithub className="h-4 w-4" />
              Explorer le code
            </Button>
            <Button href="/projects" variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Autres projets
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
