"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useId } from "react";
import { ArrowRight, ArrowUpRight, Download, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { SiteConfig } from "@/types/site";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

export function Hero({ site }: { site: SiteConfig }) {
  const t = useTranslations("Hero");
  const circleId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const badgeText = `${t("ctaContact")} • ${t("ctaContact")} • `.toUpperCase();

  const socials = [
    { href: site.github, icon: FaGithub, label: "GitHub" },
    { href: site.linkedin, icon: FaLinkedin, label: "LinkedIn" },
    { href: `mailto:${site.email}`, icon: Mail, label: "Email" },
  ];

  return (
    <section className="relative overflow-hidden px-6 pb-12 pt-8 sm:pb-20 sm:pt-24">
      {/* soft background blobs */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-60 blur-3xl"
        style={{ background: "var(--blob-a)" }}
      />
      <div
        className="pointer-events-none absolute -top-10 right-0 h-64 w-64 rounded-full opacity-50 blur-3xl"
        style={{ background: "var(--blob-b)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full opacity-50 blur-3xl"
        style={{ background: "var(--blob-c)" }}
      />

      {/* decorative corner arches */}
      <div className="pointer-events-none absolute left-10 top-36 hidden h-20 w-20 rounded-tl-full border-l-2 border-t-2 border-[var(--card-border)] lg:block" />
      <div className="pointer-events-none absolute bottom-24 right-16 hidden h-16 w-16 rounded-tl-full border-l-2 border-t-2 border-[var(--card-border)] lg:block" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <div className="absolute left-0 top-20 hidden flex-col items-center gap-5 lg:flex">
          {socials.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        <motion.div variants={item} className="relative">
          <svg
            className="pointer-events-none absolute -right-10 -top-6 h-44 w-44 text-[var(--accent)] sm:-right-14 sm:h-56 sm:w-56"
            viewBox="0 0 200 220"
            fill="none"
          >
            <path
              d="M20,190 C-20,140 30,70 90,55 C150,40 175,10 158,-8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          <div className="relative h-36 w-32 overflow-hidden rounded-t-full border border-[var(--card-border)] bg-[var(--surface)] sm:h-64 sm:w-52">
            <Image
              src={site.photoUrl}
              alt={t("profilePhoto")}
              fill
              priority
              className="object-cover grayscale"
            />
          </div>

          <Link
            href="/#contact"
            className="group absolute -right-6 -top-6 flex h-20 w-20 items-center justify-center sm:-right-8 sm:-top-8 sm:h-24 sm:w-24"
          >
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full animate-[spin_16s_linear_infinite] text-[var(--muted-foreground)]"
            >
              <defs>
                <path id={`circle-${circleId}`} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
              </defs>
              <text fontSize="7.2" letterSpacing="1.5" fill="currentColor">
                <textPath href={`#circle-${circleId}`}>{badgeText}</textPath>
              </text>
            </svg>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] transition-transform group-hover:scale-110">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>

        <motion.div variants={item} className="mt-4 sm:mt-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-6xl">{site.name}</h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)] sm:mt-3">
            {site.title}
          </p>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-4 max-w-xl text-balance text-base leading-relaxed text-[var(--muted-foreground)] sm:mt-6 sm:text-lg"
        >
          {site.tagline}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-4 py-1.5 text-xs font-medium text-[var(--muted-foreground)] sm:mt-5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          {t("availableBadge")}
        </motion.div>

        <motion.div variants={item} className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-3">
          <Button href="/projects" size="lg" className="h-10 px-5 text-sm sm:h-12 sm:px-8 sm:text-base">
            {t("ctaProjects")}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href={site.cvUrl} variant="dark" size="lg" external className="h-10 px-5 text-sm sm:h-12 sm:px-8 sm:text-base">
            <Download className="h-4 w-4" />
            {t("ctaCv")}
          </Button>
          <Button href="/#contact" variant="outline" size="lg" className="h-10 px-5 text-sm sm:h-12 sm:px-8 sm:text-base">
            <Mail className="h-4 w-4" />
            {t("ctaContact")}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
