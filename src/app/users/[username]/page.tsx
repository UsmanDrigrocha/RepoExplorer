import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUser, listUserRepos } from "@/lib/github/client";
import { GithubApiError } from "@/lib/github/errors";
import type { GithubRepo, GithubUser } from "@/lib/github/schemas";
import { UserProfileHeader } from "@/components/features/user-profile-header";
import { RepoExplorer } from "@/components/features/repo-explorer";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  return { title: `${username} — Repo Explorer` };
}

async function loadUserProfile(
  username: string,
): Promise<{ user: GithubUser; repos: GithubRepo[] }> {
  try {
    const [{ data: user }, { data: repos }] = await Promise.all([
      getUser(username),
      listUserRepos(username, { sort: "updated" }),
    ]);
    return { user, repos };
  } catch (error) {
    if (error instanceof GithubApiError && error.kind === "not_found") {
      notFound();
    }
    throw error;
  }
}

export default async function UserPage({ params }: PageProps) {
  const { username } = await params;
  const { user, repos } = await loadUserProfile(username);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <UserProfileHeader user={user} />
      <Separator className="my-8" />
      <RepoExplorer username={username} initialRepos={repos} />
    </div>
  );
}
