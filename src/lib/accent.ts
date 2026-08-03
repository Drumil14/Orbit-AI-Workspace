import type { AccentHue } from "@/types";

/**
 * Decorative identity hues for workspace / project marks.
 *
 * These use Tailwind's palette (not the semantic tokens) on purpose: semantic
 * tokens carry *meaning* (status, accent), while a mark's color is just
 * identity. Keeping them separate stops a project's brand color from being
 * mistaken for a status signal.
 */
export const accentMark: Record<AccentHue, string> = {
  indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  slate: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

/**
 * Avatar fill per hue. Unlike {@link accentMark}, these are *opaque* soft chips:
 * overlapping avatars in a stack must occlude one another cleanly, which a
 * translucent tint can't do (the disc behind bleeds through into mush).
 */
export const accentAvatar: Record<AccentHue, string> = {
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200",
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200",
  slate: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
};

/** Solid hue bar — the colored left rule on an active project in the sidebar. */
export const accentBar: Record<AccentHue, string> = {
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  sky: "bg-sky-500",
  slate: "bg-slate-400",
};

/**
 * Maps a hue to its atmosphere CSS variable. A workspace sets `--ambient` to
 * one of these, and the whole frame breathes a near-subliminal share of it.
 */
export const atmosphere: Record<AccentHue, string> = {
  indigo: "var(--atmo-indigo)",
  emerald: "var(--atmo-emerald)",
  amber: "var(--atmo-amber)",
  rose: "var(--atmo-rose)",
  sky: "var(--atmo-sky)",
  slate: "var(--atmo-slate)",
};
