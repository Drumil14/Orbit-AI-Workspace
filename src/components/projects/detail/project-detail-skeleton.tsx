import { Card } from "@/components/common/card";
import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <Card className={className}>
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-32" />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </Card>
  );
}

/** Mirrors the detail layout so the page holds its shape while data loads. */
export function ProjectDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4 border-b border-border/70 pb-6">
        <Skeleton className="h-4 w-20" />
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="size-13 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-3.5 w-80" />
            </div>
          </div>
          <div className="flex gap-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-20" />
            ))}
          </div>
        </div>
      </div>

      {/* Continue strip */}
      <Skeleton className="h-20 w-full rounded-2xl" />

      {/* Body */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-6">
          <CardSkeleton lines={8} className="min-h-[32rem]" />
          <CardSkeleton lines={3} />
        </div>
        <div className="space-y-6">
          <CardSkeleton lines={6} />
          <CardSkeleton lines={4} />
          <CardSkeleton lines={4} />
        </div>
      </div>
    </div>
  );
}
