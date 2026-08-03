import type { ProjectStatus, StatusTone, UserStatus } from "@/types";

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
