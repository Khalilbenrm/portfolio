import { SectionHeading } from "@/components/common/section-heading";
import { cn } from "@/lib/utils";

export function CaseStudySection({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-6xl scroll-mt-24 px-6 py-16", className)}>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-10">{children}</div>
    </section>
  );
}
