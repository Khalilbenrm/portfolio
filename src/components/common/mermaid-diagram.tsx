"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

export function MermaidDiagram({ diagram, title }: { diagram: string; title?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "200px" });
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = `mermaid-${rawId}`;
  const { resolvedTheme } = useTheme();
  const t = useTranslations("Mermaid");
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isInView) return;
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
            mainBkg: isDark ? "#161815" : "#e2f0e8",
            primaryColor: isDark ? "#161815" : "#e2f0e8",
            primaryTextColor: isDark ? "#f2f1ec" : "#17191a",
            primaryBorderColor: isDark ? "#52c98d" : "#3f8f68",
            secondaryColor: isDark ? "#142a1f" : "#e2f0e8",
            tertiaryColor: isDark ? "#142a1f" : "#e2f0e8",
            lineColor: isDark ? "#3a3d37" : "#d6d2c5",
            textColor: isDark ? "#f2f1ec" : "#17191a",
            clusterBkg: isDark ? "#161815" : "#eeeae0",
            clusterBorder: isDark ? "#272a24" : "#e6e1d3",
            edgeLabelBackground: isDark ? "#171915" : "#ffffff",
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
  }, [diagram, id, resolvedTheme, isInView]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--surface)] p-6"
    >
      {title && <p className="mb-4 text-sm font-medium text-[var(--muted-foreground)]">{title}</p>}
      {error ? (
        <p className="text-sm text-[var(--muted-foreground)]">{t("renderError")}</p>
      ) : svg ? (
        <div className="[&_svg]:mx-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="h-40 w-full animate-pulse rounded-md bg-[var(--surface-hover)]" />
      )}
    </div>
  );
}
