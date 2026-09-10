import type { ScheduleEvent } from "@/types";
import { readJSON, writeJSON } from "@/lib/data/local-store";

/**
 * Calendar event mutations layered over the seed schedule, persisted to
 * localStorage — same pattern as the task and document stores. Created events,
 * time/title/kind edits, and deletions live here; `queries.ts` reads through
 * these helpers.
 */

const CREATED_KEY = "orbit:schedule:created";
const OVERRIDES_KEY = "orbit:schedule:overrides";
const DELETED_KEY = "orbit:schedule:deleted";

let created: ScheduleEvent[] = readJSON<ScheduleEvent[]>(CREATED_KEY, []);
let overrides: Record<string, Partial<ScheduleEvent>> = readJSON(OVERRIDES_KEY, {});
let deleted: string[] = readJSON<string[]>(DELETED_KEY, []);

export function applyEventOverride(event: ScheduleEvent): ScheduleEvent {
  const patch = overrides[event.id];
  return patch ? { ...event, ...patch } : event;
}

export function isEventDeleted(id: string): boolean {
  return deleted.includes(id);
}

export function setEventOverride(id: string, patch: Partial<ScheduleEvent>): void {
  overrides = { ...overrides, [id]: { ...overrides[id], ...patch } };
  writeJSON(OVERRIDES_KEY, overrides);
}

export function addCreatedEvent(event: ScheduleEvent): void {
  created = [...created, event];
  writeJSON(CREATED_KEY, created);
}

export function deleteEvent(id: string): void {
  if (created.some((e) => e.id === id)) {
    created = created.filter((e) => e.id !== id);
    writeJSON(CREATED_KEY, created);
  } else if (!deleted.includes(id)) {
    deleted = [...deleted, id];
    writeJSON(DELETED_KEY, deleted);
  }
  if (id in overrides) {
    overrides = Object.fromEntries(
      Object.entries(overrides).filter(([key]) => key !== id),
    );
    writeJSON(OVERRIDES_KEY, overrides);
  }
}

export function getCreatedEvents(): ScheduleEvent[] {
  return created;
}
