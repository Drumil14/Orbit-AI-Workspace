"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

interface ProgressBarProps {
  /** Completion 0–100. Clamped defensively. */
  value: number;
  className?: string;
  indicatorClassName?: string;
  "aria-label"?: string;
}

/**
 * The thin progress rule used across Orbit. The fill *draws itself* on mount by
 * animating `scaleX` (GPU-composited, so it never touches layout), and eases to
 * new values on optimistic updates. Honors reduced-motion globally via the
 * app's <MotionConfig reducedMotion="user">, which snaps the transform instead.
 */
export function ProgressBar({
  value,
  className,
  indicatorClassName,
  "aria-label": ariaLabel,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <span
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={cn(
        "block h-1 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}
    >
      <motion.span
        className={cn(
          "block h-full w-full origin-left rounded-full bg-primary/60",
          indicatorClassName,
        )}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: pct / 100 }}
        transition={{ duration: 0.6, ease: ease.out }}
      />
    </span>
  );
}
