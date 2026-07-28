import { z } from "zod";

/**
 * Zod schemas for the subset of the GitHub REST API this app consumes.
 * We only pick the fields we actually render — GitHub's payloads are much
 * larger than this — which keeps validation fast and responses small.
 */

export const githubUserSchema = z.object({
  id: z.number(),
  login: z.string(),
  name: z.string().nullable(),
  avatar_url: z.string(),
  html_url: z.string(),
  bio: z.string().nullable(),
  company: z.string().nullable(),
  location: z.string().nullable(),
  blog: z.string().nullable(),
  email: z.string().nullable(),
  twitter_username: z.string().nullable(),
  followers: z.number(),
  following: z.number(),
  public_repos: z.number(),
  public_gists: z.number(),
  created_at: z.string(),
  type: z.string(),
});
export type GithubUser = z.infer<typeof githubUserSchema>;

export const githubUserSearchItemSchema = z.object({
  id: z.number(),
  login: z.string(),
  avatar_url: z.string(),
  html_url: z.string(),
  type: z.string(),
  score: z.number(),
});
export type GithubUserSearchItem = z.infer<typeof githubUserSearchItemSchema>;

export const githubUserSearchResponseSchema = z.object({
  total_count: z.number(),
  incomplete_results: z.boolean(),
  items: z.array(githubUserSearchItemSchema),
});
export type GithubUserSearchResponse = z.infer<
  typeof githubUserSearchResponseSchema
>;

export const githubRepoOwnerSchema = z.object({
  login: z.string(),
  avatar_url: z.string(),
});

export const githubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  owner: githubRepoOwnerSchema,
  private: z.boolean(),
  html_url: z.string(),
  description: z.string().nullable(),
  fork: z.boolean(),
  homepage: z.string().nullable(),
  stargazers_count: z.number(),
  watchers_count: z.number(),
  forks_count: z.number(),
  open_issues_count: z.number(),
  language: z.string().nullable(),
  topics: z.array(z.string()).default([]),
  license: z.object({ key: z.string(), name: z.string() }).nullable(),
  archived: z.boolean(),
  default_branch: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  pushed_at: z.string(),
});
export type GithubRepo = z.infer<typeof githubRepoSchema>;

export const githubRepoListSchema = z.array(githubRepoSchema);

export const githubLanguagesSchema = z.record(z.string(), z.number());
export type GithubLanguages = z.infer<typeof githubLanguagesSchema>;

export const githubCommitSchema = z.object({
  sha: z.string(),
  html_url: z.string(),
  commit: z.object({
    message: z.string(),
    author: z
      .object({
        name: z.string().optional(),
        email: z.string().optional(),
        date: z.string().optional(),
      })
      .nullable(),
  }),
  author: z
    .object({
      login: z.string(),
      avatar_url: z.string(),
      html_url: z.string(),
    })
    .nullable(),
});
export type GithubCommit = z.infer<typeof githubCommitSchema>;

export const githubCommitListSchema = z.array(githubCommitSchema);
