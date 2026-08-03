import type { LucideIcon } from "lucide-react";

/**
 * Orbit domain models.
 *
 * These are the contracts the mock data layer fulfills today and the real
 * FastAPI backend will fulfill later — components depend on these, never on
 * where the data comes from.
 */

/* ── People ──────────────────────────────────────────────────────────────── */

export type UserStatus = "online" | "away" | "busy" | "offline";

/** A workspace member. Avatars render from `initials` — Orbit never uses photos. */
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  status: UserStatus;
  /** Identity color for this person's avatar — not a status signal. */
  hue: AccentHue;
}

/* ── Visual identity ─────────────────────────────────────────────────────── */

/** Muted hues a workspace or project can adopt for its mark and atmosphere. */
export type AccentHue = "indigo" | "emerald" | "amber" | "rose" | "sky" | "slate";

/** Semantic tone shared by status dots, badges, and pills. */
export type StatusTone = "success" | "warning" | "danger" | "info" | "muted";

/* ── Workspaces ──────────────────────────────────────────────────────────── */

export type WorkspacePlan = "Free" | "Pro" | "Business" | "Enterprise";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  initials: string;
  hue: AccentHue;
  /** The workspace's character, e.g. "Engineering" — drives its atmosphere. */
  department: string;
  plan: WorkspacePlan;
  memberCount: number;
}

/* ── Projects ────────────────────────────────────────────────────────────── */

export type ProjectStatus =
  | "on_track"
  | "at_risk"
  | "off_track"
  | "paused"
  | "completed";

/** AI-derived read on a project, distinct from its workflow `status`. */
export type ProjectHealth = "healthy" | "watch" | "critical";

export interface Project {
  id: string;
  name: string;
  slug: string;
  hue: AccentHue;
  status: ProjectStatus;
  /** Completion 0–100, shown as a thin progress rule on Home. */
  progress: number;
  pinned: boolean;
  /** One calm line describing the project's intent. */
  description: string;
  priority: TaskPriority;
  /** What Orbit's AI thinks of the project's trajectory. */
  health: ProjectHealth;
  /** ISO date the project is due, e.g. "2026-09-12". */
  dueDate: string;
  /** ISO datetime of the most recent activity — drives "last active". */
  lastActivityAt: string;
  /** People on the project, resolved against the roster. */
  memberIds: string[];
}

/* ── Favorites ───────────────────────────────────────────────────────────── */

export type FavoriteKind = "document" | "view" | "project";

export interface Favorite {
  id: string;
  label: string;
  href: string;
  kind: FavoriteKind;
}

/* ── Home ────────────────────────────────────────────────────────────────── */

/** The single thing the user was last working on — the "pick up where you left off". */
export interface ContinueItem {
  projectId: string;
  projectName: string;
  projectHue: AccentHue;
  taskTitle: string;
  /** Compact relative time, e.g. "20m". */
  updatedAgo: string;
  href: string;
}

export type TaskPriority = "low" | "medium" | "high";

export interface FocusTask {
  id: string;
  title: string;
  projectName: string;
  projectHue: AccentHue;
  priority: TaskPriority;
  /** Human due label, e.g. "2:30 PM" or "Today". */
  due: string;
  done: boolean;
}

/* ── Agenda: schedule + activity ─────────────────────────────────────────── */

export type ScheduleKind = "meeting" | "focus" | "review" | "personal";

export interface ScheduleEvent {
  id: string;
  title: string;
  /** 24h "HH:MM". */
  start: string;
  end: string;
  kind: ScheduleKind;
}

export type ActivityKind =
  | "moved"
  | "shipped"
  | "commented"
  | "mentioned"
  | "created"
  | "completed";

export interface ActivityItem {
  id: string;
  actorName: string;
  actorInitials: string;
  actorHue: AccentHue;
  /** Verb phrase, e.g. "moved 3 tasks in". */
  action: string;
  target: string;
  /** Compact relative time, e.g. "12m". */
  time: string;
  kind: ActivityKind;
}

/* ── Project detail ──────────────────────────────────────────────────────── */

/** A member's role *on a specific project* (may differ from their global role). */
export interface ProjectMember {
  userId: string;
  role: string;
}

/** The AI project briefing — reads like a note from a project lead. */
export interface AiSummary {
  goal: string;
  risks: string[];
  recommendation: string;
  /** Human estimate, e.g. "Sep 12" or "~3 weeks". */
  estimatedCompletion: string;
  /** Model confidence 0–100 — shown as a quiet meter, never a hard claim. */
  confidence: number;
}

/** The one thing to pick back up inside a project. */
export interface ContinuePoint {
  kind: "document" | "task";
  title: string;
  /** Where it lives, e.g. "Onboarding spec" or "In review". */
  context: string;
  updatedAgo: string;
  href: string;
}

export type TimelineKind =
  | "created"
  | "shipped"
  | "milestone"
  | "status"
  | "comment"
  | "upload"
  | "ai";

/** A milestone-level event in the project's chronological history. */
export interface TimelineEvent {
  id: string;
  kind: TimelineKind;
  title: string;
  detail?: string;
  /** Undefined actor => a system or AI event. */
  actorId?: string;
  /** ISO datetime. */
  at: string;
}

export type TaskStatus = "todo" | "in_progress" | "in_review" | "done";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  /** Human due label, e.g. "Fri" or "Aug 8". */
  due?: string;
  /** Grouping bucket, e.g. "This week". */
  group: string;
}

export type DocKind = "doc" | "spec" | "design" | "sheet";

export interface DocumentItem {
  id: string;
  title: string;
  kind: DocKind;
  /** A short preview line. */
  excerpt: string;
  ownerId: string;
  /** ISO datetime of last edit. */
  updatedAt: string;
}

export type FeedKind = "comment" | "upload" | "status" | "ai";

/** A granular entry in the recent activity feed. */
export interface FeedItem {
  id: string;
  kind: FeedKind;
  actorId?: string;
  body: string;
  /** ISO datetime. */
  at: string;
}

/** A task carried with its project context — for the cross-project Tasks view. */
export interface TaskWithProject extends Task {
  projectId: string;
  projectName: string;
  projectSlug: string;
  projectHue: AccentHue;
}

/** A document carried with its project context — for the Documents library. */
export interface DocumentWithProject extends DocumentItem {
  projectId: string;
  projectName: string;
  projectSlug: string;
  projectHue: AccentHue;
}

/* ── Readable workspace documents (roadmap, wiki, …) ─────────────────────── */

/** A content block in a readable document — a tiny, typed prose model. */
export type DocBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "checklist"; items: { text: string; done: boolean }[] }
  | { type: "callout"; tone: StatusTone; text: string }
  | { type: "divider" };

/** A standalone, long-form document opened from Favorites or the library. */
export interface WorkspaceDoc {
  slug: string;
  title: string;
  kind: DocKind;
  description: string;
  ownerId: string;
  /** ISO datetime of last edit. */
  updatedAt: string;
  contributorIds: string[];
  blocks: DocBlock[];
}

/** Everything the Project Detail screen needs, in one API-shaped payload. */
export interface ProjectDetail extends Project {
  members: ProjectMember[];
  ai: AiSummary;
  continuePoint: ContinuePoint;
  timeline: TimelineEvent[];
  tasks: Task[];
  documents: DocumentItem[];
  feed: FeedItem[];
}

/* ── Navigation ──────────────────────────────────────────────────────────── */

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Human-readable shortcut hint, e.g. "G H". */
  shortcut?: string;
  badge?: number;
}
