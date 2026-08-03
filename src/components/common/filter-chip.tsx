"use client";

import { cn } from "@/lib/utils";

interface FilterChipProps {
  active: boolean;
  /** Optional trailing count of matches. */
  count?: number;
  onClick: () => void;
  children: React.ReactNode;
}

/** A pill-shaped filter toggle — soft accent when active, quiet otherwise. */
export function FilterChip({ active, count, onClick, children }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        active
          ? "border-primary/20 bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
      {count !== undefined && (
        <span
          className={cn(
            "tabular text-xs",
            active ? "text-primary/70" : "text-muted-foreground/60",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
