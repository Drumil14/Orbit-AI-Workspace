import { cn } from "@/lib/utils";

/**
 * The Orbit mark — an open, foreshortened orbit that breaks into a launch
 * tangent at its apoapsis: a body swinging round and flinging off along its
 * path. One continuous stroke, drawn on a 24 grid with rounded terminals, so it
 * holds up from 16px favicon to loading screen. Inherits `currentColor`, so it
 * takes the accent or the ink of wherever it sits.
 */
export function OrbitMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("size-4", className)}
    >
      <path
        d="M16.9 6.3 A8.6 5.1 -26 1 1 15 5.3 L 20.6 3.1"
        className="stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface LogoProps {
  withWordmark?: boolean;
  className?: string;
}

/**
 * Brand lockup — the bare mark beside the wordmark, no containing tile. The
 * mark carries the identity on its own; boxing it in a rounded square is what
 * made it read as a generic app icon.
 */
export function Logo({ withWordmark = true, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <OrbitMark className="size-6 shrink-0 text-foreground" />
      {withWordmark && (
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
          Orbit
        </span>
      )}
    </span>
  );
}
