export interface GithubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  htmlUrl: string;
}

export interface GithubRepo {
  name: string;
  htmlUrl: string;
  description: string | null;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  fork: boolean;
  updatedAt: string;
}

export interface GithubStats {
  profile: GithubProfile;
  popularRepos: GithubRepo[];
  topLanguages: { name: string; count: number; percentage: number }[];
  totalStars: number;
}

const GITHUB_API = "https://api.github.com";

async function githubFetch<T>(pathname: string): Promise<T | null> {
  try {
    const res = await fetch(`${GITHUB_API}${pathname}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getGithubStats(username: string): Promise<GithubStats | null> {
  const [rawProfile, rawRepos] = await Promise.all([
    githubFetch<Record<string, unknown>>(`/users/${username}`),
    githubFetch<Record<string, unknown>[]>(`/users/${username}/repos?sort=updated&per_page=100`),
  ]);

  if (!rawProfile || !rawRepos) return null;

  const profile: GithubProfile = {
    login: rawProfile.login as string,
    name: (rawProfile.name as string | null) ?? null,
    avatarUrl: rawProfile.avatar_url as string,
    bio: (rawProfile.bio as string | null) ?? null,
    publicRepos: rawProfile.public_repos as number,
    followers: rawProfile.followers as number,
    following: rawProfile.following as number,
    htmlUrl: rawProfile.html_url as string,
  };

  const repos: GithubRepo[] = rawRepos.map((r) => ({
    name: r.name as string,
    htmlUrl: r.html_url as string,
    description: (r.description as string | null) ?? null,
    language: (r.language as string | null) ?? null,
    stargazersCount: r.stargazers_count as number,
    forksCount: r.forks_count as number,
    fork: r.fork as boolean,
    updatedAt: r.updated_at as string,
  }));

  const nonForks = repos.filter((r) => !r.fork);

  const popularRepos = [...nonForks]
    .sort((a, b) => b.stargazersCount - a.stargazersCount || (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 6);

  const languageCounts = new Map<string, number>();
  for (const repo of nonForks) {
    if (!repo.language) continue;
    languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
  }
  const totalWithLanguage = [...languageCounts.values()].reduce((a, b) => a + b, 0) || 1;
  const topLanguages = [...languageCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalWithLanguage) * 100),
    }));

  const totalStars = nonForks.reduce((sum, r) => sum + r.stargazersCount, 0);

  return { profile, popularRepos, topLanguages, totalStars };
}
