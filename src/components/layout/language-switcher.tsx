"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const activeLocale = useLocale();
  const t = useTranslations("Header");

  return (
    <div
      role="group"
      aria-label={t("language")}
      className="flex items-center gap-0.5 rounded-full border border-[var(--card-border)] bg-[var(--surface)] p-0.5"
    >
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-colors",
            locale === activeLocale
              ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          )}
          aria-current={locale === activeLocale ? "true" : undefined}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
