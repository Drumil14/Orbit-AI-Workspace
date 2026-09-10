import type { ProjectStatus, StatusTone, TaskStatus, UserStatus } from "@/types";

/** Task workflow status → human label + tone, ordered as work progresses. */
export const taskStatusMeta: Record<
  TaskStatus,
  { label: string; tone: StatusTone }
> = {
  todo: { label: "To do", tone: "muted" },
  in_progress: { label: "In progress", tone: "info" },
  in_review: { label: "In review", tone: "warning" },
  done: { label: "Done", tone: "success" },
};

/** Task statuses in workflow order — for pickers and segmented controls. */
export const taskStatusOrder: TaskStatus[] = [
  "todo",
  "in_progress",
  "in_review",
  "done",
];

/** Project health → human label + the tone its status dot should use. */
export const projectStatusMeta: Record<
  ProjectStatus,
  { label: string; tone: StatusTone }
> = {
  on_track: { label: "On track", tone: "success" },
  at_risk: { label: "At risk", tone: "warning" },
  off_track: { label: "Off track", tone: "danger" },
  paused: { label: "Paused", tone: "muted" },
  completed: { label: "Completed", tone: "info" },
};

/** Presence → tone for the small dot on a user avatar. */
export const userStatusTone: Record<UserStatus, StatusTone> = {
  online: "success",
  away: "warning",
  busy: "danger",
  offline: "muted",
};
