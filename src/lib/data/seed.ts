import type {
  ActivityItem,
  ContinueItem,
  Favorite,
  FocusTask,
  Project,
  ScheduleEvent,
  User,
  Workspace,
} from "@/types";

/**
 * Fictional seed data for Orbit.
 *
 * Everything here is invented — no real people, companies, or contact details.
 * It's shaped exactly like the API responses the backend will return, so the
 * query layer that reads it won't change when the backend lands.
 */

export const currentUser: User = {
  id: "u_maya",
  name: "Maya Okonkwo",
  email: "maya@northwind.studio",
  role: "Product Lead",
  initials: "MO",
  status: "online",
  hue: "indigo",
};

/** Each workspace is a department with its own atmosphere (hue). */
export const workspaces: Workspace[] = [
  {
    id: "ws_helios",
    name: "Helios Labs",
    slug: "helios",
    initials: "HL",
    hue: "indigo",
    department: "Engineering",
    plan: "Business",
    memberCount: 32,
  },
  {
    id: "ws_brightside",
    name: "Brightside",
    slug: "brightside",
    initials: "BS",
    hue: "amber",
    department: "Marketing",
    plan: "Pro",
    memberCount: 14,
  },
  {
    id: "ws_northwind",
    name: "Northwind Studio",
    slug: "northwind",
    initials: "NW",
    hue: "emerald",
    department: "Design",
    plan: "Business",
    memberCount: 11,
  },
  {
    id: "ws_ledger",
    name: "Ledger",
    slug: "ledger",
    initials: "LG",
    hue: "slate",
    department: "Finance",
    plan: "Enterprise",
    memberCount: 9,
  },
];

export const projects: Project[] = [
  {
    id: "p_mobile",
    name: "Mobile App Redesign",
    slug: "mobile-app-redesign",
    hue: "indigo",
    status: "on_track",
    progress: 72,
    pinned: true,
    description: "Rebuild the flagship iOS app around the new navigation model.",
    priority: "high",
    health: "healthy",
    dueDate: "2026-09-12",
    lastActivityAt: "2026-08-01T13:52:00Z",
    memberIds: ["u_maya", "u_ada", "u_noah", "u_ines", "u_lena"],
  },
  {
    id: "p_growth",
    name: "Q3 Growth Experiments",
    slug: "q3-growth-experiments",
    hue: "amber",
    status: "at_risk",
    progress: 41,
    pinned: true,
    description: "Ship and measure a batch of activation experiments for Q3.",
    priority: "high",
    health: "watch",
    dueDate: "2026-08-22",
    lastActivityAt: "2026-08-01T12:40:00Z",
    memberIds: ["u_theo", "u_maya", "u_marcus"],
  },
  {
    id: "p_billing",
    name: "Billing Platform v2",
    slug: "billing-platform-v2",
    hue: "sky",
    status: "on_track",
    progress: 58,
    pinned: true,
    description: "Migrate billing to the new metered platform with zero downtime.",
    priority: "medium",
    health: "healthy",
    dueDate: "2026-10-03",
    lastActivityAt: "2026-08-01T13:20:00Z",
    memberIds: ["u_priya", "u_maya", "u_ada"],
  },
  {
    id: "p_ds",
    name: "Design System 2.0",
    slug: "design-system-2",
    hue: "rose",
    status: "paused",
    progress: 34,
    pinned: true,
    description: "Consolidate Orbit's components into a single themed token layer.",
    priority: "low",
    health: "watch",
    dueDate: "2026-11-15",
    lastActivityAt: "2026-07-30T09:00:00Z",
    memberIds: ["u_lena", "u_ines", "u_maya"],
  },
  {
    id: "p_onboarding",
    name: "Onboarding Revamp",
    slug: "onboarding-revamp",
    hue: "emerald",
    status: "off_track",
    progress: 23,
    pinned: true,
    description: "Rework first-run onboarding to lift week-one activation.",
    priority: "high",
    health: "critical",
    dueDate: "2026-08-15",
    lastActivityAt: "2026-08-01T11:05:00Z",
    memberIds: ["u_ines", "u_maya", "u_marcus", "u_ada"],
  },
  {
    id: "p_research",
    name: "Customer Research Hub",
    slug: "customer-research-hub",
    hue: "sky",
    status: "on_track",
    progress: 66,
    pinned: false,
    description: "A living home for interviews, insights, and research synthesis.",
    priority: "medium",
    health: "healthy",
    dueDate: "2026-09-28",
    lastActivityAt: "2026-08-01T10:15:00Z",
    memberIds: ["u_marcus", "u_maya", "u_priya"],
  },
];

