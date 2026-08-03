import { cn } from "@/lib/utils";

/** The Orbit mark: a tilted orbital path, a core, and a satellite mid-motion. */
export function OrbitMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("size-4", className)}
    >
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4.75"
        transform="rotate(-28 12 12)"
        className="stroke-current opacity-55"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2.75" className="fill-current" />
      <circle cx="20" cy="7.6" r="1.7" className="fill-current" />
    </svg>
  );
}

interface LogoProps {
  withWordmark?: boolean;
  className?: string;
}

/** Brand lockup — accented mark plus optional wordmark. */
export function Logo({ withWordmark = true, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground shadow-xs">
        <OrbitMark className="size-[18px]" />
      </span>
      {withWordmark && (
        <span className="text-[14px] font-semibold tracking-tight text-foreground">
          Orbit
        </span>
      )}
    </span>
  );
}
