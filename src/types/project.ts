export type ProjectStatus = "completed" | "in-progress";

export interface TechStackCategory {
  category: string;
  items: string[];
}

export interface ProjectFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ArchitectureLayer {
  name: string;
  responsibility: string;
}

export interface DesignPattern {
  name: string;
  description: string;
}

export interface SolidPrinciple {
  principle: string;
  application: string;
}

export interface MermaidDiagram {
  title: string;
  description?: string;
  diagram: string;
}

export interface StructureNote {
  path: string;
  description: string;
}

export interface WorkflowStep {
  step: string;
  description: string;
}

export interface Challenge {
  problem: string;
  solution: string;
}

export interface Optimizations {
  performance: string[];
  security: string[];
  maintainability: string[];
  scalability: string[];
  quality: string[];
}

export interface GalleryItem {
  caption: string;
}

export interface ProjectFrontmatter {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: ProjectStatus;
  featured: boolean;
  github: string;
  demo?: string;
  cover: string;
  techStack: TechStackCategory[];
  features: ProjectFeature[];
  architecture: {
    overview: string;
    layers: ArchitectureLayer[];
    patterns: DesignPattern[];
    solid: SolidPrinciple[];
    diagrams: MermaidDiagram[];
  };
  structure: {
    tree: string;
    notes: StructureNote[];
  };
  workflow: WorkflowStep[];
  challenges: Challenge[];
  optimizations: Optimizations;
  gallery: GalleryItem[];
  learnings: string[];
  caveats?: string[];
}

export interface Project extends ProjectFrontmatter {
  about: string;
}

export interface InProgressProject {
  slug: string;
  name: string;
  description: string;
  tech: string[];
  progress: number;
  status: "coming-soon" | "in-development";
}
