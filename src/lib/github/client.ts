import "server-only";
import { z } from "zod";
import { GithubApiError } from "./errors";
import {
  githubCommitListSchema,
  githubLanguagesSchema,
  githubRepoListSchema,
  githubRepoSchema,
  githubUserSchema,
  githubUserSearchResponseSchema,
  type GithubCommit,
  type GithubLanguages,
  type GithubRepo,
  type GithubUser,
  type GithubUserSearchResponse,
} from "./schemas";

const GITHUB_API_BASE = "https://api.github.com";

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

interface GithubResponse<T> {
  data: T;
  rateLimit: RateLimitInfo;
}

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function parseRateLimit(headers: Headers): RateLimitInfo {
  return {
    limit: Number(headers.get("x-ratelimit-limit") ?? 60),
    remaining: Number(headers.get("x-ratelimit-remaining") ?? 0),
    reset: Number(headers.get("x-ratelimit-reset") ?? 0),
  };
}

async function githubFetch<T>(
  path: string,
  schema: z.ZodType<T>,
): Promise<GithubResponse<T>> {
  let res: Response;
  try {
    res = await fetch(`${GITHUB_API_BASE}${path}`, {
      headers: authHeaders(),
      // Route handlers own caching (src/lib/github/cache.ts); always hit
      // upstream fresh here so that layer is the single source of truth.
      cache: "no-store",
    });
  } catch {
    throw new GithubApiError("Failed to reach GitHub API", "upstream", 502);
  }

  const rateLimit = parseRateLimit(res.headers);

  if (res.status === 404) {
    throw new GithubApiError("Not found", "not_found", 404);
  }

  if (res.status === 403 && rateLimit.remaining === 0) {
    throw new GithubApiError(
      "GitHub API rate limit exceeded",
      "rate_limited",
      429,
      rateLimit.reset,
    );
  }

  if (!res.ok) {
    throw new GithubApiError(
      `GitHub API responded with ${res.status}`,
      "upstream",
      res.status,
    );
  }

  const json = await res.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new GithubApiError(
      "Unexpected response shape from GitHub API",
      "validation",
      422,
    );
  }

  return { data: parsed.data, rateLimit };
}

export function getUser(username: string) {
  return githubFetch<GithubUser>(
    `/users/${encodeURIComponent(username)}`,
    githubUserSchema,
  );
}

export function searchUsers(query: string, page = 1, perPage = 10) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    per_page: String(perPage),
  });
  return githubFetch<GithubUserSearchResponse>(
    `/search/users?${params.toString()}`,
    githubUserSearchResponseSchema,
  );
}

export type RepoSort = "created" | "updated" | "pushed" | "full_name";
export type RepoDirection = "asc" | "desc";

export function listUserRepos(
  username: string,
  opts: {
    page?: number;
    perPage?: number;
    sort?: RepoSort;
    direction?: RepoDirection;
  } = {},
) {
  const params = new URLSearchParams({
    page: String(opts.page ?? 1),
    per_page: String(opts.perPage ?? 12),
    sort: opts.sort ?? "updated",
    direction: opts.direction ?? "desc",
  });
  return githubFetch<GithubRepo[]>(
    `/users/${encodeURIComponent(username)}/repos?${params.toString()}`,
    githubRepoListSchema,
  );
}

export function getRepo(owner: string, repo: string) {
  return githubFetch<GithubRepo>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
    githubRepoSchema,
  );
}

export function getRepoLanguages(owner: string, repo: string) {
  return githubFetch<GithubLanguages>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`,
    githubLanguagesSchema,
  );
}

export function listRepoCommits(
  owner: string,
  repo: string,
  opts: { page?: number; perPage?: number } = {},
) {
  const params = new URLSearchParams({
    page: String(opts.page ?? 1),
    per_page: String(opts.perPage ?? 10),
  });
  return githubFetch<GithubCommit[]>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?${params.toString()}`,
    githubCommitListSchema,
  );
}
