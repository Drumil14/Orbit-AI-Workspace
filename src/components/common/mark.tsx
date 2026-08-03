import { Identity } from "@/components/common/identity";
import { cn } from "@/lib/utils";
import type { AccentHue } from "@/types";

const sizes = {
  sm: "size-5 rounded-md",
  md: "size-7 rounded-lg",
  lg: "size-9 rounded-xl",
} as const;

interface MarkProps {
  /** The entity's name or id — seeds its generated glyph. */
  seed: string;
  hue: AccentHue;
  size?: keyof typeof sizes;
  className?: string;
}

/**
 * A workspace or project's identity: a generated geometric glyph, never a
 * lettered square. Size and radius default from `size`; pass `className` to go
 * larger (e.g. a hero mark at `size-14 rounded-2xl`).
 */
export function Mark({ seed, hue, size = "md", className }: MarkProps) {
  return <Identity seed={seed} hue={hue} className={cn(sizes[size], className)} />;
}
