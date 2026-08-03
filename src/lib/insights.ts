import { differenceInCalendarDays, parseISO } from "date-fns";
import type { DetailExtras } from "@/lib/data/seed-projects";
import { dueLabel, shortDate } from "@/lib/format";
import { concernLabel, needsAttention } from "@/lib/project-meta";
import type {
  AccentHue,
  ActivityItem,
  Project,
  ProjectHealth,
  ProjectStatus,
  TaskPriority,
  TaskWithProject,
} from "@/types";

/**
 * Orbit's intelligence layer.
 *
 * Pure functions that *derive* what's worth knowing from the raw workspace data
 * — never fabricated metrics. Everything here is a read on data the app already
 * holds (project status/health/due dates, per-project AI recommendations,
 * blocked tasks, the team activity feed), reshaped into the few signals a person
 * actually needs to see the moment a page loads.
 *
 * These are view-models, not API contracts, so they live outside `types/` — and
 * they run client-side (via the query hooks) so all date math uses the viewer's
 * clock and never drifts across hydration.
 */

export interface AttentionItem {
  name: string;
  slug: string;
  hue: AccentHue;
  status: ProjectStatus;
  health: ProjectHealth;
  /** e.g. "off track · due in 13 days" */
  reason: string;
  dueInDays: number;
}

export interface DeadlineItem {
  name: string;
  slug: string;
  hue: AccentHue;
  /** Humane label from {@link dueLabel}, e.g. "Due in 13 days". */
  label: string;
  dueInDays: number;
}

export interface BlockerItem {
  title: string;
  projectName: string;
  slug: string;
  hue: AccentHue;
}

export interface Suggestion {
  /** The project's own AI recommendation — the single next move. */
  text: string;
  projectName: string;
  slug: string;
  hue: AccentHue;
}

export interface HomeBrief {
  /** One synthesized sentence: what matters most, right now. */
  headline: string;
  needsAttention: AttentionItem[];
  nearestDeadline: DeadlineItem | null;
  blockers: BlockerItem[];
  /** Times the current user was @-mentioned in recent activity. */
  mentions: number;
  /** Recent team updates across the workspace. */
  updates: number;
  suggestion: Suggestion | null;
}

/** How loudly a project is asking for attention — higher is more urgent. */
function severity(p: Project): number {
  let s = 0;
  if (p.status === "off_track") s += 3;
  else if (p.status === "at_risk") s += 2;
  if (p.health === "critical") s += 3;
  else if (p.health === "watch") s += 1;
  return s;
}

const daysUntil = (iso: string, now: Date) =>
  differenceInCalendarDays(parseISO(iso), now);

/** A due phrase that reads naturally mid-sentence and keeps the month capitalized. */
function dueClause(iso: string, now: Date): string {
  const d = daysUntil(iso, now);
  if (d < 0) return `${Math.abs(d)} days overdue`;
  if (d === 0) return "due today";
  if (d === 1) return "due tomorrow";
  if (d <= 7) return `due in ${d} days`;
  return `due by ${shortDate(iso)}`;
}

/** Projects that need a look, most urgent first (severity, then soonest due). */
export function computeAttention(projects: Project[], now: Date): AttentionItem[] {
  return projects
    .filter(needsAttention)
    .sort(
      (a, b) =>
        severity(b) - severity(a) || daysUntil(a.dueDate, now) - daysUntil(b.dueDate, now),
    )
    .map((p) => ({
      name: p.name,
      slug: p.slug,
      hue: p.hue,
      status: p.status,
      health: p.health,
      reason: `${concernLabel(p)} · ${dueClause(p.dueDate, now)}`,
      dueInDays: daysUntil(p.dueDate, now),
    }));
}

/** The soonest still-open deadline across a set of projects. */
export function computeNearestDeadline(
  projects: Project[],
  now: Date,
): DeadlineItem | null {
  const nearest = projects
    .filter((p) => p.status !== "completed")
    .map((p) => ({ p, d: daysUntil(p.dueDate, now) }))
    .filter((x) => x.d >= 0)
    .sort((a, b) => a.d - b.d)[0];
  return nearest
    ? {
        name: nearest.p.name,
        slug: nearest.p.slug,
        hue: nearest.p.hue,
        label: dueLabel(nearest.p.dueDate, now).label,
        dueInDays: nearest.d,
      }
    : null;
}

