import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CaseStudyHero } from "@/components/projects/case-study/hero";
import { CaseStudyAbout } from "@/components/projects/case-study/about";
import { Features } from "@/components/projects/case-study/features";
import { TechStack } from "@/components/projects/case-study/tech-stack";
import { Architecture } from "@/components/projects/case-study/architecture";
import { Structure } from "@/components/projects/case-study/structure";
import { Workflow } from "@/components/projects/case-study/workflow";
import { Challenges } from "@/components/projects/case-study/challenges";
import { Optimizations } from "@/components/projects/case-study/optimizations";
import { Gallery } from "@/components/projects/case-study/gallery";
import { Learnings } from "@/components/projects/case-study/learnings";
import { Caveats } from "@/components/projects/case-study/caveats";
import { CaseStudyCta } from "@/components/projects/case-study/cta";
import { Separator } from "@/components/ui/separator";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getAllProjects(params.locale as Locale).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectBySlug(locale, slug);
  if (!project) return {};

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = l === routing.defaultLocale ? `/projects/${slug}` : `/${l}/projects/${slug}`;
  }

  return {
    title: project.name,
    description: project.description,
    alternates: { languages },
    openGraph: { title: project.name, description: project.description },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProjectBySlug(locale, slug);
  if (!project) notFound();

  return (
    <>
      <CaseStudyHero project={project} />
      <Separator className="mx-auto mt-16 max-w-6xl" />
      <CaseStudyAbout content={project.about} />
      <Separator className="mx-auto max-w-6xl" />
      <Features features={project.features} />
      <Separator className="mx-auto max-w-6xl" />
      <TechStack stack={project.techStack} />
      <Separator className="mx-auto max-w-6xl" />
      <Architecture architecture={project.architecture} />
      <Separator className="mx-auto max-w-6xl" />
      <Structure structure={project.structure} />
      <Separator className="mx-auto max-w-6xl" />
      <Workflow steps={project.workflow} />
      <Separator className="mx-auto max-w-6xl" />
      <Challenges challenges={project.challenges} />
      <Separator className="mx-auto max-w-6xl" />
      <Optimizations optimizations={project.optimizations} />
      <Separator className="mx-auto max-w-6xl" />
      <Gallery items={project.gallery} />
      <Separator className="mx-auto max-w-6xl" />
      <Learnings items={project.learnings} />
      {project.caveats && project.caveats.length > 0 && (
        <>
          <Separator className="mx-auto max-w-6xl" />
          <Caveats items={project.caveats} />
        </>
      )}
      <CaseStudyCta project={project} />
    </>
  );
}
