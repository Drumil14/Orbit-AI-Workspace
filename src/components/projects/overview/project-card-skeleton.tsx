import { Card } from "@/components/common/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Matches ProjectCard's rhythm so the grid doesn't reflow when data lands. */
export function ProjectCardSkeleton() {
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>

      <div className="mt-5 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-1 w-full rounded-full" />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
        <div className="flex -space-x-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="size-6 rounded-full ring-2 ring-card" />
          ))}
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    </Card>
  );
}
