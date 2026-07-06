export interface SiteConfig {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  github: string;
  githubUsername: string;
  linkedin: string;
  cvUrl: string;
  domain: string;
  nav: { label: string; href: string }[];
}

export type SkillLevel = "learning" | "proficient" | "advanced" | "expert";

export interface Skill {
  name: string;
  category: string;
  level: number; // 0-100
  levelLabel: SkillLevel;
}
