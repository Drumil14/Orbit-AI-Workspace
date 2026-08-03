import { needsAttention } from "@/lib/project-meta";
import type { Project } from "@/types";

/**
 * Overview filtering, kept as pure functions so the board component stays a
 * thin view over them (and they're trivially testable).
 */

export type ProjectFilter =
  | "all"
  | "attention"
  | "on_track"
  | "paused"
  | "completed";

export const projectFilters: { value: ProjectFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "attention", label: "Needs attention" },
  { value: "on_track", label: "On track" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
];

export function matchesFilter(project: Project, filter: ProjectFilter): boolean {
  switch (filter) {
    case "all":
      return true;
    case "attention":
      return needsAttention(project);
    case "on_track":
      return project.status === "on_track";
    case "paused":
      return project.status === "paused";
    case "completed":
      return project.status === "completed";
  }
}

export function matchesQuery(project: Project, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    project.name.toLowerCase().includes(q) ||
    project.description.toLowerCase().includes(q)
  );
}
