"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Download, Mail } from "lucide-react";
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

  return (
    // min-h matches the viewport minus the sticky header (h-16) so the hero fills
    // the screen exactly on load, with no sliver of the next section peeking in.
    <section className="bg-grid relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in srgb, var(--accent) 16%, transparent) 0%, transparent 70%)",
        }}
      />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center sm:gap-7 sm:py-16"
      >
        <motion.div variants={item}>
          <Image
            src={site.photoUrl}
            alt={t("profilePhoto")}
            width={144}
            height={144}
            priority
            className="h-16 w-16 rounded-full border border-[var(--card-border)] object-cover sm:h-28 sm:w-28 lg:h-36 lg:w-36"
          />
        </motion.div>

        <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted-foreground)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {t("availableBadge")}
        </motion.div>

        {/* Static, not animated: LCP candidates shouldn't sit at opacity:0 while staggered siblings wait their turn. */}
        <h1 className="max-w-3xl text-2xl font-semibold tracking-tight sm:text-4xl lg:text-6xl">
          {site.name}
          <span className="block text-gradient">{site.title}</span>
        </h1>

        <p className="max-w-2xl text-balance text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
          {site.tagline}
        </p>

        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <Button href="/projects" size="lg" className="h-9 px-4 text-sm sm:h-12 sm:px-8 sm:text-base">
            {t("ctaProjects")}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href={site.cvUrl} variant="outline" size="lg" external className="h-9 px-4 text-sm sm:h-12 sm:px-8 sm:text-base">
            <Download className="h-4 w-4" />
            {t("ctaCv")}
          </Button>
          <Button href="/#contact" variant="ghost" size="lg" className="h-9 px-4 text-sm sm:h-12 sm:px-8 sm:text-base">
            <Mail className="h-4 w-4" />
            {t("ctaContact")}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
