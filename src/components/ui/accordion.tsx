"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const id = React.useId();

  return (
    <div className="border-b border-[var(--border)] py-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="font-medium text-[var(--foreground)]">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--muted-foreground)] transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        id={id}
        className={cn(
          "grid overflow-hidden transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100 pt-3" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {children}
        </div>
      </div>
    </div>
  );
}
