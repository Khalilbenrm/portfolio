"use client";

import { useTheme } from "next-themes";
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
  SiGithub,
  SiGithubactions,
  SiApachekafka,
  SiSelenium,
  SiPostman,
  SiJunit5,
  SiC,
  SiCplusplus,
  SiJavascript,
  SiPostgresql,
  SiMysql,
} from "react-icons/si";
import { Boxes, Waypoints, MonitorSmartphone, Cloud, Bug, ClipboardCheck, FlaskConical, Repeat, Zap, Layers, Infinity as InfinityIcon } from "lucide-react";

// Playwright has no icon in react-icons/simple-icons, so we render the
// official multi-color SVG (fetched from playwright.dev) as a plain image
// instead of a currentColor-tintable icon component.
function PlaywrightIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/playwright-logo.svg" alt="Playwright" className={className} style={style} />;
}

const TECH_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  java: FaJava,
  spring: SiSpring,
  microservices: Boxes,
  "rest-api": Waypoints,
  nodejs: SiNodedotjs,
  python: SiPython,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  javafx: MonitorSmartphone,
  react: SiReact,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  docker: SiDocker,
  "github-actions": SiGithubactions,
  cloud: Cloud,
  linux: SiLinux,
  git: SiGit,
  github: SiGithub,
  iot: SiApachekafka,
  selenium: SiSelenium,
  postman: SiPostman,
  junit: SiJunit5,
  mockito: FlaskConical,
  bug: Bug,
  "test-design": ClipboardCheck,
  agile: Repeat,
  playwright: PlaywrightIcon,
  c: SiC,
  cpp: SiCplusplus,
  javascript: SiJavascript,
  "automated-testing": Zap,
  architecture: Layers,
  sdlc: InfinityIcon,
};

// Real brand colors, applied where the icon is an actual company/technology
// logo. Generic concept icons (Boxes, Waypoints, Bug, Repeat, ...) have no
// official color, so they fall back to the caller's className color.
// Playwright's logo is already multi-color in its own SVG, so it's excluded.
// GitHub's mark is near-black (#181717) and invisible on dark cards, so it's
// handled separately below with a theme-aware color instead of a fixed one.
const TECH_COLORS: Partial<Record<string, string>> = {
  java: "#ED8B00",
  spring: "#6DB33F",
  nodejs: "#339933",
  python: "#3776AB",
  postgresql: "#4169E1",
  mysql: "#4479A1",
  react: "#61DAFB",
  typescript: "#3178C6",
  tailwind: "#06B6D4",
  docker: "#2496ED",
  "github-actions": "#2088FF",
  linux: "#FCC624",
  git: "#F05032",
  iot: "#231F20",
  selenium: "#43B02A",
  postman: "#FF6C37",
  junit: "#25A162",
  c: "#A8B9CC",
  cpp: "#00599C",
  javascript: "#F7DF1E",
};

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const { resolvedTheme } = useTheme();
  const Icon = TECH_ICONS[name] ?? Boxes;
  const color = name === "github" ? (resolvedTheme === "dark" ? "#FFFFFF" : "#181717") : TECH_COLORS[name];
  return <Icon className={className} style={color ? { color } : undefined} />;
}
