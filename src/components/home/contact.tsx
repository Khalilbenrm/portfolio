import { useTranslations } from "next-intl";
import { Mail, Download, Phone, ArrowUpRight, MessageSquare } from "lucide-react";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { Card } from "@/components/ui/card";
import { ContactForm } from "./contact-form";
import type { SiteConfig } from "@/types/site";

export function Contact({ site }: { site: SiteConfig }) {
  const t = useTranslations("Contact");

  const whatsappDigits = site.whatsapp.replace(/\D/g, "");

  const links: { label: string; value: string; href: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: t("linkEmail"), value: site.email, href: `mailto:${site.email}`, icon: Mail },
    { label: t("linkWhatsapp"), value: site.whatsapp, href: `https://wa.me/${whatsappDigits}`, icon: FaWhatsapp },
    { label: t("linkPhone"), value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}`, icon: Phone },
    { label: t("linkLinkedin"), value: t("linkLinkedinHint"), href: site.linkedin, icon: FaLinkedin },
    { label: t("linkGithub"), value: `@${site.githubUsername}`, href: site.github, icon: FaGithub },
    { label: t("linkCv"), value: t("linkCvHint"), href: site.cvUrl, icon: Download },
  ];

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      <Reveal className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-4 py-1.5 text-xs font-medium text-[var(--muted-foreground)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        {t("responseNote")}
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div className="grid gap-3 sm:grid-cols-2">
          {links.map(({ label, value, href, icon: Icon }, i) => (
            <Reveal key={label} delay={i * 0.05}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex h-full items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-foreground)]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="truncate text-xs text-[var(--muted-foreground)]">{value}</span>
                </span>
                <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-[var(--muted-foreground)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold">{t("formTitle")}</h3>
                <p className="text-xs text-[var(--muted-foreground)]">{t("formSubtitle")}</p>
              </div>
            </div>
            <ContactForm email={site.email} />
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
