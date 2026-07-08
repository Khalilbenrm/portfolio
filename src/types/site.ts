export interface LocalizedString {
  fr: string;
  en: string;
}

export interface QaTerminalLine {
  text: string;
  status: "pass" | "pending";
}

export interface RawQaTerminal {
  title: string;
  lines: {
    fr: QaTerminalLine[];
    en: QaTerminalLine[];
  };
  summary: LocalizedString;
}

export interface QaTerminal {
  title: string;
  lines: QaTerminalLine[];
  summary: string;
}

export interface RawSiteConfig {
  name: string;
  shortName: string;
  title: string;
  tagline: LocalizedString;
  shortTagline: LocalizedString;
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  github: string;
  githubUsername: string;
  linkedin: string;
  cvUrl: LocalizedString;
  photoUrl: string;
  domain: string;
  qaTerminal: RawQaTerminal;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  title: string;
  tagline: string;
  shortTagline: string;
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  github: string;
  githubUsername: string;
  linkedin: string;
  cvUrl: string;
  photoUrl: string;
  domain: string;
  qaTerminal: QaTerminal;
}

export type SkillLevel = "learning" | "proficient" | "advanced" | "expert";

export interface Skill {
  name: string;
  category: string;
  level: number; // 0-100
  levelLabel: SkillLevel;
  icon: string;
  
}
