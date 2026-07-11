import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { Experience } from "@/components/home/experience";
import { Skills } from "@/components/home/skills";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Education } from "@/components/home/education";
import { Contact } from "@/components/home/contact";
import { SectionTitleSync } from "@/components/home/section-title-sync";
import { HashScroll } from "@/components/home/hash-scroll";
import { Separator } from "@/components/ui/separator";
import {
  getSiteConfig,
  getSkills,
  getCertifications,
  getFeaturedProjects,
  getAboutContent,
  getExperience,
  getEducation,
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
  const certifications = getCertifications();
  const projects = getFeaturedProjects(locale);
  const about = getAboutContent(locale);
  const experience = getExperience(locale);
  const education = getEducation(locale);

  return (
    <>
      <SectionTitleSync siteName={site.shortName} />
      <HashScroll />
      <Hero site={site} />
      <Separator />
      <About headline={about.headline} focus={about.focus} content={about.content} />
      <Separator />
      <Experience items={experience} />
      <Separator />
      <Education items={education} />
      <Separator />
      <Skills skills={skills} certifications={certifications} />
      <Separator />
      <FeaturedProjects projects={projects} />
      <Separator />
      <Contact site={site} />
    </>
  );
}
