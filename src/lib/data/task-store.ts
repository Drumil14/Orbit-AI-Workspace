import type { Task, TaskWithProject } from "@/types";
import { readJSON, writeJSON } from "@/lib/data/local-store";

/**
 * Task mutations layered over the read-only seed, persisted to localStorage.
 *
 * The seed arrays are immutable module constants, so created tasks, per-field
 * edits, and deletions live here and are written through to the browser. This
 * is the durable backing chosen for Phase 2 (browser-local); the seam in
 * `queries.ts` reads through these helpers, so moving to a real backend later
 * only changes this file.
 *
 * SSR-safe: reads fall back to empty on the server (localStorage is client
 * only), and the query hooks fetch client-side, so there's no hydration drift.
 */

const CREATED_KEY = "orbit:tasks:created";
const OVERRIDES_KEY = "orbit:tasks:overrides";
const DELETED_KEY = "orbit:tasks:deleted";

/** Tasks created by the user, each already carrying its project context. */
let created: TaskWithProject[] = readJSON<TaskWithProject[]>(CREATED_KEY, []);
/** Per-task field overrides (id → partial), applied on top of seed values. */
let overrides: Record<string, Partial<Task>> = readJSON(OVERRIDES_KEY, {});
/** Ids of seed tasks the user deleted (tombstones — seed can't be mutated). */
let deleted: string[] = readJSON<string[]>(DELETED_KEY, []);

/** Apply any recorded override for a task, returning a patched copy. */
export function applyOverride<T extends Task>(task: T): T {
  const patch = overrides[task.id];
  return patch ? { ...task, ...patch } : task;
}

/** Whether a task has been deleted this workspace (tombstoned or removed). */
export function isTaskDeleted(id: string): boolean {
  return deleted.includes(id);
}

/** Record (merge) a field override for a task and persist it. */
export function setTaskOverride(id: string, patch: Partial<Task>): void {
  overrides = { ...overrides, [id]: { ...overrides[id], ...patch } };
  writeJSON(OVERRIDES_KEY, overrides);
}

/** Append a newly-created task and persist it. */
export function addCreatedTask(task: TaskWithProject): void {
  created = [task, ...created];
  writeJSON(CREATED_KEY, created);
}

/**
 * Delete a task. Created tasks are dropped outright; seed tasks are tombstoned
 * so they stop appearing. Any override for the task is cleared.
 */
export function deleteTask(id: string): void {
  if (created.some((t) => t.id === id)) {
    created = created.filter((t) => t.id !== id);
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

/** All user-created tasks (across every project), newest first. */
export function getCreatedTasks(): TaskWithProject[] {
  return created;
}

/** User-created tasks belonging to one project, as plain `Task`s. */
export function getCreatedTasksForProject(projectId: string): Task[] {
  return created
    .filter((task) => task.projectId === projectId)
    .map(
      (task): Task => ({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
        due: task.due,
        group: task.group,
        description: task.description,
      }),
    );
}
