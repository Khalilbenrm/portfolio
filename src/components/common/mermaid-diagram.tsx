"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "next-themes";

export function MermaidDiagram({ diagram, title }: { diagram: string; title?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = `mermaid-${rawId}`;
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === "dark" ? "dark" : "default",
          securityLevel: "strict",
          fontFamily: "var(--font-geist-sans)",
          themeVariables: {
            primaryColor: resolvedTheme === "dark" ? "#1a1830" : "#eeedfd",
            primaryTextColor: resolvedTheme === "dark" ? "#f4f4f6" : "#0a0a0b",
            primaryBorderColor: "#8b85f5",
            lineColor: resolvedTheme === "dark" ? "#4a4a55" : "#c7c7d1",
            fontSize: "14px",
          },
        });
        const { svg: rendered } = await mermaid.render(id, diagram);
        if (!cancelled) {
          setSvg(rendered);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [diagram, id, resolvedTheme]);

  return (
    <div className="w-full overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--surface)] p-6">
      {title && <p className="mb-4 text-sm font-medium text-[var(--muted-foreground)]">{title}</p>}
      {error ? (
        <p className="text-sm text-[var(--muted-foreground)]">
          Le diagramme n&apos;a pas pu être rendu.
        </p>
      ) : svg ? (
        <div ref={ref} className="[&_svg]:mx-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="h-40 w-full animate-pulse rounded-md bg-[var(--surface-hover)]" />
      )}
    </div>
  );
}
