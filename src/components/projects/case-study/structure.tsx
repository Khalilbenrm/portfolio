import { Reveal } from "@/components/common/reveal";
import { CaseStudySection } from "./section";
import type { Project } from "@/types/project";

export function Structure({ structure }: { structure: Project["structure"] }) {
  return (
    <CaseStudySection eyebrow="Structure du projet" title="Organisation du code">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <pre className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--surface)] p-6 font-mono text-xs leading-relaxed text-[var(--muted-foreground)]">
            {structure.tree}
          </pre>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            Rôle des dossiers clés
          </h3>
          <div className="flex flex-col gap-4">
            {structure.notes.map((note) => (
              <div key={note.path}>
                <code className="rounded bg-[var(--surface-hover)] px-2 py-0.5 font-mono text-xs text-[var(--accent)]">
                  {note.path}
                </code>
                <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">{note.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </CaseStudySection>
  );
}
