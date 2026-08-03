import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatusTone } from "@/types";

/** Tinted icon chip per tone — warning uses the accent amber for legible contrast. */
const toneChip: Record<StatusTone, string> = {
  success: "bg-success/12 text-success",
  warning: "bg-amber-500/12 text-amber-600 dark:text-amber-400",
  danger: "bg-destructive/12 text-destructive",
  info: "bg-info/12 text-info",
  muted: "bg-muted text-muted-foreground",
};

interface InsightStatProps {
  icon: LucideIcon;
  /** The headline figure — kept short so it reads in a glance. */
  value: React.ReactNode;
  /** What the figure means. */
  label: string;
  tone?: StatusTone;
}

/**
 * A single derived signal: a tinted icon, a prominent value, and a quiet label.
 * The atom the intelligence surfaces are built from — a stat you can read
 * without stopping to think.
 */
export function InsightStat({
  icon: Icon,
  value,
  label,
  tone = "muted",
}: InsightStatProps) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-lg",
          toneChip[tone],
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 leading-tight">
        <div className="tabular text-sm font-semibold text-foreground">
          {value}
        </div>
        <div className="truncate text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
