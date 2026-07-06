import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import siteJson from "@/content/site.json";
import skillsJson from "@/content/skills.json";
import inProgressJson from "@/content/projects-in-progress.json";
import type { SiteConfig, Skill } from "@/types/site";
import type { InProgressProject, Project, ProjectFrontmatter } from "@/types/project";

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects");
const ABOUT_PATH = path.join(process.cwd(), "src/content/about.md");

export function getSiteConfig(): SiteConfig {
  const { _meta, ...config } = siteJson as SiteConfig & { _meta?: unknown };
  void _meta;
  return config;
}

export function getSkills(): Skill[] {
  return (skillsJson as { skills: Skill[] }).skills;
}

export function getInProgressProjects(): InProgressProject[] {
  return (inProgressJson as { items: InProgressProject[] }).items;
}

export function getAboutContent() {
  const raw = fs.readFileSync(ABOUT_PATH, "utf8");
  const { data, content } = matter(raw);
  return {
    headline: data.headline as string,
    focus: data.focus as string,
    yearsNote: data.yearsNote as string,
    content: content.trim(),
  };
}

export function getAllProjects(): Project[] {
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".md"));
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

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}
