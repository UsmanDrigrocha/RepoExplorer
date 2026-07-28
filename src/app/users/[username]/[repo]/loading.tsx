import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-64" />
      <Skeleton className="mt-4 h-4 w-full max-w-xl" />
      <div className="mt-6 flex gap-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="bg-border/60 my-8 h-px" />
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="bg-border/60 my-8 h-px" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