export function buildHomeBrief(
  projects: Project[],
  details: Record<string, DetailExtras>,
  activity: ActivityItem[],
  now: Date = new Date(),
): HomeBrief {
  const attention = computeAttention(projects, now);
  const nearestDeadline = computeNearestDeadline(projects, now);

  // Anything explicitly blocked and not yet done.
  const blockers: BlockerItem[] = [];
  for (const p of projects) {
    const extras = details[p.slug];
    if (!extras) continue;
    for (const task of extras.tasks) {
      if (task.group.toLowerCase() === "blocked" && task.status !== "done") {
        blockers.push({
          title: task.title,
          projectName: p.name,
          slug: p.slug,
          hue: p.hue,
        });
      }
    }
  }

  const mentions = activity.filter((a) => a.kind === "mentioned").length;

  // The suggested next move is the most-urgent project's own AI recommendation.
  const top = attention[0];
  const topAi = top ? details[top.slug]?.ai : undefined;
  const suggestion: Suggestion | null =
    top && topAi
      ? {
          text: topAi.recommendation,
          projectName: top.name,
          slug: top.slug,
          hue: top.hue,
        }
      : null;

  let headline: string;
  const lead = attention[0];
  if (!lead) {
    headline = nearestDeadline
      ? `Everything's on track. Your nearest deadline is ${nearestDeadline.name}, ${nearestDeadline.label.toLowerCase()}.`
      : "Everything's on track. Nothing needs you right now.";
  } else {
    const rest = attention.length - 1;
    const tail =
      rest > 0
        ? ` ${rest} other project${rest === 1 ? "" : "s"} also need${rest === 1 ? "s" : ""} a look.`
        : "";
    headline = `${lead.name} needs you most. It's ${lead.reason.replace(" · ", " and ")}.${tail}`;
  }

  return {
    headline,
    needsAttention: attention,
    nearestDeadline,
    blockers,
    mentions,
    updates: activity.length,
    suggestion,
  };
}

/* ── Projects overview ─────────────────────────────────────────────────────── */

export interface PortfolioDigest {
  /** Projects still in motion (everything not completed). */
  total: number;
  onTrack: number;
  /** Projects slipping or critical — the ones that need you. */
  attention: number;
  paused: number;
  /** The single project most worth opening next. */
  lead: AttentionItem | null;
  nearestDeadline: DeadlineItem | null;
}

/**
 * A portfolio-level read for the Projects overview: how the whole set is
 * trending, the one project to open first, and the nearest deadline — so the
 * page states its own health before you scan a single card.
 */
export function buildPortfolioDigest(
  projects: Project[],
  now: Date = new Date(),
): PortfolioDigest {
  const attention = computeAttention(projects, now);
  return {
    total: projects.filter((p) => p.status !== "completed").length,
    onTrack: projects.filter((p) => p.status === "on_track").length,
    attention: attention.length,
    paused: projects.filter((p) => p.status === "paused").length,
    lead: attention[0] ?? null,
    nearestDeadline: computeNearestDeadline(projects, now),
  };
}

/* ── Tasks ─────────────────────────────────────────────────────────────────── */

export interface TaskDigest {
  /** Open tasks on the current user's plate. */
  active: number;
  dueToday: number;
  highPriority: number;
  inReview: number;
  /** The one task to start with — soonest and highest-priority. */
  suggestion: {
    title: string;
    projectName: string;
    slug: string;
    hue: AccentHue;
  } | null;
}

const priorityRank: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };

/**
 * A read on the current user's own workload: how much is open, what's due today,
 * what's waiting on review, and the single task worth starting with.
 */
export function buildTaskDigest(
  tasks: TaskWithProject[],
  userId: string,
): TaskDigest {
  const active = tasks.filter(
    (t) => t.assigneeId === userId && t.status !== "done",
  );

  // Start with what's due today, then by priority.
  const lead = [...active].sort((a, b) => {
    const aToday = a.due === "Today" ? 0 : 1;
    const bToday = b.due === "Today" ? 0 : 1;
    return aToday - bToday || priorityRank[a.priority] - priorityRank[b.priority];
  })[0];

  return {
    active: active.length,
    dueToday: active.filter((t) => t.due === "Today").length,
    highPriority: active.filter((t) => t.priority === "high").length,
    inReview: active.filter((t) => t.status === "in_review").length,
    suggestion: lead
      ? {
          title: lead.title,
          projectName: lead.projectName,
          slug: lead.projectSlug,
          hue: lead.projectHue,
        }
      : null,
  };
}
