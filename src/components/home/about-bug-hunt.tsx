"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bug, Check, Search } from "lucide-react";

const SLOTS = 6;

function BugSlot({ delay }: { delay: number }) {
  return (
    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-800">
      <motion.div
        className="absolute text-neutral-500"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
      >
        <Bug className="h-4 w-4" />
      </motion.div>
      <motion.div
        className="absolute text-emerald-400"
        animate={{ opacity: [0, 0, 1, 1], scale: [0.6, 0.6, 1.15, 1] }}
        transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
      >
        <Check className="h-4 w-4" />
      </motion.div>
    </div>
  );
}

export function AboutBugHunt({
  title,
  counterLabel,
  tagline,
}: {
  title: string;
  counterLabel: string;
  tagline: string;
}) {
  const [count, setCount] = useState(128);

  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl shadow-black/30 lg:sticky lg:top-24">
      <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900 px-4 py-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
          <Bug className="h-3.5 w-3.5" />
        </span>
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-400">{title}</span>
        <span className="relative ml-auto flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
        </span>
      </div>

      <div
        className="flex flex-col items-center gap-7 p-8"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="relative w-full">
          <motion.div
            className="pointer-events-none absolute -top-5 text-amber-400"
            animate={{ left: ["0%", "88%", "0%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Search className="h-5 w-5 -rotate-12" />
          </motion.div>
          <div className="flex w-full items-center justify-between">
            {Array.from({ length: SLOTS }).map((_, i) => (
              <BugSlot key={i} delay={i * 0.8} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <span className="font-mono text-2xl font-bold tabular-nums text-emerald-400">
            {count.toLocaleString()}
          </span>
          <span className="font-mono text-xs text-neutral-500">{counterLabel}</span>
        </div>

        <p className="max-w-[220px] text-center text-sm italic leading-relaxed text-neutral-500">{tagline}</p>
      </div>
    </div>
  );
}
