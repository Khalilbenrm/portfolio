"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";

const SECTION_IDS = ["about", "experience", "education", "skills", "projects", "contact"] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export function useActiveSection(): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const visible = new Set<string>();
    const lastSectionId = SECTION_IDS[SECTION_IDS.length - 1];

    // Near the bottom of the page, the last section's bottom edge can pass
    // above the detection band with no next section to take over, leaving
    // `active` stuck at null even while that section fills the viewport.
    const isAtBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    const updateActive = () => {
      if (isAtBottom()) {
        setActive(lastSectionId);
        return;
      }
      setActive(SECTION_IDS.find((id) => visible.has(id)) ?? null);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }
        updateActive();
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [pathname]);

  return active;
}
