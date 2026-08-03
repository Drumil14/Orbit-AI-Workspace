import { Sparkles } from "lucide-react";
import { StatusDot } from "@/components/common/status-dot";
import { healthMeta } from "@/lib/project-meta";
import { cn } from "@/lib/utils";
import type { ProjectHealth } from "@/types";

/**
 * Orbit's AI read on a project's trajectory. The indigo spark marks it as
 * AI-derived; the dot carries the tone. Kept deliberately quiet — a signal,
 * not a widget.
 */
export function HealthIndicator({
  health,
  showLabel = true,
  className,
}: {
  health: ProjectHealth;
  showLabel?: boolean;
  className?: string;
}) {
  const meta = healthMeta[health];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      title={`AI health: ${meta.label}`}
    >
      <Sparkles className="size-3 text-primary" aria-hidden />
      <StatusDot tone={meta.tone} label={showLabel ? undefined : `AI health: ${meta.label}`} />
      {showLabel && (
        <span className="text-xs text-muted-foreground">{meta.label}</span>
      )}
    </span>
  );
}
