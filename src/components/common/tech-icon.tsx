import { FaJava } from "react-icons/fa";
import {
  SiSpring,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiDocker,
  SiLinux,
  SiGit,
  SiApachekafka,
} from "react-icons/si";
import { Boxes, Waypoints, Database, MonitorSmartphone, Workflow, Cloud } from "lucide-react";

const TECH_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  java: FaJava,
  spring: SiSpring,
  microservices: Boxes,
  "rest-api": Waypoints,
  nodejs: SiNodedotjs,
  python: SiPython,
  sql: Database,
  javafx: MonitorSmartphone,
  react: SiReact,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  docker: SiDocker,
  cicd: Workflow,
  cloud: Cloud,
  linux: SiLinux,
  git: SiGit,
  iot: SiApachekafka,
};

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const Icon = TECH_ICONS[name] ?? Boxes;
  return <Icon className={className} />;
}
