import Link from "next/link";
import { GitBranch } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-border/40 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-medium tracking-tight"
        >
          <GitBranch className="size-[18px]" />
          Repo Explorer
        </Link>
        <nav className="flex items-center gap-1">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground hidden text-sm transition-colors sm:block"
          >
            GitHub REST API
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
