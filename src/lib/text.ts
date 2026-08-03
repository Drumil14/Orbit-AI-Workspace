/** Small, pure string/date helpers shared across the UI. */

/** First letters of the first `max` words, uppercased. "Mobile App" → "MA". */
export function toInitials(name: string, max = 2): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .map((word) => word[0]!.toUpperCase())
    .join("");
}

/** Time-of-day greeting. Pass a date in tests; defaults to now. */
export function greeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** "1 member" / "3 members" — naive English pluralization for counts. */
export function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
