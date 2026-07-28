"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/fetcher";
import type {
  GithubCommit,
  GithubLanguages,
  GithubRepo,
  GithubUser,
  GithubUserSearchResponse,
} from "@/lib/github/schemas";
import type { RepoDirection, RepoSort } from "@/lib/github/client";

export function useUserSearch(query: string, page = 1) {
  return useQuery({
    queryKey: ["search-users", query, page],
    queryFn: () =>
      apiFetch<GithubUserSearchResponse>(
        `/api/github/search/users?q=${encodeURIComponent(query)}&page=${page}`,
      ),
    enabled: query.trim().length > 0,
    staleTime: 30_000,
  });
}

export function useGithubUser(username: string) {
  return useQuery({
    queryKey: ["user", username],
    queryFn: () =>
      apiFetch<GithubUser>(`/api/github/users/${encodeURIComponent(username)}`),
    enabled: username.length > 0,
    staleTime: 60_000,
  });
}

export function useUserRepos(
  username: string,
  opts: {
    page?: number;
    sort?: RepoSort;
    direction?: RepoDirection;
  } = {},
) {
  const { page = 1, sort = "updated", direction = "desc" } = opts;
  return useQuery({
    queryKey: ["repos", username, page, sort, direction],
    queryFn: () =>
      apiFetch<GithubRepo[]>(
        `/api/github/users/${encodeURIComponent(username)}/repos?page=${page}&sort=${sort}&direction=${direction}`,
      ),
    enabled: username.length > 0,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}

export function useRepoLanguages(owner: string, repo: string) {
  return useQuery({
    queryKey: ["languages", owner, repo],
    queryFn: () =>
      apiFetch<GithubLanguages>(
        `/api/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`,
      ),
    enabled: Boolean(owner) && Boolean(repo),
    staleTime: 60_000,
  });
}

export function useRepoCommits(owner: string, repo: string, page = 1) {
  return useQuery({
    queryKey: ["commits", owner, repo, page],
    queryFn: () =>
      apiFetch<GithubCommit[]>(
        `/api/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?page=${page}`,
      ),
    enabled: Boolean(owner) && Boolean(repo),
    staleTime: 30_000,
  });
}
