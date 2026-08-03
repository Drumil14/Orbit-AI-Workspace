import { cn } from "@/lib/utils";

/**
 * Orbit's surface. Large radius, a hairline border, and a shadow you barely
 * register — depth is implied, not shouted. `interactive` adds a gentle lift
 * for cards that are themselves clickable.
 */
export function Card({
  className,
  interactive = false,
  ...props
}: React.ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card text-card-foreground shadow-xs",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-200 ease-out hover:border-border hover:shadow-md",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 px-5 pt-5 pb-3",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "text-base font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("px-5 pb-5", className)} {...props} />;
}

/** A small uppercase eyebrow label — the reference's "YOUR ID" micro-label. */
export function CardEyebrow({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-[12px] font-medium tracking-wider text-muted-foreground/70 uppercase",
        className,
      )}
      {...props}
    />
  );
}
