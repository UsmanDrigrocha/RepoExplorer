import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RepoCard } from "./repo-card";
import type { GithubRepo } from "@/lib/github/schemas";

const repo: GithubRepo = {
  id: 1,
  name: "cool-project",
  full_name: "octocat/cool-project",
  owner: { login: "octocat", avatar_url: "https://example.com/a.png" },
  private: false,
  html_url: "https://github.com/octocat/cool-project",
  description: "A cool project",
  fork: false,
  homepage: null,
  stargazers_count: 1200,
  watchers_count: 1200,
  forks_count: 34,
  open_issues_count: 2,
  language: "TypeScript",
  topics: ["cli", "tooling"],
  license: null,
  archived: false,
  default_branch: "main",
  created_at: "2020-01-01T00:00:00Z",
  updated_at: "2020-01-02T00:00:00Z",
  pushed_at: "2020-01-02T00:00:00Z",
};

describe("RepoCard", () => {
  it("renders the repo name, description, language, and stats", () => {
    render(<RepoCard repo={repo} />);

    expect(screen.getByText("cool-project")).toBeInTheDocument();
    expect(screen.getByText("A cool project")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("1.2K")).toBeInTheDocument();
  });

  it("links to the repo detail page", () => {
    render(<RepoCard repo={repo} />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/users/octocat/cool-project",
    );
  });

  it("shows a Fork badge for forked repos", () => {
    render(<RepoCard repo={{ ...repo, fork: true }} />);
    expect(screen.getByText("Fork")).toBeInTheDocument();
  });
});
