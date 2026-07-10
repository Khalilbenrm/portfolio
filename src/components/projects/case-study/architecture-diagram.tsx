"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, ArrowDown } from "lucide-react";
import { DynamicIcon } from "@/components/common/icon";
import { Reveal } from "@/components/common/reveal";
import { cn } from "@/lib/utils";
import { CaseStudySection } from "./section";
import type { ArchitectureFlowColumn, ArchitectureFlowKind, ArchitectureFlowNode } from "@/types/project";

const KIND_STYLES: Record<ArchitectureFlowKind, { text: string; icon: string; glow: string; ring: string }> = {
  client: { text: "text-sky-400", icon: "text-sky-400", glow: "rgba(56,189,248,0.35)", ring: "hover:border-sky-500/40" },
  gateway: { text: "text-amber-400", icon: "text-amber-400", glow: "rgba(251,191,36,0.35)", ring: "hover:border-amber-500/40" },
  service: { text: "text-emerald-400", icon: "text-emerald-400", glow: "rgba(52,211,153,0.35)", ring: "hover:border-emerald-500/40" },
  data: { text: "text-violet-400", icon: "text-violet-400", glow: "rgba(167,139,250,0.35)", ring: "hover:border-violet-500/40" },
  observability: { text: "text-cyan-400", icon: "text-cyan-400", glow: "rgba(34,211,238,0.35)", ring: "hover:border-cyan-500/40" },
};

const KIND_BG: Record<ArchitectureFlowKind, string> = {
  client: "bg-sky-500/10",
  gateway: "bg-amber-500/10",
  service: "bg-emerald-500/10",
  data: "bg-violet-500/10",
  observability: "bg-cyan-500/10",
};

export function ArchitectureDiagram({
  flow,
  infra,
  summary,
}: {
  flow: ArchitectureFlowColumn[];
  infra?: ArchitectureFlowNode[];
  summary: string[];
}) {
  const t = useTranslations("CaseStudy.architecture");

  return (
    <CaseStudySection eyebrow={t("eyebrow")} title={t("title")}>
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl shadow-black/30">
          {/* console header */}
          <div className="flex items-center gap-1.5 border-b border-neutral-800 bg-neutral-900 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f4756c]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f5bf4f]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#59c766]" />
            <span className="ml-2 truncate font-mono text-xs text-emerald-400/80">architecture.diagram</span>
            <span className="ml-auto hidden font-mono text-[11px] text-neutral-600 sm:inline">
              {flow.reduce((n, c) => n + c.nodes.length, 0)} nodes · {flow.length} layers
            </span>
          </div>

          {/* diagram canvas */}
          <div
            className="p-4 sm:p-6"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            <div className="flex flex-col items-stretch gap-1.5 lg:flex-row lg:flex-wrap lg:items-center lg:justify-center lg:gap-0">
              {flow.map((column, i) => {
                const style = KIND_STYLES[column.kind];
                return (
                  <Fragment key={i}>
                    <div className="flex flex-col items-center gap-2 lg:w-28 lg:shrink-0">
                      <span className={cn("font-mono text-[9px] font-semibold uppercase tracking-widest", style.text)}>
                        {column.label}
                      </span>

                      <div className="flex flex-row flex-wrap items-center justify-center gap-2 lg:flex-col lg:flex-nowrap">
                        {column.nodes.map((node) => (
                          <div
                            key={node.label}
                            className={cn(
                              "flex w-24 flex-col items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-2.5 text-center transition-colors",
                              style.ring
                            )}
                          >
                            <span
                              className={cn("flex h-7 w-7 items-center justify-center rounded-full", KIND_BG[column.kind], style.icon)}
                              style={{ boxShadow: `0 0 10px -2px ${style.glow}` }}
                            >
                              <DynamicIcon name={node.icon} className="h-3.5 w-3.5" strokeWidth={1.75} />
                            </span>
                            <span className="text-[11px] font-semibold leading-tight text-neutral-100">{node.label}</span>
                            {node.specs && node.specs.length > 0 && (
                              <div className="flex flex-wrap items-center justify-center gap-0.5">
                                {node.specs.map((spec) => (
                                  <span
                                    key={spec}
                                    className="rounded-full border border-neutral-700 bg-neutral-800 px-1.5 py-0.5 font-mono text-[8px] leading-none text-neutral-400"
                                  >
                                    {spec}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {i < flow.length - 1 && (
                      <div className="flex shrink-0 flex-row items-center justify-center gap-1.5 py-1 lg:w-16 lg:flex-col lg:py-0">
                        <motion.div
                          animate={{ opacity: [0.35, 1, 0.35] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                          className="flex items-center justify-center text-neutral-600"
                        >
                          <ArrowDown className="h-3.5 w-3.5 lg:hidden" />
                          <ArrowRight className="hidden h-3.5 w-3.5 lg:block" />
                        </motion.div>
                        {column.edgeLabel && (
                          <span className="hidden max-w-[4rem] text-center font-mono text-[8px] leading-tight text-neutral-600 xl:block">
                            {column.edgeLabel}
                          </span>
                        )}
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>

          {/* infra band — wraps the pipeline, not part of the data flow */}
          {infra && infra.length > 0 && (
            <div className="border-t border-neutral-800 bg-neutral-900/60 px-4 py-3 sm:px-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-neutral-500">
                  {t("infraLabel")}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {infra.map((node) => (
                    <div
                      key={node.label}
                      className="flex items-center gap-1.5 rounded-lg border border-dashed border-neutral-700 bg-neutral-900 px-2.5 py-1.5"
                    >
                      <DynamicIcon name={node.icon} className="h-3 w-3 text-neutral-400" strokeWidth={1.75} />
                      <span className="text-[11px] font-medium text-neutral-300">{node.label}</span>
                      {node.specs && node.specs.length > 0 && (
                        <span className="font-mono text-[9px] text-neutral-500">{node.specs.join(" · ")}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* spec sheet footer */}
          {summary.length > 0 && (
            <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-neutral-800 bg-neutral-900 px-6 py-3.5">
              {summary.map((item) => (
                <span key={item} className="flex items-center gap-1.5 font-mono text-xs text-neutral-400">
                  <span className="text-emerald-500">›</span>
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </CaseStudySection>
  );
}
