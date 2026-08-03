/**
 * Centralized TanStack Query keys.
 *
 * One place to see every cached entity — prevents key typos and makes
 * invalidation obvious once mutations arrive.
 */
export const queryKeys = {
  currentUser: ["current-user"] as const,
  workspaces: ["workspaces"] as const,
  favorites: ["favorites"] as const,
  pinnedProjects: ["projects", "pinned"] as const,
  // Projects
  projects: ["projects", "list"] as const,
  projectDetail: (slug: string) => ["projects", "detail", slug] as const,
  // Tasks
  tasks: ["tasks", "list"] as const,
  // Documents
  documents: ["documents", "list"] as const,
  // Calendar
  schedule: ["calendar", "schedule"] as const,
  // Home
  continueWorking: ["home", "continue-working"] as const,
  focusTasks: ["home", "focus-tasks"] as const,
  homeBrief: ["home", "brief"] as const,
} as const;
