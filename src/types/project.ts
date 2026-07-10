export type ProjectStatus = "completed" | "in-progress";

export interface TechStackCategory {
  category: string;
  items: string[];
}

export type ArchitectureFlowKind = "client" | "gateway" | "service" | "data" | "observability";

export interface ArchitectureFlowNode {
  icon: string;
  label: string;
  specs?: string[];
}

export interface ArchitectureFlowColumn {
  label: string;
  kind: ArchitectureFlowKind;
  edgeLabel?: string;
  nodes: ArchitectureFlowNode[];
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
  techStack: TechStackCategory[];
  architectureFlow: ArchitectureFlowColumn[];
  architectureInfra?: ArchitectureFlowNode[];
  architectureSummary: string[];
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
