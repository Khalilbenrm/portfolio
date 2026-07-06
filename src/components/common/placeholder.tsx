import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "./icon";

export function Placeholder({
  label,
  icon = "ImageIcon",
  className,
  aspect = "aspect-video",
}: {
  label?: string;
  icon?: string;
  className?: string;
  aspect?: string;
}) {
  return (
    <div
      className={cn(
        "bg-grid relative flex w-full items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--surface)]",
        aspect,
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 60%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-2 text-[var(--muted-foreground)]">
        <DynamicIcon name={icon} className="h-7 w-7 opacity-70" strokeWidth={1.5} />
        {label && <span className="max-w-[80%] text-center text-xs font-medium">{label}</span>}
      </div>
      <ImageIcon className="sr-only" aria-hidden />
    </div>
  );
}
