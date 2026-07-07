export interface ExperienceEntry {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  period: string;
  current: boolean;
  bullets: string[];
  projectSlug?: string;
}

export interface EducationEntry {
  school: string;
  degree: string;
  period: string;
}
