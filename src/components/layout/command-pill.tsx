import { Search } from "lucide-react";
import { Kbd } from "@/components/common/kbd";
import { cn } from "@/lib/utils";

/**
 * The command spine's centerpiece — a search/run affordance advertising ⌘K.
 * The palette itself arrives in a later phase; `onOpen` is a placeholder now.
 */
export function CommandPill({
  onOpen,
  className,
}: {
  onOpen: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group flex h-8 w-full items-center gap-2 rounded-lg border border-border/70 bg-muted/40 px-2.5 text-sm text-muted-foreground transition-colors outline-none hover:border-border hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <Search className="size-4" />
      <span className="flex-1 truncate text-left">Search or run a command</span>
      <span className="flex items-center gap-0.5">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );
}
