import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * A compact error + retry, for cards that fetch their own data. Keeps a failed
 * panel from becoming a blank space or a skeleton that never resolves.
 */
export function InlineError({
  message = "Couldn't load this.",
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 py-8 text-center">
      <TriangleAlert className="size-5 text-muted-foreground/70" />
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
