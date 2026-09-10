/**
 * Tiny JSON-over-localStorage helpers, SSR-safe.
 *
 * The domain stores (tasks, documents) persist their session state through
 * these. Reads fall back to a default on the server or on any parse/quota
 * error, so a corrupt or unavailable store never throws into a render.
 */

const isBrowser = typeof window !== "undefined";

export function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota / serialization errors — persistence is best-effort.
  }
}
