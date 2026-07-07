"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useActiveSection } from "@/hooks/use-active-section";

export function SectionTitleSync({ siteName }: { siteName: string }) {
  const t = useTranslations("Nav");
  const active = useActiveSection();

  useEffect(() => {
    document.title = `${siteName} | ${t(active ?? "home")}`;
  }, [active, siteName, t]);

  return null;
}
