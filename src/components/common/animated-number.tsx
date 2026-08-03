"use client";

import { useReducedMotion } from "framer-motion";
import CountUp from "@/components/CountUp";

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  /** Seconds. Kept short so counts feel like feedback, not a show. */
  duration?: number;
  className?: string;
}

/**
 * A count-up number built on React Bits' `CountUp`. React Bits ships no
 * reduced-motion guard, so we add one here: when the user prefers reduced
 * motion we render the final value immediately (no animation, no layout shift).
 * The count itself is GPU-friendly — it only mutates text content.
 */
export function AnimatedNumber({
  value,
  suffix,
  duration = 1,
  className,
}: AnimatedNumberProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <span className={className}>
        {value}
        {suffix}
      </span>
    );
  }

  return (
    <span className={className}>
      <CountUp to={value} duration={duration} />
      {suffix}
    </span>
  );
}
