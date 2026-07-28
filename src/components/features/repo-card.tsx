import Link from "next/link";
import { Star, GitFork } from "lucide-react";
import type { GithubRepo } from "@/lib/github/schemas";
import { Badge } from "@/components/ui/badge";
import { formatCompactNumber, formatRelativeTime } from "@/lib/format";
import { languageColor } from "@/lib/language-colors";

export function RepoCard({ repo }: { repo: GithubRepo }) {
  return (
    <Link
      href={`/users/${repo.owner.login}/${repo.name}`}
      className="group border-border/60 bg-card hover:border-foreground/20 flex flex-col gap-2.5 rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-foreground truncate font-medium group-hover:underline">
          {repo.name}
        </h3>
        {repo.fork && (
          <Badge variant="outline" className="shrink-0 text-[10px]">
            Fork
          </Badge>
        )}
      </div>

      <p className="text-muted-foreground line-clamp-2 min-h-9 text-sm">
        {repo.description ?? "No description provided."}
      </p>

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 3).map((topic) => (
            <Badge
              key={topic}
              variant="secondary"
              className="rounded-full text-[10px] font-normal"
            >
              {topic}
            </Badge>
          ))}
        </div>
      )}

      <div className="text-muted-foreground mt-1 flex items-center gap-4 text-xs">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: languageColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="size-3.5" />
          {formatCompactNumber(repo.stargazers_count)}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="size-3.5" />
          {formatCompactNumber(repo.forks_count)}
        </span>
        <span className="ml-auto">
          Updated {formatRelativeTime(repo.pushed_at)}
        </span>
      </div>
    </Link>
  );
}
