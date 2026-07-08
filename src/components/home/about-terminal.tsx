"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import type { QaTerminal } from "@/types/site";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.3, delayChildren: 0.2 } },
};

const line = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export function AboutTerminal({ terminal }: { terminal: QaTerminal }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
      className="w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] lg:sticky lg:top-24"
    >
      <div className="flex items-center gap-1.5 border-b border-[var(--card-border)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#f4756c]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f5bf4f]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#59c766]" />
        <span className="ml-2 truncate text-xs text-[var(--muted-foreground)]">{terminal.title}</span>
      </div>

      <div className="flex flex-col gap-3.5 p-6 font-mono text-sm">
        {terminal.lines.map((l) => (
          <motion.div key={l.text} variants={line} className="flex items-center gap-3">
            {l.status === "pass" ? (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                <Check className="h-3 w-3" />
              </span>
            ) : (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--surface-hover)] text-[var(--muted-foreground)]">
                <Loader2 className="h-3 w-3 animate-spin" />
              </span>
            )}
            <span className={l.status === "pass" ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}>
              {l.text}
            </span>
          </motion.div>
        ))}

        <motion.div
          variants={line}
          className="mt-2 border-t border-[var(--card-border)] pt-3 text-xs text-[var(--muted-foreground)]"
        >
          {terminal.summary}
        </motion.div>
      </div>
    </motion.div>
  );
}
