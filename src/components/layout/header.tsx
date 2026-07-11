"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useActiveSection } from "@/hooks/use-active-section";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SiteConfig } from "@/types/site";

const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "about", href: "/#about" },
  { key: "experience", href: "/#experience" },
  { key: "education", href: "/#education" },
  { key: "skills", href: "/#skills" },
  { key: "projects", href: "/#projects" },
  { key: "contact", href: "/#contact" },
] as const;

export function Header({ site }: { site: SiteConfig }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Nav");
  const tHeader = useTranslations("Header");
  const tHero = useTranslations("Hero");
  const pathname = usePathname();
  const activeSection = useActiveSection();

  // Link to "/" is a no-op when already on the home page (no route change),
  // so it would otherwise leave the visitor stranded wherever they'd scrolled to.
  const scrollToTopIfHome = (href: string) => {
    if (href === "/" && pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Hash-anchor items (#about, #skills, ...) all live on "/", so their active
  // state is driven by scroll position (useActiveSection) rather than the
  // pathname. "Home" is only active while at the top, before any section
  // has scrolled into view. "Projects" also stays active on the dedicated
  // /projects listing and case-study pages, even though the nav item itself
  // points at the home page's preview section rather than those routes.
  const isActive = (href: string) => {
    if (href === "/#projects") {
      return pathname.startsWith("/projects") || (pathname === "/" && activeSection === "projects");
    }
    if (href.includes("#")) {
      if (pathname !== "/") return false;
      return activeSection === href.split("#")[1];
    }
    if (href === "/") return pathname === "/" && activeSection === null;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--background)]">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="shrink-0 text-base font-bold tracking-tight"
          onClick={() => {
            setOpen(false);
            scrollToTopIfHome("/");
          }}
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => scrollToTopIfHome(item.href)}
              className={cn(
                "whitespace-nowrap text-sm transition-colors",
                isActive(item.href)
                  ? "font-semibold text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 xl:flex">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <Button href={site.cvUrl} variant="dark" size="sm" external className="hidden lg:inline-flex">
            {tHero("ctaCv")}
            <Download className="h-3.5 w-3.5" />
          </Button>
          <button
            type="button"
            aria-label={open ? tHeader("closeMenu") : tHeader("openMenu")}
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--foreground)] hover:bg-[var(--surface-hover)] lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="overflow-hidden border-t border-[var(--border)] bg-[var(--background)] lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => {
                    setOpen(false);
                    scrollToTopIfHome(item.href);
                  }}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive(item.href)
                      ? "font-semibold text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                  )}
                >
                  {t(item.key)}
                </Link>
              ))}
              <div className="mt-2 flex items-center gap-2 px-3">
                <LanguageSwitcher />
                <ThemeToggle />
                <Button href={site.cvUrl} variant="dark" size="sm" external className="flex-1">
                  {tHero("ctaCv")}
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
