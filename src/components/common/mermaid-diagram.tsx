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
        const isDark = resolvedTheme === "dark";
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "strict",
          fontFamily: "var(--font-geist-sans)",
          themeVariables: {
            background: "transparent",
            mainBkg: isDark ? "#15131f" : "#f2f1fd",
            primaryColor: isDark ? "#15131f" : "#f2f1fd",
            primaryTextColor: isDark ? "#f4f4f6" : "#0a0a0b",
            primaryBorderColor: isDark ? "#6f68d8" : "#8b85f5",
            secondaryColor: isDark ? "#1a1830" : "#eeedfd",
            tertiaryColor: isDark ? "#1a1830" : "#eeedfd",
            lineColor: isDark ? "#55555f" : "#c7c7d1",
            textColor: isDark ? "#f4f4f6" : "#0a0a0b",
            clusterBkg: isDark ? "#131318" : "#f7f7f9",
            clusterBorder: isDark ? "#2a2a32" : "#e2e2e7",
            edgeLabelBackground: isDark ? "#0f0f12" : "#ffffff",
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
