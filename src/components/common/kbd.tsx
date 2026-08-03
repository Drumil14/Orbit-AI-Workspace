import { cn } from "@/lib/utils";

/**
 * A single keycap. Compose for chords: <Kbd>⌘</Kbd><Kbd>K</Kbd>, or pass a
 * space-separated string to `keys` to render a sequence automatically.
 */
export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-[18px] min-w-[18px] select-none items-center justify-center rounded-[5px] border border-border bg-muted px-1 font-sans text-[11px] leading-none font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

/** Renders a space-separated shortcut like "G H" or "⌘ K" as keycaps. */
export function KbdSequence({
  keys,
  className,
}: {
  keys: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {keys.split(" ").map((key, i) => (
        <Kbd key={`${key}-${i}`}>{key}</Kbd>
      ))}
    </span>
  );
}
