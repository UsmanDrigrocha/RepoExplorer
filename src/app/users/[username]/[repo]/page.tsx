import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star,
  GitFork,
  Eye,
  CircleAlert,
  Scale,
  Globe,
  ExternalLink,
} from "lucide-react";
import {
  getRepo,
  getRepoLanguages,
  listRepoCommits,
} from "@/lib/github/client";
import { GithubApiError } from "@/lib/github/errors";
import type {
  GithubCommit,
  GithubLanguages,
  GithubRepo,
} from "@/lib/github/schemas";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LanguageBar } from "@/components/features/language-bar";
import { CommitList } from "@/components/features/commit-list";
import { formatCompactNumber, formatDate } from "@/lib/format";

interface PageProps {
  params: Promise<{ username: string; repo: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username, repo } = await params;
  return { title: `${username}/${repo} — Repo Explorer` };
}

async function loadRepoDetail(
  username: string,
  repoName: string,
): Promise<{
  repo: GithubRepo;
  languages: GithubLanguages;
  commits: GithubCommit[];
}> {
  try {
    const [{ data: repo }, { data: languages }, { data: commits }] =
      await Promise.all([
        getRepo(username, repoName),
        getRepoLanguages(username, repoName),
        listRepoCommits(username, repoName),
      ]);
    return { repo, languages, commits };
  } catch (error) {
    if (error instanceof GithubApiError && error.kind === "not_found") {
      notFound();
    }
    throw error;
  }
}

export default async function RepoPage({ params }: PageProps) {
  const { username, repo: repoName } = await params;
  const { repo, languages, commits } = await loadRepoDetail(username, repoName);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-muted-foreground text-sm">
        <Link
          href={`/users/${username}`}
          className="hover:text-foreground hover:underline"
        >
          {username}
        </Link>
        <span className="mx-1.5">/</span>
      </p>
      <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{repo.name}</h1>
        <div className="flex items-center gap-2">
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noreferrer"
              className="border-border/60 hover:border-foreground/30 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <Globe className="size-3.5" />
              Website
            </a>
          )}
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="bg-foreground text-background flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-90"
          >
            <ExternalLink className="size-3.5" />
            View on GitHub
          </a>
        </div>
      </div>

      {repo.description && (
        <p className="text-foreground/90 mt-3 max-w-2xl text-sm">
          {repo.description}
        </p>
      )}

      {repo.topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {repo.topics.map((topic) => (
            <Badge
              key={topic}
              variant="secondary"
              className="rounded-full font-normal"
            >
              {topic}
            </Badge>
          ))}
        </div>
      )}

      <div className="text-muted-foreground mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <span className="flex items-center gap-1.5">
          <Star className="size-4" />
          <span className="text-foreground font-medium">
            {formatCompactNumber(repo.stargazers_count)}
          </span>
          stars
        </span>
        <span className="flex items-center gap-1.5">
          <GitFork className="size-4" />
          <span className="text-foreground font-medium">
            {formatCompactNumber(repo.forks_count)}
          </span>
          forks
        </span>
        <span className="flex items-center gap-1.5">
          <Eye className="size-4" />
          <span className="text-foreground font-medium">
            {formatCompactNumber(repo.watchers_count)}
          </span>
          watching
        </span>
        <span className="flex items-center gap-1.5">
          <CircleAlert className="size-4" />
          <span className="text-foreground font-medium">
            {formatCompactNumber(repo.open_issues_count)}
          </span>
          open issues
        </span>
        {repo.license && (
          <span className="flex items-center gap-1.5">
            <Scale className="size-4" />
            {repo.license.name}
          </span>
        )}
      </div>

      <p className="text-muted-foreground mt-2 text-xs">
        Created {formatDate(repo.created_at)} &middot; last pushed{" "}
        {formatDate(repo.pushed_at)}
      </p>

      <Separator className="my-8" />

      <section>
        <h2 className="text-muted-foreground mb-3 text-sm font-medium">
          Languages
        </h2>
        <LanguageBar languages={languages} />
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="text-muted-foreground mb-3 text-sm font-medium">
          Recent commits
        </h2>
        <CommitList owner={username} repo={repoName} initialCommits={commits} />
      </section>
    </div>
  );
}
