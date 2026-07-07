"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useActiveSection } from "@/hooks/use-active-section";

export function SectionTitleSync({ siteName, baseTitle }: { siteName: string; baseTitle: string }) {
  const t = useTranslations("Nav");
  const active = useActiveSection();

  useEffect(() => {
    document.title = active ? `${siteName} | ${t(active)}` : baseTitle;
  }, [active, siteName, baseTitle, t]);

  return null;
}
