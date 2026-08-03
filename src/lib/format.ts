import {
  differenceInCalendarDays,
  format,
  formatDistanceToNowStrict,
  parseISO,
} from "date-fns";

/**
 * Date presentation helpers.
 *
 * All relative output is computed against the *client* clock, so these are only
 * ever called from client components — that keeps server/client markup in sync
 * and avoids hydration drift on timestamps.
 */

/** "20 minutes ago", "3 hours ago" — compact and human. */
export function relativeTime(iso: string): string {
  return formatDistanceToNowStrict(parseISO(iso), { addSuffix: true });
}

/** Absolute short date, e.g. "Sep 12". */
export function shortDate(iso: string): string {
  return format(parseISO(iso), "MMM d");
}

/** A calm, humane due label plus whether the date has already passed. */
export function dueLabel(
  iso: string,
  now: Date = new Date(),
): { label: string; overdue: boolean } {
  const date = parseISO(iso);
  const days = differenceInCalendarDays(date, now);

  if (days < 0) return { label: `${Math.abs(days)}d overdue`, overdue: true };
  if (days === 0) return { label: "Due today", overdue: false };
  if (days === 1) return { label: "Due tomorrow", overdue: false };
  if (days <= 7) return { label: `Due in ${days} days`, overdue: false };
  return { label: `Due ${format(date, "MMM d")}`, overdue: false };
}
