import { describe, expect, it } from "vitest";
import {
  githubRepoSchema,
  githubUserSchema,
  githubLanguagesSchema,
} from "./schemas";

const baseUser = {
  id: 1,
  login: "octocat",
  name: "The Octocat",
  avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
  html_url: "https://github.com/octocat",
  bio: null,
  company: null,
  location: null,
  blog: null,
  email: null,
  twitter_username: null,
  followers: 10,
  following: 2,
  public_repos: 5,
  public_gists: 0,
  created_at: "2011-01-01T00:00:00Z",
  type: "User",
};

describe("githubUserSchema", () => {
  it("accepts a well-formed GitHub user payload", () => {
    const result = githubUserSchema.safeParse(baseUser);
    expect(result.success).toBe(true);
  });

  it("rejects a payload missing required fields", () => {
    const { followers, ...withoutFollowers } = baseUser;
    void followers;
    const result = githubUserSchema.safeParse(withoutFollowers);
    expect(result.success).toBe(false);
  });
});

describe("githubRepoSchema", () => {
  const baseRepo = {
    id: 1,
    name: "hello-world",
    full_name: "octocat/hello-world",
    owner: { login: "octocat", avatar_url: "https://example.com/a.png" },
    private: false,
    html_url: "https://github.com/octocat/hello-world",
    description: "My first repo",
    fork: false,
    homepage: null,
    stargazers_count: 100,
    watchers_count: 100,
    forks_count: 10,
    open_issues_count: 2,
    language: "TypeScript",
    license: null,
    archived: false,
    default_branch: "main",
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2020-01-02T00:00:00Z",
    pushed_at: "2020-01-02T00:00:00Z",
  };

  it("accepts a repo without a topics field and defaults it to an empty array", () => {
    const result = githubRepoSchema.parse(baseRepo);
    expect(result.topics).toEqual([]);
  });

  it("accepts a repo with topics", () => {
    const result = githubRepoSchema.parse({
      ...baseRepo,
      topics: ["cli", "tooling"],
    });
    expect(result.topics).toEqual(["cli", "tooling"]);
  });
});

describe("githubLanguagesSchema", () => {
  it("accepts a map of language name to byte count", () => {
    const result = githubLanguagesSchema.safeParse({
      TypeScript: 12345,
      CSS: 678,
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-numeric byte counts", () => {
    const result = githubLanguagesSchema.safeParse({ TypeScript: "a lot" });
    expect(result.success).toBe(false);
  });
});
