"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUserRepos } from "@/hooks/use-github";
import type { GithubRepo } from "@/lib/github/schemas";
import type { RepoSort } from "@/lib/github/client";
import { RepoCard } from "@/components/features/repo-card";
import { RepoCardSkeleton } from "@/components/features/repo-card-skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS: { value: RepoSort; label: string }[] = [
  { value: "updated", label: "Recently updated" },
  { value: "created", label: "Newest" },
  { value: "pushed", label: "Recently pushed" },
  { value: "full_name", label: "Name" },
];

export function RepoExplorer({
  username,
  initialRepos,
}: {
  username: string;
  initialRepos: GithubRepo[];
}) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<RepoSort>("updated");

  const { data, isFetching, isPlaceholderData } = useUserRepos(username, {
    page,
    sort,
  });

  const repos = data ?? (page === 1 && sort === "updated" ? initialRepos : []);
  const isEmpty = !isFetching && repos.length === 0;
  const hasNextPage =
    repos.length > 0 && repos.length >= 12 && !isPlaceholderData;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-muted-foreground text-sm font-medium">
          Repositories
        </h2>
        <Select
          value={sort}
          onValueChange={(value) => {
            setSort(value as RepoSort);
            setPage(1);
          }}
        >
          <SelectTrigger size="sm" className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isFetching && repos.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <RepoCardSkeleton key={i} />
            ))
          : repos.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
      </div>

      {isEmpty && (
        <p className="text-muted-foreground mt-8 text-center text-sm">
          No public repositories to show.
        </p>
      )}

      {(page > 1 || hasNextPage) && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <span className="text-muted-foreground text-sm">Page {page}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasNextPage || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
