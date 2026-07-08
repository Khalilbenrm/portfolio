export interface LocalizedString {
  fr: string;
  en: string;
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
}

export interface Skill {
  name: string;
  category: string;
  icon: string;
}

export type CertificationStatus = "obtained" | "in-progress";

export interface Certification {
  name: string;
  issuer?: string;
  status: CertificationStatus;
  icon: string;
  logo?: string;
  url?: string;
}
