import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import siteJson from "@/content/site.json";
import skillsJson from "@/content/skills.json";
import type { Locale } from "@/i18n/routing";
import type { RawSiteConfig, SiteConfig, Skill } from "@/types/site";
import type { InProgressProject, Project, ProjectFrontmatter } from "@/types/project";
import type { EducationEntry, ExperienceEntry } from "@/types/experience";

const CONTENT_DIR = path.join(process.cwd(), "src/content");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");

export function getSiteConfig(locale: Locale): SiteConfig {
  const raw = siteJson as RawSiteConfig & { _meta?: unknown };
  const { tagline, shortTagline, cvUrl, qaTerminal, ...rest } = raw;
  return {
    ...rest,
    tagline: tagline[locale],
    shortTagline: shortTagline[locale],
    cvUrl: cvUrl[locale],
    qaTerminal: {
      title: qaTerminal.title,
      lines: qaTerminal.lines[locale],
      summary: qaTerminal.summary[locale],
    },
  };
}

export function getSkills(): Skill[] {
  return (skillsJson as { skills: Skill[] }).skills;
}

export function getInProgressProjects(locale: Locale): InProgressProject[] {
  const filePath = path.join(CONTENT_DIR, `projects-in-progress.${locale}.json`);
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as { items: InProgressProject[] };
  return raw.items;
}

export function getAboutContent(locale: Locale) {
  const filePath = path.join(CONTENT_DIR, `about.${locale}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    headline: data.headline as string,
    focus: data.focus as string,
    yearsNote: data.yearsNote as string,
    content: content.trim(),
  };
}

export function getExperience(locale: Locale): ExperienceEntry[] {
  const filePath = path.join(CONTENT_DIR, `experience.${locale}.json`);
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as { items: ExperienceEntry[] };
  return raw.items;
}

export function getEducation(locale: Locale): EducationEntry[] {
  const filePath = path.join(CONTENT_DIR, `education.${locale}.json`);
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as { items: EducationEntry[] };
  return raw.items;
}

export function getAllProjects(locale: Locale): Project[] {
  const suffix = `.${locale}.md`;
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(suffix));
  const projects = files.map((file) => {
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    return {
      ...(data as ProjectFrontmatter),
      about: content.trim(),
    };
  });
  return projects.sort((a, b) => a.name.localeCompare(b.name));
}

export function getProjectBySlug(locale: Locale, slug: string): Project | undefined {
  return getAllProjects(locale).find((p) => p.slug === slug);
}

export function getFeaturedProjects(locale: Locale): Project[] {
  return getAllProjects(locale).filter((p) => p.featured);
}
