import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { Markdown } from "@/components/common/markdown";
import { Placeholder } from "@/components/common/placeholder";

export function About({
  headline,
  focus,
  content,
}: {
  headline: string;
  focus: string;
  content: string;
}) {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading eyebrow="À propos" title={headline} description={focus} />
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        {/* Not wrapped in Reveal: likely LCP candidate, see case-study/about.tsx. */}
        <Markdown content={content} className="text-base" />
        <Reveal delay={0.1}>
          <Placeholder label="Photo / illustration" icon="Aperture" className="lg:sticky lg:top-24" />
        </Reveal>
      </div>
    </section>
  );
}
