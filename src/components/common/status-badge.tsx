import { StatusDot } from "@/components/common/status-dot";
import { Badge } from "@/components/ui/badge";
import { projectStatusMeta } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types";

/** A project's workflow status as a quiet, dot-led outline pill. */
export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  const meta = projectStatusMeta[status];
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 pl-1.5 text-muted-foreground", className)}
    >
      <StatusDot tone={meta.tone} />
      {meta.label}
    </Badge>
  );
}
