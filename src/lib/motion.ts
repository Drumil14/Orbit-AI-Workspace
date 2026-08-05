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
  /** Crisp spring for shared-element travel and press feedback — reads as
   * physical, not timed. Tuned to settle fast with almost no overshoot. */
  spring: {
    type: "spring",
    stiffness: 420,
    damping: 34,
    mass: 0.8,
  } satisfies Transition,
  /** Softer spring for larger layout moves (list reordering, cards settling). */
  springSoft: {
    type: "spring",
    stiffness: 260,
    damping: 30,
    mass: 0.9,
  } satisfies Transition,
} as const;

/**
 * A quick keyframe "pop" (scale up, then settle) for completion feedback.
 * Springs can't drive 3-keyframe arrays like `[1, 1.28, 1]`, so this is an
 * explicit tween — use it wherever an element bounces once on a state change.
 */
export const popTransition: Transition = {
  duration: 0.42,
  ease: ease.out,
  times: [0, 0.45, 1],
};

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
