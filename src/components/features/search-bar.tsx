"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useUserSearch } from "@/hooks/use-github";
import { cn } from "@/lib/utils";

export function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebouncedValue(query, 300);
  const { data, isFetching, isError } = useUserSearch(debouncedQuery);
  const results = data?.items ?? [];

  function goToUser(username: string) {
    setOpen(false);
    setQuery("");
    router.push(`/users/${username}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      goToUser(results[activeIndex].login);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
        <Input
          autoFocus={autoFocus}
          value={query}
          placeholder="Search GitHub users… e.g. torvalds, vercel, sindresorhus"
          className="h-12 rounded-full pr-10 pl-10 text-[15px] shadow-sm"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => query && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={handleKeyDown}
        />
        {isFetching && (
          <Loader2 className="text-muted-foreground absolute top-1/2 right-3.5 size-4 -translate-y-1/2 animate-spin" />
        )}
      </div>

      {open && debouncedQuery && (
        <div className="border-border/60 bg-popover absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border shadow-lg">
          {isError && (
            <p className="text-muted-foreground px-4 py-3 text-sm">
              Something went wrong. Try again.
            </p>
          )}
          {!isError && !isFetching && results.length === 0 && (
            <p className="text-muted-foreground px-4 py-3 text-sm">
              No users found for &ldquo;{debouncedQuery}&rdquo;.
            </p>
          )}
          <ul role="listbox" className="max-h-80 overflow-y-auto py-1.5">
            {results.map((user, index) => (
              <li
                key={user.id}
                role="option"
                aria-selected={index === activeIndex}
              >
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goToUser(user.login)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                    index === activeIndex ? "bg-accent" : "hover:bg-accent",
                  )}
                >
                  <Image
                    src={user.avatar_url}
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 rounded-full"
                  />
                  <span className="font-medium">{user.login}</span>
                  <span className="text-muted-foreground ml-auto text-xs">
                    {user.type}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
