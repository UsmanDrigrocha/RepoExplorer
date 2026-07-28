import Image from "next/image";
import {
  Building2,
  Link as LinkIcon,
  MapPin,
  Users,
  BookMarked,
} from "lucide-react";
import type { GithubUser } from "@/lib/github/schemas";
import { formatCompactNumber, formatDate } from "@/lib/format";

export function UserProfileHeader({ user }: { user: GithubUser }) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <Image
        src={user.avatar_url}
        alt={user.login}
        width={112}
        height={112}
        className="border-border/60 size-24 shrink-0 rounded-full border sm:size-28"
        priority
      />

      <div className="flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {user.name ?? user.login}
          </h1>
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            @{user.login}
          </a>
        </div>

        {user.bio && (
          <p className="text-foreground/90 mt-2 max-w-xl text-sm">{user.bio}</p>
        )}

        <dl className="text-muted-foreground mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5">
            <Users className="size-[15px]" />
            <span className="text-foreground font-medium">
              {formatCompactNumber(user.followers)}
            </span>
            followers &middot;{" "}
            <span className="text-foreground font-medium">
              {formatCompactNumber(user.following)}
            </span>
            following
          </div>
          <div className="flex items-center gap-1.5">
            <BookMarked className="size-[15px]" />
            <span className="text-foreground font-medium">
              {formatCompactNumber(user.public_repos)}
            </span>
            repositories
          </div>
          {user.company && (
            <div className="flex items-center gap-1.5">
              <Building2 className="size-[15px]" />
              {user.company}
            </div>
          )}
          {user.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="size-[15px]" />
              {user.location}
            </div>
          )}
          {user.blog && (
            <a
              href={
                user.blog.startsWith("http")
                  ? user.blog
                  : `https://${user.blog}`
              }
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground flex items-center gap-1.5"
            >
              <LinkIcon className="size-[15px]" />
              {user.blog.replace(/^https?:\/\//, "")}
            </a>
          )}
        </dl>

        <p className="text-muted-foreground mt-3 text-xs">
          Joined GitHub on {formatDate(user.created_at)}
        </p>
      </div>
    </div>
  );
}
