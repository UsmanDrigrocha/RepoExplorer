"use client";

import { useState } from "react";
import Image from "next/image";
import { GitCommitHorizontal, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api/fetcher";
import type { GithubCommit } from "@/lib/github/schemas";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/format";

const PAGE_SIZE = 10;

export function CommitList({
  owner,
  repo,
  initialCommits,
}: {
  owner: string;
  repo: string;
  initialCommits: GithubCommit[];
}) {
  const [commits, setCommits] = useState(initialCommits);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialCommits.length >= PAGE_SIZE);

  async function loadMore() {
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const next = await apiFetch<GithubCommit[]>(
        `/api/github/repos/${owner}/${repo}/commits?page=${nextPage}`,
      );
      setCommits((prev) => [...prev, ...next]);
      setPage(nextPage);
      setHasMore(next.length >= PAGE_SIZE);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <ul className="divide-border/60 border-border/60 divide-y rounded-2xl border">
        {commits.map((commit) => (
          <li key={commit.sha} className="flex items-start gap-3 p-4">
            <GitCommitHorizontal className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            {commit.author ? (
              <Image
                src={commit.author.avatar_url}
                alt={commit.author.login}
                width={24}
                height={24}
                className="size-6 shrink-0 rounded-full"
              />
            ) : (
              <div className="bg-muted size-6 shrink-0 rounded-full" />
            )}
            <div className="min-w-0 flex-1">
              <a
                href={commit.html_url}
                target="_blank"
                rel="noreferrer"
                className="line-clamp-1 text-sm font-medium hover:underline"
              >
                {commit.commit.message.split("\n")[0]}
              </a>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {commit.author?.login ??
                  commit.commit.author?.name ??
                  "Unknown"}
                {commit.commit.author?.date && (
                  <> &middot; {formatRelativeTime(commit.commit.author.date)}</>
                )}
              </p>
            </div>
            <code className="text-muted-foreground shrink-0 text-xs">
              {commit.sha.slice(0, 7)}
            </code>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={loadMore}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
            Load more commits
          </Button>
        </div>
      )}
    </div>
  );
}
