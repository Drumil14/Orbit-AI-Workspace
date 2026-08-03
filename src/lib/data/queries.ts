import type {
  ActivityItem,
  ContinueItem,
  Favorite,
  FocusTask,
  Project,
  DocumentWithProject,
  ProjectDetail,
  ScheduleEvent,
  TaskWithProject,
  User,
  Workspace,
  WorkspaceDoc,
} from "@/types";
import {
  activity,
  continueItem,
  currentUser,
  favorites,
  focusTasks,
  projects,
  schedule,
  workspaces,
} from "./seed";
import { projectDetails } from "./seed-projects";
import { workspaceDocs } from "./seed-docs";
import { buildHomeBrief, type HomeBrief } from "@/lib/insights";

/**
 * The data-access seam.
 *
 * Today these resolve from in-memory seed data; later each becomes a `fetch`
 * to FastAPI. Callers (server components, query hooks) only ever see the
 * Promise-returning signatures — so swapping the implementation is a one-file
 * change with zero component edits.
 */

/** Simulate network latency so loading states are exercised in dev. */
export function simulateLatency(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* Shell chrome resolves instantly — the frame should never flash a skeleton. */

export async function getCurrentUser(): Promise<User> {
  return currentUser;
}

export async function getWorkspaces(): Promise<Workspace[]> {
  return workspaces;
}

export async function getActiveWorkspace(): Promise<Workspace> {
  return workspaces[0];
}

export async function getFavorites(): Promise<Favorite[]> {
  return favorites;
}

export async function getPinnedProjects(): Promise<Project[]> {
  return projects.filter((project) => project.pinned);
}

/** Every project — the source for the Projects Overview grid. */
export async function getProjects(): Promise<Project[]> {
  return projects;
}

/** Lightweight existence/name lookup for the detail route (no latency). */
export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  return projects.find((project) => project.slug === slug);
}

/** The full project payload — base fields merged with its rich detail. */
export async function getProjectDetail(
  slug: string,
): Promise<ProjectDetail | undefined> {
  const project = projects.find((p) => p.slug === slug);
  const extras = projectDetails[slug];
  if (!project || !extras) return undefined;
  return { ...project, ...extras };
}

/** Every task across every project, each carrying its project context. */
export async function getTasks(): Promise<TaskWithProject[]> {
  return projects.flatMap((project) => {
    const extras = projectDetails[project.slug];
    if (!extras) return [];
    return extras.tasks.map((task) => ({
      ...task,
      projectId: project.id,
      projectName: project.name,
      projectSlug: project.slug,
      projectHue: project.hue,
    }));
  });
}

/** A readable workspace document (roadmap, wiki, …) by slug. */
export async function getWorkspaceDoc(
  slug: string,
): Promise<WorkspaceDoc | undefined> {
  return workspaceDocs[slug];
}

/** Every document across every project, each carrying its project context. */
export async function getDocuments(): Promise<DocumentWithProject[]> {
  return projects.flatMap((project) => {
    const extras = projectDetails[project.slug];
    if (!extras) return [];
    return extras.documents.map((doc) => ({
      ...doc,
      projectId: project.id,
      projectName: project.name,
      projectSlug: project.slug,
      projectHue: project.hue,
    }));
  });
}

export async function getSchedule(): Promise<ScheduleEvent[]> {
  return schedule;
}

export async function getActivity(): Promise<ActivityItem[]> {
  return activity;
}

export async function getContinueWorking(): Promise<ContinueItem> {
  return continueItem;
}

export async function getFocusTasks(): Promise<FocusTask[]> {
  return focusTasks;
}

/**
 * The Home "brief" — Orbit's synthesized read on the workspace: which projects
 * need attention, the nearest deadline, blockers, and the single next move.
 * Derived (never fabricated) from the same seed the rest of the app reads.
 */
export async function getHomeBrief(): Promise<HomeBrief> {
  return buildHomeBrief(projects, projectDetails, activity);
}
