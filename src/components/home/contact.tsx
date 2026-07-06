import { Github, Linkedin, Mail, Download } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { Card } from "@/components/ui/card";
import { ContactForm } from "./contact-form";
import type { SiteConfig } from "@/types/site";

export function Contact({ site }: { site: SiteConfig }) {
  const links = [
    { label: "GitHub", href: site.github, icon: Github },
    { label: "LinkedIn", href: site.linkedin, icon: Linkedin },
    { label: "Email", href: `mailto:${site.email}`, icon: Mail },
    { label: "CV", href: site.cvUrl, icon: Download },
  ];

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading
        eyebrow="Contact"
        title="Discutons de votre prochain projet"
        description="Que ce soit pour une opportunité, une collaboration ou simplement échanger — n'hésitez pas."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Reveal className="flex flex-col gap-3">
          {links.map(({ label, href, icon: Icon }) => {
            const isPlaceholder = href === "#";
            return (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-disabled={isPlaceholder}
                className="group flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] px-6 py-4 transition-colors hover:bg-[var(--surface-hover)]"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4.5 w-4.5 text-[var(--accent)]" />
                  <span className="font-medium">{label}</span>
                </span>
                {isPlaceholder && (
                  <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--muted-foreground)]">
                    Bientôt disponible
                  </span>
                )}
              </a>
            );
          })}
        </Reveal>
        <Reveal delay={0.1}>
          <Card className="p-8">
            <ContactForm email={site.email} />
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
