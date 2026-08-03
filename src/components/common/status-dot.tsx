import { cn } from "@/lib/utils";
import type { StatusTone } from "@/types";

const toneColor: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-info",
  muted: "bg-muted-foreground/50",
};

interface StatusDotProps {
  tone: StatusTone;
  /** Emit a soft ping — reserve for genuinely live/active states. */
  pulse?: boolean;
  /** Accessible label; when omitted the dot is decorative. */
  label?: string;
  className?: string;
}

/** A 8px status indicator. The pulse honors `prefers-reduced-motion`. */
export function StatusDot({ tone, pulse, label, className }: StatusDotProps) {
  return (
    <span
      className={cn(
        "relative inline-flex size-2 shrink-0 rounded-full",
        toneColor[tone],
        className,
      )}
      {...(label
        ? { role: "img", "aria-label": label, title: label }
        : { "aria-hidden": true })}
    >
      {pulse && (
        <span
          aria-hidden
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping",
            toneColor[tone],
          )}
        />
      )}
    </span>
  );
}
