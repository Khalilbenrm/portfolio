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

export default function Home() {
  const site = getSiteConfig();
  const skills = getSkills();
  const projects = getFeaturedProjects();
  const about = getAboutContent();

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
