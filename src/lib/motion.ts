import type { Transition, Variants } from "framer-motion";

/**
 * Motion tokens — the single source of truth for every animation in Orbit.
 *
 * Durations stay in the 150–220ms band so motion reads as feedback, not
 * decoration. Reduced-motion is honored globally via <MotionConfig> in
 * providers.tsx, so individual components don't each re-implement the guard.
 */

export const duration = {
  fast: 0.15,
  base: 0.18,
  slow: 0.22,
} as const;

/** Cubic-bezier easings as tuples so Framer accepts them without casting. */
export const ease = {
  /** Gentle ease-out for elements entering. */
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  /** Symmetric ease for reversible motion (sidebar width, disclosure). */
  inOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

export const transition = {
  base: { duration: duration.base, ease: ease.out } satisfies Transition,
  sidebar: { duration: duration.slow, ease: ease.inOut } satisfies Transition,
} as const;

/** Fade + rise, used for staggered section reveals. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: transition.base },
};

/** Container that staggers its children on mount. */
export const staggerChildren = (stagger = 0.04): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
});
