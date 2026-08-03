import type { Project, ProjectHealth, StatusTone, TaskPriority } from "@/types";

/**
 * Presentation metadata for project attributes — the single source that maps a
 * priority or AI-health value to its human label and status tone. Mirrors the
 * tone choices used on Home so priority reads identically across the app.
 */

/**
 * The one definition of "needs attention" — anything off its rails or that the
 * AI isn't fully comfortable with. Shared by the overview filter, the portfolio
 * digest, and the Home brief so the count never disagrees across the app.
 */
export function needsAttention(project: Project): boolean {
  return (
    project.status === "at_risk" ||
    project.status === "off_track" ||
    project.health !== "healthy"
  );
}

/** The single most salient reason a project is flagged — the word to lead with. */
export function concernLabel(project: Project): string {
  if (project.status === "off_track") return "off track";
  if (project.status === "at_risk") return "at risk";
  if (project.health === "critical") return "critical";
  if (project.health === "watch") return "needs watch";
  return project.status.replace("_", " ");
}

export const priorityMeta: Record<
  TaskPriority,
  { label: string; tone: StatusTone }
> = {
  high: { label: "High", tone: "danger" },
  medium: { label: "Medium", tone: "warning" },
  low: { label: "Low", tone: "muted" },
};

export const healthMeta: Record<
  ProjectHealth,
  { label: string; tone: StatusTone }
> = {
  healthy: { label: "Healthy", tone: "success" },
  watch: { label: "Needs watch", tone: "warning" },
  critical: { label: "Critical", tone: "danger" },
};
