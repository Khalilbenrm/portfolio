import { cn } from "@/lib/utils";

const GRADIENTS: Record<string, string> = {
  compass: "linear-gradient(135deg, #16321f 0%, #3f8f68 55%, #8fd6b2 100%)",
  "smart-building-iot": "linear-gradient(135deg, #12283a 0%, #2f6690 55%, #8ecbe8 100%)",
};

const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #3a2a1c 0%, #b5763f 55%, #f0c48f 100%)",
  "linear-gradient(135deg, #2a1c3a 0%, #7c4fb5 55%, #cba5f0 100%)",
];

function gradientFor(slug: string): string {
  if (GRADIENTS[slug]) return GRADIENTS[slug];
  const hash = [...slug].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return FALLBACK_GRADIENTS[hash % FALLBACK_GRADIENTS.length];
}

export function ProjectCover({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  return (
    <div
      className={cn("relative flex aspect-video w-full items-center justify-center overflow-hidden p-6", className)}
      style={{ background: gradientFor(slug) }}
    >
      <span className="text-center text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
        {name}
      </span>
    </div>
  );
}
