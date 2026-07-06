export interface LocalizedString {
  fr: string;
  en: string;
}

export interface RawSiteConfig {
  name: string;
  title: string;
  tagline: LocalizedString;
  shortTagline: LocalizedString;
  location: string;
  email: string;
  github: string;
  githubUsername: string;
  linkedin: string;
  cvUrl: string;
  domain: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  tagline: string;
  shortTagline: string;
  location: string;
  email: string;
  github: string;
  githubUsername: string;
  linkedin: string;
  cvUrl: string;
  domain: string;
}

export type SkillLevel = "learning" | "proficient" | "advanced" | "expert";

export interface Skill {
  name: string;
  category: string;
  level: number; // 0-100
  levelLabel: SkillLevel;
  icon: string;
}
