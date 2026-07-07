import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { Markdown } from "@/components/common/markdown";

export function About({
  headline,
  focus,
  content,
  photoUrl,
}: {
  headline: string;
  focus: string;
  content: string;
  photoUrl: string;
}) {
  const t = useTranslations("About");

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading eyebrow={t("eyebrow")} title={headline} description={focus} />
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        {/* Not wrapped in Reveal: likely LCP candidate, see case-study/about.tsx. */}
        <Markdown content={content} className="text-base" />
        <Reveal delay={0.1}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--surface)] lg:sticky lg:top-24">
            <Image
              src={photoUrl}
              alt={t("illustration")}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
