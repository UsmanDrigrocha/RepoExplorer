import { Skeleton } from "@/components/ui/skeleton";

export function RepoCardSkeleton() {
  return (
    <div className="border-border/60 flex flex-col gap-3 rounded-2xl border p-5">
      <Skeleton className="h-5 w-2/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/5" />
      <div className="mt-2 flex gap-4">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-12" />
        <Skeleton className="h-3.5 w-12" />
      </div>
    </div>
  );
}
