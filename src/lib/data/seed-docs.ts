import type { WorkspaceDoc } from "@/types";

/**
 * Long-form workspace documents (the Favorites in the sidebar). Fictional, but
 * shaped and written like the real thing so the reader screen has substance.
 * Keyed by slug — the reader route is a one-line lookup.
 */
export const workspaceDocs: Record<string, WorkspaceDoc> = {
  roadmap: {
    slug: "roadmap",
    title: "Product Roadmap",
    kind: "doc",
    description:
      "Where Orbit is headed this half, grouped by confidence, not calendar.",
    ownerId: "u_maya",
    updatedAt: "2026-08-01T09:15:00Z",
    contributorIds: ["u_maya", "u_ada", "u_ines", "u_theo"],
    blocks: [
      {
        type: "paragraph",
        text: "This is the single source of truth for what we're building and why. Items move left as our confidence grows. Nothing here is a promise until it reaches Now.",
      },
      { type: "heading", text: "Now: shipping this quarter" },
      {
        type: "list",
        items: [
          "Mobile app redesign: new navigation model to TestFlight.",
          "Billing platform v2: zero-downtime migration to metered billing.",
          "Onboarding revamp: lift week-one activation before the Aug 15 review.",
        ],
      },
      { type: "heading", text: "Next: validated, not yet started" },
      {
        type: "list",
        items: [
          "Design System 2.0: one themed token layer across every surface.",
          "Customer Research Hub: a living home for insights and synthesis.",
          "Command palette everywhere: ⌘K as the primary way to move.",
        ],
      },
      { type: "heading", text: "Later: bets we're still shaping" },
      {
        type: "list",
        items: [
          "Real-time presence and multiplayer editing.",
          "An offline-first sync engine.",
          "Workspace analytics that answer questions, not just show charts.",
        ],
      },
      { type: "divider" },
      {
        type: "callout",
        tone: "info",
        text: "To propose a change, open a thread in #product and tag it 'roadmap'. We review the board every other Monday.",
      },
    ],
  },

  wiki: {
    slug: "wiki",
    title: "Engineering Wiki",
    kind: "spec",
    description:
      "How we build at Helios Labs: architecture, conventions, and how to get started.",
    ownerId: "u_ada",
    updatedAt: "2026-07-31T16:40:00Z",
    contributorIds: ["u_ada", "u_priya", "u_noah", "u_lena"],
    blocks: [
      {
        type: "paragraph",
        text: "Start here on your first week. This wiki is the shared brain of the team. If you learn something the hard way, add it back.",
      },
      { type: "heading", text: "Architecture" },
      {
        type: "paragraph",
        text: "The app is a Next.js App Router front end talking to a FastAPI service over a typed data seam. Components never fetch directly; they depend on the query layer, so swapping mock data for the real API is a one-file change.",
      },
      {
        type: "list",
        items: [
          "UI: Next.js + TypeScript, styled with Tailwind and Base UI primitives.",
          "Data: TanStack Query hooks over an async query seam.",
          "Backend: FastAPI + Postgres (arriving behind the same contracts).",
        ],
      },
      { type: "heading", text: "Conventions" },
      {
        type: "checklist",
        items: [
          { text: "Keep components small and composable (~150 lines).", done: true },
          { text: "Every feature ships loading, empty, and error states.", done: true },
          { text: "One accent color; hierarchy comes from spacing and weight.", done: true },
          { text: "Add a dependency only with a measurable benefit.", done: false },
        ],
      },
      { type: "heading", text: "Getting started" },
      {
        type: "list",
        items: [
          "Clone the repo and run `npm install`, then `npm run dev`.",
          "Read the design tokens in globals.css before touching UI.",
          "Pair with your onboarding buddy on your first pull request.",
        ],
      },
      { type: "divider" },
      {
        type: "callout",
        tone: "warning",
        text: "Never commit secrets. Local config lives in .env.local, which is gitignored. Ask an admin for the shared values.",
      },
    ],
  },
};
