import type { ProjectDetail } from "@/types";

/**
 * Rich, per-project detail — the payload the Project Detail screen renders.
 *
 * Authored (not generated) so each project reads like a real, distinct effort:
 * a different AI briefing, team, and pulse. Everything is fictional. Shaped
 * exactly like the FastAPI response the backend will return, keyed by slug so
 * the query layer is a one-line lookup.
 *
 * `DetailExtras` is everything on top of the base `Project` (which lives in
 * seed.ts) — the query merges the two.
 */
export type DetailExtras = Pick<
  ProjectDetail,
  "members" | "ai" | "continuePoint" | "timeline" | "tasks" | "documents" | "feed"
>;

export const projectDetails: Record<string, DetailExtras> = {
  "mobile-app-redesign": {
    members: [
      { userId: "u_maya", role: "Product Lead" },
      { userId: "u_ada", role: "Eng Lead" },
      { userId: "u_noah", role: "iOS Engineer" },
      { userId: "u_ines", role: "Designer" },
      { userId: "u_lena", role: "Design Systems" },
    ],
    ai: {
      goal: "Ship the redesigned iOS app around the new navigation model to TestFlight by mid-September.",
      risks: [
        "Onboarding flow is the last blocker and still in review.",
        "Design-system tokens are shared with a paused project.",
      ],
      recommendation:
        "Lock the onboarding copy this week so Noah can start the final integration pass.",
      estimatedCompletion: "Sep 12",
      confidence: 78,
    },
    continuePoint: {
      kind: "document",
      title: "Onboarding flow: final spec",
      context: "Product spec · edited by you",
      updatedAgo: "20m",
      href: "/projects/mobile-app-redesign",
    },
    timeline: [
      { id: "m_t1", kind: "milestone", title: "Navigation model approved", detail: "Design review sign-off", actorId: "u_ines", at: "2026-07-28T15:00:00Z" },
      { id: "m_t2", kind: "shipped", title: "Shipped new tab bar to internal build", actorId: "u_noah", at: "2026-07-30T10:20:00Z" },
      { id: "m_t3", kind: "status", title: "Moved to On track", detail: "Health improved after review", at: "2026-07-31T09:00:00Z" },
      { id: "m_t4", kind: "ai", title: "Orbit flagged onboarding as the critical path", at: "2026-08-01T08:30:00Z" },
    ],
    tasks: [
      { id: "m_k1", title: "Finalize the onboarding flow", status: "in_review", priority: "high", assigneeId: "u_maya", due: "Today", group: "This week" },
      { id: "m_k2", title: "Integrate new tab bar animations", status: "in_progress", priority: "high", assigneeId: "u_noah", due: "Fri", group: "This week" },
      { id: "m_k3", title: "Audit empty states across screens", status: "todo", priority: "medium", assigneeId: "u_ines", due: "Aug 8", group: "Next week" },
      { id: "m_k4", title: "Wire up haptics for key actions", status: "todo", priority: "low", assigneeId: "u_noah", group: "Next week" },
      { id: "m_k5", title: "Set up dark-mode snapshot tests", status: "done", priority: "medium", assigneeId: "u_ada", group: "Done" },
    ],
    documents: [
      { id: "m_d1", title: "Onboarding flow: final spec", kind: "spec", excerpt: "The five-step first-run experience, with copy and edge cases.", ownerId: "u_maya", updatedAt: "2026-08-01T13:40:00Z" },
      { id: "m_d2", title: "Navigation model", kind: "design", excerpt: "Tab structure, gestures, and the transition system.", ownerId: "u_ines", updatedAt: "2026-07-29T16:10:00Z" },
      { id: "m_d3", title: "Release checklist v3.0", kind: "doc", excerpt: "Everything that must be green before TestFlight.", ownerId: "u_ada", updatedAt: "2026-07-31T11:00:00Z" },
    ],
    feed: [
      { id: "m_f1", kind: "comment", actorId: "u_ada", body: "Left notes on the onboarding spec, mostly copy nits.", at: "2026-08-01T13:52:00Z" },
      { id: "m_f2", kind: "upload", actorId: "u_ines", body: "Uploaded updated empty-state illustrations.", at: "2026-08-01T12:10:00Z" },
      { id: "m_f3", kind: "ai", body: "Onboarding is the only task on the critical path, so it's worth protecting focus time.", at: "2026-08-01T08:30:00Z" },
      { id: "m_f4", kind: "status", actorId: "u_noah", body: "Moved “tab bar animations” to In progress.", at: "2026-07-31T17:45:00Z" },
    ],
  },

  "q3-growth-experiments": {
    members: [
      { userId: "u_theo", role: "Growth Lead" },
      { userId: "u_maya", role: "Product" },
      { userId: "u_marcus", role: "Research" },
    ],
    ai: {
      goal: "Run and read out eight activation experiments to find two worth scaling in Q4.",
      risks: [
        "Two experiments are under-powered and won't reach significance in time.",
        "Instrumentation gaps mean the paywall test can't be trusted yet.",
      ],
      recommendation:
        "Cut the two weakest experiments and reallocate traffic to the pricing test.",
      estimatedCompletion: "~3 weeks",
      confidence: 61,
    },
    continuePoint: {
      kind: "document",
      title: "Q3 experiment readout",
      context: "Analysis doc · edited by Theo",
      updatedAgo: "1h",
      href: "/projects/q3-growth-experiments",
    },
    timeline: [
      { id: "g_t1", kind: "created", title: "Project created", actorId: "u_theo", at: "2026-07-06T09:00:00Z" },
      { id: "g_t2", kind: "shipped", title: "Launched pricing-page experiment", actorId: "u_theo", at: "2026-07-22T14:00:00Z" },
      { id: "g_t3", kind: "status", title: "Moved to At risk", detail: "Two tests under-powered", at: "2026-07-30T10:00:00Z" },
      { id: "g_t4", kind: "ai", title: "Orbit suggested cutting weak experiments", at: "2026-08-01T07:45:00Z" },
    ],
    tasks: [
      { id: "g_k1", title: "Read out pricing-page results", status: "in_progress", priority: "high", assigneeId: "u_theo", due: "Today", group: "This week" },
      { id: "g_k2", title: "Fix paywall event instrumentation", status: "todo", priority: "high", assigneeId: "u_marcus", due: "Wed", group: "This week" },
      { id: "g_k3", title: "Kill under-powered referral test", status: "todo", priority: "medium", assigneeId: "u_theo", group: "This week" },
      { id: "g_k4", title: "Draft Q4 scaling proposal", status: "todo", priority: "low", assigneeId: "u_maya", group: "Next week" },
    ],
    documents: [
      { id: "g_d1", title: "Q3 experiment readout", kind: "doc", excerpt: "Running analysis of all eight experiments and their lift.", ownerId: "u_theo", updatedAt: "2026-08-01T12:40:00Z" },
      { id: "g_d2", title: "Experiment tracker", kind: "sheet", excerpt: "Status, traffic split, and significance for each test.", ownerId: "u_marcus", updatedAt: "2026-07-31T09:30:00Z" },
    ],
    feed: [
      { id: "g_f1", kind: "ai", body: "The referral test needs ~9 more days to reach significance, likely not worth it.", at: "2026-08-01T07:45:00Z" },
      { id: "g_f2", kind: "comment", actorId: "u_theo", body: "Pricing test is looking like a clear winner so far.", at: "2026-07-31T16:20:00Z" },
      { id: "g_f3", kind: "status", actorId: "u_marcus", body: "Flagged the paywall instrumentation gap.", at: "2026-07-30T11:05:00Z" },
    ],
  },

  "billing-platform-v2": {
    members: [
      { userId: "u_priya", role: "Eng Lead" },
      { userId: "u_maya", role: "Product" },
      { userId: "u_ada", role: "Engineer" },
    ],
    ai: {
      goal: "Migrate every customer to the metered billing platform with zero downtime.",
      risks: ["Legacy invoices need a one-time backfill that hasn't been rehearsed."],
      recommendation:
        "Run the backfill against a staging snapshot before scheduling the cutover.",
      estimatedCompletion: "Oct 3",
      confidence: 82,
    },
    continuePoint: {
      kind: "task",
      title: "Review the migration runbook",
      context: "In review · assigned to you",
      updatedAgo: "40m",
      href: "/projects/billing-platform-v2",
    },
    timeline: [
      { id: "b_t1", kind: "milestone", title: "Metering service in production", actorId: "u_priya", at: "2026-07-24T13:00:00Z" },
      { id: "b_t2", kind: "shipped", title: "Shipped invoice preview API", actorId: "u_ada", at: "2026-07-31T10:40:00Z" },
      { id: "b_t3", kind: "comment", title: "Runbook posted for review", actorId: "u_priya", at: "2026-08-01T09:00:00Z" },
    ],
    tasks: [
      { id: "b_k1", title: "Review the migration runbook", status: "in_review", priority: "high", assigneeId: "u_maya", due: "Today", group: "This week" },
      { id: "b_k2", title: "Rehearse invoice backfill on staging", status: "in_progress", priority: "high", assigneeId: "u_priya", due: "Thu", group: "This week" },
      { id: "b_k3", title: "Add metering alerts to on-call", status: "todo", priority: "medium", assigneeId: "u_ada", group: "Next week" },
      { id: "b_k4", title: "Draft customer comms for cutover", status: "done", priority: "low", assigneeId: "u_maya", group: "Done" },
    ],
    documents: [
      { id: "b_d1", title: "Migration runbook", kind: "doc", excerpt: "Step-by-step cutover plan with rollback checkpoints.", ownerId: "u_priya", updatedAt: "2026-08-01T13:20:00Z" },
      { id: "b_d2", title: "Metering architecture", kind: "spec", excerpt: "How usage events flow into billable line items.", ownerId: "u_ada", updatedAt: "2026-07-30T15:00:00Z" },
    ],
    feed: [
      { id: "b_f1", kind: "comment", actorId: "u_priya", body: "Runbook is ready for a second pair of eyes.", at: "2026-08-01T13:20:00Z" },
      { id: "b_f2", kind: "upload", actorId: "u_ada", body: "Attached the staging snapshot for the backfill test.", at: "2026-08-01T11:00:00Z" },
      { id: "b_f3", kind: "ai", body: "Cutover risk is low provided the backfill is rehearsed once end-to-end.", at: "2026-08-01T09:10:00Z" },
    ],
  },

  "design-system-2": {
    members: [
      { userId: "u_lena", role: "Lead" },
      { userId: "u_ines", role: "Designer" },
      { userId: "u_maya", role: "Product" },
    ],
    ai: {
      goal: "Unify Orbit's components behind a single themed token layer.",
      risks: ["Paused while the mobile redesign borrows the same tokens."],
      recommendation:
        "Resume once the mobile app locks its token usage to avoid rework.",
      estimatedCompletion: "Nov 15",
      confidence: 54,
    },
    continuePoint: {
      kind: "document",
      title: "Token architecture v2",
      context: "Spec · edited by Lena",
      updatedAgo: "2d",
      href: "/projects/design-system-2",
    },
    timeline: [
      { id: "d_t1", kind: "created", title: "Project created", actorId: "u_lena", at: "2026-06-18T09:00:00Z" },
      { id: "d_t2", kind: "milestone", title: "Primitive layer defined", actorId: "u_lena", at: "2026-07-10T12:00:00Z" },
      { id: "d_t3", kind: "status", title: "Paused pending mobile token lock", at: "2026-07-30T09:00:00Z" },
    ],
    tasks: [
      { id: "d_k1", title: "Reconcile spacing scale with mobile", status: "todo", priority: "medium", assigneeId: "u_lena", group: "Blocked" },
      { id: "d_k2", title: "Document semantic color tokens", status: "in_progress", priority: "low", assigneeId: "u_ines", group: "This week" },
      { id: "d_k3", title: "Ship primitive token package", status: "done", priority: "medium", assigneeId: "u_lena", group: "Done" },
    ],
    documents: [
      { id: "d_d1", title: "Token architecture v2", kind: "spec", excerpt: "Primitive → semantic → component token layers.", ownerId: "u_lena", updatedAt: "2026-07-30T10:00:00Z" },
      { id: "d_d2", title: "Component inventory", kind: "sheet", excerpt: "Every component and its migration status.", ownerId: "u_ines", updatedAt: "2026-07-28T14:00:00Z" },
    ],
    feed: [
      { id: "d_f1", kind: "status", actorId: "u_maya", body: "Paused until mobile locks token usage.", at: "2026-07-30T09:00:00Z" },
      { id: "d_f2", kind: "comment", actorId: "u_lena", body: "Primitive layer is stable. Semantic layer is next.", at: "2026-07-28T15:30:00Z" },
    ],
  },

  "onboarding-revamp": {
    members: [
      { userId: "u_ines", role: "Design Lead" },
      { userId: "u_maya", role: "Product" },
      { userId: "u_marcus", role: "Research" },
      { userId: "u_ada", role: "Engineer" },
    ],
    ai: {
      goal: "Rework first-run onboarding to lift week-one activation before the Aug 15 review.",
      risks: [
        "Behind schedule: three of five screens are unbuilt.",
        "Research findings landed late and changed the flow.",
        "No engineer is assigned to the final build.",
      ],
      recommendation:
        "Pull Ada in this week and cut scope to the two highest-impact screens.",
      estimatedCompletion: "At risk for Aug 15",
      confidence: 42,
    },
    continuePoint: {
      kind: "document",
      title: "Activation research: synthesis",
      context: "Research doc · edited by Marcus",
      updatedAgo: "3h",
      href: "/projects/onboarding-revamp",
    },
    timeline: [
      { id: "o_t1", kind: "created", title: "Project created", actorId: "u_maya", at: "2026-07-01T09:00:00Z" },
      { id: "o_t2", kind: "milestone", title: "Activation research complete", actorId: "u_marcus", at: "2026-07-29T16:00:00Z" },
      { id: "o_t3", kind: "status", title: "Moved to Off track", detail: "Build behind schedule", at: "2026-07-31T09:00:00Z" },
      { id: "o_t4", kind: "ai", title: "Orbit recommended cutting scope", at: "2026-08-01T08:00:00Z" },
    ],
    tasks: [
      { id: "o_k1", title: "Rebuild welcome screen from research", status: "in_progress", priority: "high", assigneeId: "u_ines", due: "Today", group: "This week" },
      { id: "o_k2", title: "Assign an engineer to the final build", status: "todo", priority: "high", assigneeId: "u_maya", due: "Mon", group: "This week" },
      { id: "o_k3", title: "Cut low-impact permission screen", status: "todo", priority: "medium", assigneeId: "u_maya", group: "This week" },
      { id: "o_k4", title: "Synthesize interview findings", status: "done", priority: "high", assigneeId: "u_marcus", group: "Done" },
    ],
    documents: [
      { id: "o_d1", title: "Activation research: synthesis", kind: "doc", excerpt: "What actually moves week-one activation, from 14 interviews.", ownerId: "u_marcus", updatedAt: "2026-08-01T11:05:00Z" },
      { id: "o_d2", title: "Onboarding flow v2", kind: "design", excerpt: "Revised five-screen flow, three still in progress.", ownerId: "u_ines", updatedAt: "2026-07-31T18:00:00Z" },
    ],
    feed: [
      { id: "o_f1", kind: "ai", body: "Two screens drive most of the projected activation lift. The rest can wait.", at: "2026-08-01T08:00:00Z" },
      { id: "o_f2", kind: "comment", actorId: "u_ines", body: "Reworking the welcome screen around the new findings now.", at: "2026-08-01T10:40:00Z" },
      { id: "o_f3", kind: "status", actorId: "u_maya", body: "Flagged that the final build has no engineer.", at: "2026-07-31T13:00:00Z" },
    ],
  },

  "customer-research-hub": {
    members: [
      { userId: "u_marcus", role: "Research Lead" },
      { userId: "u_maya", role: "Product" },
      { userId: "u_priya", role: "Engineer" },
    ],
    ai: {
      goal: "Give the team one living home for interviews, insights, and synthesis.",
      risks: ["Tagging is inconsistent, so search still misses relevant insights."],
      recommendation:
        "Agree a small, fixed insight taxonomy before importing older studies.",
      estimatedCompletion: "Sep 28",
      confidence: 74,
    },
    continuePoint: {
      kind: "document",
      title: "Insight taxonomy proposal",
      context: "Doc · edited by Marcus",
      updatedAgo: "5h",
      href: "/projects/customer-research-hub",
    },
    timeline: [
      { id: "r_t1", kind: "milestone", title: "Interview library imported", actorId: "u_marcus", at: "2026-07-20T10:00:00Z" },
      { id: "r_t2", kind: "shipped", title: "Full-text search shipped", actorId: "u_priya", at: "2026-07-30T15:00:00Z" },
      { id: "r_t3", kind: "comment", title: "Taxonomy proposal opened for feedback", actorId: "u_marcus", at: "2026-08-01T09:00:00Z" },
    ],
    tasks: [
      { id: "r_k1", title: "Finalize the insight taxonomy", status: "in_review", priority: "medium", assigneeId: "u_marcus", due: "Fri", group: "This week" },
      { id: "r_k2", title: "Re-tag the last 20 interviews", status: "todo", priority: "medium", assigneeId: "u_marcus", group: "Next week" },
      { id: "r_k3", title: "Add saved-view support to search", status: "in_progress", priority: "low", assigneeId: "u_priya", group: "This week" },
      { id: "r_k4", title: "Import 2025 studies", status: "done", priority: "low", assigneeId: "u_marcus", group: "Done" },
    ],
    documents: [
      { id: "r_d1", title: "Insight taxonomy proposal", kind: "doc", excerpt: "A small fixed vocabulary for tagging every insight.", ownerId: "u_marcus", updatedAt: "2026-08-01T10:15:00Z" },
      { id: "r_d2", title: "Interview index", kind: "sheet", excerpt: "Every interview, participant, and theme.", ownerId: "u_marcus", updatedAt: "2026-07-30T12:00:00Z" },
    ],
    feed: [
      { id: "r_f1", kind: "comment", actorId: "u_marcus", body: "Opened the taxonomy proposal. Would love thoughts by Friday.", at: "2026-08-01T10:15:00Z" },
      { id: "r_f2", kind: "upload", actorId: "u_priya", body: "Added saved-view mockups to the search doc.", at: "2026-07-31T14:30:00Z" },
      { id: "r_f3", kind: "ai", body: "Search recall would jump most from consistent tagging, not more features.", at: "2026-07-31T08:00:00Z" },
    ],
  },
};
