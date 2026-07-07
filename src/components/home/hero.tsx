"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Download, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
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

  const socials = [
    { href: site.github, icon: FaGithub, label: "GitHub" },
    { href: site.linkedin, icon: FaLinkedin, label: "LinkedIn" },
    { href: `mailto:${site.email}`, icon: Mail, label: "Email" },
  ];

  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] flex-col justify-center overflow-hidden px-6 pb-12 pt-8 sm:pb-20 sm:pt-24">
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

        <motion.div variants={item} className="relative -mt-6 w-80 sm:-mt-10 sm:w-[27rem]">
          <div
            className="pointer-events-none absolute inset-x-6 top-6 -z-10 aspect-square rounded-full opacity-80 blur-2xl"
            style={{ background: "var(--surface)" }}
          />
          <Image
            src="/personal-photo-cutout.png"
            alt={t("profilePhoto")}
            width={992}
            height={1077}
            priority
            className="relative h-auto w-full object-contain"
          />
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
