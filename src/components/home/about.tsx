import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { Markdown } from "@/components/common/markdown";
import { AboutTerminal } from "./about-terminal";

export function About({
  headline,
  focus,
  content,
}: {
  headline: string;
  focus: string;
  content: string;
}) {
  const t = useTranslations("About");

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading eyebrow={t("eyebrow")} title={headline} description={focus} />
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        {/* Not wrapped in Reveal: likely LCP candidate, see case-study/about.tsx. */}
        <Markdown content={content} className="text-base" />
        <Reveal delay={0.1}>
          <AboutTerminal />
        </Reveal>
      </div>
    </section>
  );
}
