import { useTranslations } from "next-intl";
import Link from "next/link";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import type { SiteConfig } from "@/types/site";

export function Footer({ site }: { site: SiteConfig }) {
  const t = useTranslations("Footer");

  return (
    <footer className="mt-32 border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 sm:flex-row sm:justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} {site.name}. {t("rights")}
        </p>
        <div className="flex items-center gap-4">
          <Link
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            <FaGithub className="h-5 w-5" />
          </Link>
          <Link
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            <FaLinkedin className="h-5 w-5" />
          </Link>
          <a
            href={`mailto:${site.email}`}
            aria-label="Email"
            className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
