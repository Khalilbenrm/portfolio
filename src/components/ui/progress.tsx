import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-hover)]", className)}
    >
      <div
        className={cn("h-full rounded-full bg-[var(--accent)] transition-[width] duration-700 ease-out", barClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
