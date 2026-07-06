import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Star, GitFork, Users, ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getGithubStats } from "@/lib/github";

export async function GithubStats({ username, githubUrl }: { username: string; githubUrl: string }) {
  const [stats, t] = await Promise.all([getGithubStats(username), getTranslations("GithubStats")]);

  return (
    <section id="github" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
          className="max-w-xl"
        />
        <Button href={githubUrl} variant="outline" external>
          <FaGithub className="h-4 w-4" />
          {t("viewProfile")}
        </Button>
      </div>

      {!stats ? (
        <Reveal delay={0.1} className="mt-10">
          <Card className="p-8 text-sm text-[var(--muted-foreground)]">
            {t("error")}{" "}
            <a href={githubUrl} className="text-[var(--accent)] underline" target="_blank" rel="noopener noreferrer">
              {t("errorLinkText")}
            </a>
            .
          </Card>
        </Reveal>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-1">
            <Card className="flex h-full flex-col items-center gap-4 p-8 text-center">
              <Image
                src={stats.profile.avatarUrl}
                alt={stats.profile.name ?? stats.profile.login}
                width={88}
                height={88}
                className="rounded-full border border-[var(--card-border)]"
                unoptimized
              />
              <div>
                <p className="font-semibold">{stats.profile.name ?? stats.profile.login}</p>
                <p className="text-sm text-[var(--muted-foreground)]">@{stats.profile.login}</p>
              </div>
              <div className="grid w-full grid-cols-3 divide-x divide-[var(--border)] border-t border-[var(--border)] pt-4">
                <Stat icon={<FaGithub className="h-4 w-4" />} value={stats.profile.publicRepos} label={t("statRepos")} />
                <Stat icon={<Star className="h-4 w-4" />} value={stats.totalStars} label={t("statStars")} />
                <Stat icon={<Users className="h-4 w-4" />} value={stats.profile.followers} label={t("statFollowers")} />
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-2">
            <Card className="h-full p-8">
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                {t("topLanguages")}
              </h3>
              <div className="flex flex-col gap-4">
                {stats.topLanguages.map((lang) => (
                  <div key={lang.name}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-[var(--muted-foreground)]">{lang.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-hover)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-3">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
              {t("popularRepos")}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.popularRepos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-5 transition-colors hover:bg-[var(--surface-hover)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-medium">{repo.name}</p>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm text-[var(--muted-foreground)]">
                    {repo.description ?? t("noDescription")}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                    {repo.language && <span>{repo.language}</span>}
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" /> {repo.stargazersCount}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5" /> {repo.forksCount}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      )}
    </section>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2">
      <span className="text-[var(--accent)]">{icon}</span>
      <span className="font-semibold">{value}</span>
      <span className="text-xs text-[var(--muted-foreground)]">{label}</span>
    </div>
  );
}
