import type { AccentHue } from "@/types";
import { activity } from "./seed";
import { readJSON, writeJSON } from "@/lib/data/local-store";

/**
 * A small, real notifications store.
 *
 * It seeds once from the workspace activity feed (converting each item's
 * relative time to a timestamp) and then records genuine in-app events as they
 * happen — a task created, a task completed, a document created. Read state is
 * real and persisted: `markAllRead` moves a `lastReadAt` cursor, and anything
 * newer than it counts as unread. Exposed as a `useSyncExternalStore` source so
 * the bell stays in sync across the app.
 */

export interface AppNotification {
  id: string;
  body: string;
  at: string; // ISO
  actorInitials?: string;
  actorHue?: AccentHue;
}

const ITEMS_KEY = "orbit:notifications:items";
const READ_KEY = "orbit:notifications:lastReadAt";

/** Turn a compact relative label ("8m", "1h", "2h") into an ISO timestamp. */
function relativeToISO(label: string): string {
  const match = /^(\d+)\s*([mhd])$/.exec(label.trim());
  const now = Date.now();
  if (!match) return new Date(now).toISOString();
  const value = Number(match[1]);
  const unit = match[2];
  const ms = unit === "m" ? 60_000 : unit === "h" ? 3_600_000 : 86_400_000;
  return new Date(now - value * ms).toISOString();
}

function seedFromActivity(): AppNotification[] {
  return activity.map((a) => ({
    id: a.id,
    body: `${a.actorName} ${a.action} ${a.target}`,
    at: relativeToISO(a.time),
    actorInitials: a.actorInitials,
    actorHue: a.actorHue,
  }));
}

let items: AppNotification[] = (() => {
  const stored = readJSON<AppNotification[] | null>(ITEMS_KEY, null);
  if (stored) return stored;
  const seeded = seedFromActivity();
  writeJSON(ITEMS_KEY, seeded);
  return seeded;
})();

let lastReadAt: string = readJSON<string>(READ_KEY, new Date(0).toISOString());

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

export function subscribeNotifications(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getNotifications(): AppNotification[] {
  return items;
}

const EMPTY: AppNotification[] = [];
export function getNotificationsServer(): AppNotification[] {
  return EMPTY;
}

const EPOCH = new Date(0).toISOString();
export function getLastReadAt(): string {
  return lastReadAt;
}
export function getLastReadAtServer(): string {
  return EPOCH;
}

/** Record a new notification (newest first, capped) and persist. */
export function recordNotification(body: string): void {
  const entry: AppNotification = {
    id: `n_${crypto.randomUUID().slice(0, 8)}`,
    body,
    at: new Date().toISOString(),
    actorInitials: "MO",
    actorHue: "indigo",
  };
  items = [entry, ...items].slice(0, 50);
  writeJSON(ITEMS_KEY, items);
  emit();
}

/** Mark everything read by moving the cursor to now. */
export function markAllNotificationsRead(): void {
  lastReadAt = new Date().toISOString();
  writeJSON(READ_KEY, lastReadAt);
  emit();
}