/** The single "pick up where you left off" item on Home. */
export const continueItem: ContinueItem = {
  projectId: "p_mobile",
  projectName: "Mobile App Redesign",
  projectHue: "indigo",
  taskTitle: "Finalize the onboarding flow",
  updatedAgo: "20m",
  href: "/projects/mobile-app-redesign",
};

/** A short, deliberate set of tasks to move today. */
export const focusTasks: FocusTask[] = [
  {
    id: "t_growth",
    title: "Review Q3 growth results",
    projectName: "Q3 Growth Experiments",
    projectHue: "amber",
    priority: "high",
    due: "2:30 PM",
    done: false,
  },
  {
    id: "t_billing",
    title: "Approve billing migration plan",
    projectName: "Billing Platform v2",
    projectHue: "sky",
    priority: "medium",
    due: "4:00 PM",
    done: false,
  },
  {
    id: "t_copy",
    title: "Sign off on onboarding copy",
    projectName: "Onboarding Revamp",
    projectHue: "emerald",
    priority: "low",
    due: "Today",
    done: false,
  },
];

export const favorites: Favorite[] = [
  { id: "f_roadmap", label: "Product Roadmap", href: "/documents/roadmap", kind: "document" },
  { id: "f_wiki", label: "Engineering Wiki", href: "/documents/wiki", kind: "document" },
  { id: "f_myissues", label: "My Issues", href: "/tasks?assignee=me", kind: "view" },
];

/** Today's calendar — kinds drive the colored rule beside each event. */
export const schedule: ScheduleEvent[] = [
  { id: "e_standup", title: "Team standup", start: "09:30", end: "09:45", kind: "meeting" },
  { id: "e_focus", title: "Focus: onboarding flow", start: "10:00", end: "11:30", kind: "focus" },
  { id: "e_growth", title: "Q3 growth review", start: "14:30", end: "15:15", kind: "review" },
  { id: "e_billing", title: "Billing migration sync", start: "16:00", end: "16:30", kind: "meeting" },
  { id: "e_gym", title: "Run", start: "18:00", end: "18:45", kind: "personal" },
];

/** The activity pulse — most recent first. */
export const activity: ActivityItem[] = [
  {
    id: "a1",
    actorName: "Ada Reyes",
    actorInitials: "AR",
    actorHue: "indigo",
    action: "moved 3 tasks to review in",
    target: "Mobile App Redesign",
    time: "8m",
    kind: "moved",
  },
  {
    id: "a2",
    actorName: "Priya Nair",
    actorInitials: "PN",
    actorHue: "emerald",
    action: "shipped a pull request in",
    target: "Billing Platform v2",
    time: "26m",
    kind: "shipped",
  },
  {
    id: "a3",
    actorName: "Theo Lindqvist",
    actorInitials: "TL",
    actorHue: "amber",
    action: "mentioned you in",
    target: "Q3 Growth Experiments",
    time: "1h",
    kind: "mentioned",
  },
  {
    id: "a4",
    actorName: "Ines Duarte",
    actorInitials: "ID",
    actorHue: "rose",
    action: "commented on",
    target: "Design System 2.0",
    time: "2h",
    kind: "commented",
  },
  {
    id: "a5",
    actorName: "Ada Reyes",
    actorInitials: "AR",
    actorHue: "indigo",
    action: "completed a milestone in",
    target: "Onboarding Revamp",
    time: "3h",
    kind: "completed",
  },
  {
    id: "a6",
    actorName: "Marcus Bell",
    actorInitials: "MB",
    actorHue: "sky",
    action: "created 5 issues in",
    target: "Customer Research Hub",
    time: "4h",
    kind: "created",
  },
];
