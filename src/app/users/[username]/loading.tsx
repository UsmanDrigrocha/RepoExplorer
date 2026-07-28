import { Skeleton } from "@/components/ui/skeleton";
import { RepoCardSkeleton } from "@/components/features/repo-card-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Skeleton className="size-24 shrink-0 rounded-full sm:size-28" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-2/3 max-w-sm" />
        </div>
      </div>
      <div className="bg-border/60 my-8 h-px" />
      <Skeleton className="mb-4 h-4 w-32" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <RepoCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
