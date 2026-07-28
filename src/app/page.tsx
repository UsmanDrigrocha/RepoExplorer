import Link from "next/link";
import { SearchBar } from "@/components/features/search-bar";
import { Badge } from "@/components/ui/badge";

const FEATURED_USERS = [
  "torvalds",
  "sindresorhus",
  "vercel",
  "gaearon",
  "yyx990803",
];

export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center px-4 pt-24 pb-32 text-center sm:px-6">
      <Badge
        variant="secondary"
        className="mb-6 rounded-full px-3 py-1 text-xs font-medium"
      >
        Powered by the GitHub REST API
      </Badge>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Explore any GitHub profile,
        <br className="hidden sm:block" /> in one clean view.
      </h1>
      <p className="text-muted-foreground mt-4 max-w-lg text-base text-balance sm:text-lg">
        Search a username to see their repositories, languages, and recent
        commit activity — fetched live, cached server-side.
      </p>

      <div className="mt-10 flex w-full flex-col items-center gap-3">
        <SearchBar autoFocus />
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="text-muted-foreground text-xs">Try:</span>
          {FEATURED_USERS.map((username) => (
            <Link
              key={username}
              href={`/users/${username}`}
              className="border-border/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground rounded-full border px-3 py-1 text-xs transition-colors"
            >
              {username}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
