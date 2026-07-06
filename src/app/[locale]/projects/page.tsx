import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { InProgressCard } from "@/components/projects/in-progress-card";
import { getAllProjects, getInProgressProjects } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ProjectsPage" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("ProjectsPage");
  const projects = getAllProjects(locale);
  const inProgress = getInProgressProjects(locale);

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      {inProgress.length > 0 && (
        <div className="mt-24">
          <SectionHeading eyebrow={t("upcomingEyebrow")} title={t("upcomingTitle")} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.08}>
                <InProgressCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
