import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { Skills } from "@/components/home/skills";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { GithubStats } from "@/components/home/github-stats";
import { Contact } from "@/components/home/contact";
import { Separator } from "@/components/ui/separator";
import {
  getSiteConfig,
  getSkills,
  getFeaturedProjects,
  getAboutContent,
} from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const site = getSiteConfig(locale);
  const skills = getSkills();
  const projects = getFeaturedProjects(locale);
  const about = getAboutContent(locale);

  return (
    <>
      <Hero site={site} />
      <Separator />
      <About headline={about.headline} focus={about.focus} content={about.content} />
      <Separator />
      <Skills skills={skills} />
      <Separator />
      <FeaturedProjects projects={projects} />
      <Separator />
      <GithubStats username={site.githubUsername} githubUrl={site.github} />
      <Separator />
      <Contact site={site} />
    </>
  );
}
