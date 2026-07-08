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
  SiSelenium,
  SiPostman,
  SiJunit5,
} from "react-icons/si";
import { Boxes, Waypoints, Database, MonitorSmartphone, Workflow, Cloud, Bug, ClipboardCheck, FlaskConical, Repeat, Drama } from "lucide-react";

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
  selenium: SiSelenium,
  postman: SiPostman,
  junit: SiJunit5,
  mockito: FlaskConical,
  bug: Bug,
  "test-design": ClipboardCheck,
  agile: Repeat,
  playwright: Drama,
};

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const Icon = TECH_ICONS[name] ?? Boxes;
  return <Icon className={className} />;
}
