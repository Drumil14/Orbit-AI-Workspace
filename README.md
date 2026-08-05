# Orbit

**The workspace that keeps everything in motion.**

Orbit is a calm, fast **Workspace OS** that unifies projects, tasks, and documents into a single operating-system-style shell, so a team always knows what to work on next. It is a portfolio-grade front-end: there is no backend yet, but every layer is built so a real API can drop in with near-zero component changes.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white" />
  <img alt="Base UI" src="https://img.shields.io/badge/Base%20UI-headless-6B72E8" />
</p>

---

## Highlights

- **An OS-style shell**, not a page stack: a command spine, a sidebar, a work surface, and an agenda rail, rendered as a server component so the frame and its data appear with no client waterfall.
- **Ambient atmosphere.** Each workspace owns a hue. Because it lives on a registered CSS `@property`, switching workspaces cross-fades the whole frame's color instead of snapping. This is Orbit's identity.
- **Derived intelligence, never faked.** A pure-function layer reads what the app already knows (status, health, due dates, blockers, activity) and surfaces the few signals a person needs the moment a page loads.
- **Backend-ready by design.** A single Promise-returning data seam sits between the UI and its data. Today it resolves from in-memory seeds; swapping to a real API is a one-file change.
- **Taste-first.** Generated geometric glyphs instead of stock avatars, one restrained accent, layered surfaces over heavy shadows, a WebGL specular primary button, and reduced-motion honored throughout.

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Runtime | React 19 |
| Language | TypeScript 5 |
| Primitives | [Base UI](https://base-ui.com) (headless), with shadcn-style wrappers |
| Styling | Tailwind CSS v4 (CSS-first `@theme`), `tw-animate-css` |
| Data | TanStack Query over a Promise-based data seam |
| Animation | Framer Motion, plus `ogl` (WebGL) for the specular button |
| Forms | react-hook-form + zod |
| Extras | next-themes, sonner, cmdk, lucide-react, Geist font, DiceBear |

> **Note on Next.js.** This project runs a customized Next 16 with a few breaking changes from the norm. Most relevant: the middleware convention is renamed to `proxy.ts`, and `cookies()` is async. The bundled docs in `node_modules/next/dist/docs/` are the source of truth. See `AGENTS.md`.

---

## Getting started

Requirements: Node 20+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app gates behind a demo login, so you will land on `/login` first.

### Signing in

It is a demo, so authentication is presence-of-a-cookie only. Any email and password work (or none). Pressing **Log in** sets a session cookie and opens the workspace; **Log out** clears it. Because it is a session cookie, a fresh browser session always starts at the login screen.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

---

## Architecture

Orbit is organized around three clean seams so the UI never depends on where its data or intelligence comes from.

### 1. The data seam (`src/lib/data/queries.ts`)

Every data access is an `async` function returning a Promise. Today they resolve from in-memory seeds (`seed*.ts`, `people.ts`); later each becomes a `fetch`. Callers only ever see the Promise signatures.

- **Shell chrome** (user, workspaces, sidebar) resolves instantly, so the frame never flashes a skeleton.
- **Page content** simulates latency inside the client hooks (`src/hooks/use-*.ts`), so real loading states are exercised without slowing the frame.

### 2. The intelligence layer (`src/lib/insights.ts`)

Pure functions that **derive** signals from data the app already holds: attention items, upcoming deadlines, blockers, a synthesized Home brief, next-step suggestions. Nothing is fabricated. It runs client-side, so date math uses the viewer's clock and never drifts across hydration.

### 3. The type contracts (`src/types/index.ts`)

Domain models (User, Workspace, Project, Task, Document, and more) that both the mock layer and a future backend fulfill. Components depend on these, never on the source.

### The shell (`src/app/(workspace)/layout.tsx`)

```
+-- Command spine (breadcrumb, command palette, notifications) --+
| Sidebar        |        Work surface        |  Agenda rail     |
| workspaces,    |        (active screen)     |  schedule +      |
| favorites,     |                            |  activity        |
| pinned, nav    |                            |                  |
+---------------- User menu -----------------------------------+
```

A server component renders the frame and its data up front. Client providers (theme, query, tooltips, toasts, motion, ambient/shell/workspace state) layer inside it. A `cmdk` command palette (Cmd/Ctrl + K) overlays everything.

---

## Design system (`src/app/globals.css`)

- **Color** is authored in OKLCH for perceptually even ramps: warm zinc neutrals (never pure white, never dead gray), one soft-indigo accent, muted status colors.
- **Depth** comes from layered surfaces (`sidebar < background < card`), not heavy shadows.
- **Ambient hue** is a registered `@property`, so it interpolates when the active workspace changes.
- **Texture:** a near-subliminal dot grid gives the work surface a paper quality.
- **Identity, not status:** people and projects use generated geometric glyphs (DiceBear) colored by an identity hue kept deliberately separate from status color.

---

## Screens

| Route | Screen |
| --- | --- |
| `/login` | Demo auth, brand panel with a live orbital system |
| `/` | Home: continue working, synthesized brief, today's focus, pinned projects |
| `/projects` | Projects overview: featured project, filters, digest grid |
| `/projects/[slug]` | Project detail: hero, tasks, team, timeline, documents, AI summary |
| `/tasks` | Task board and summary |
| `/documents` | Document board |
| `/documents/[slug]` | Document reader |
| `/calendar` | Schedule view |
| `/settings` | Profile, workspace, appearance, notifications |

---

## Project structure

```
src/
  app/
    (workspace)/        # the authed OS shell and its screens
    login/              # demo auth screen
    icon.svg            # favicon (the Orbit mark)
    globals.css         # design tokens and ambient system
  components/
    ui/                 # Base UI wrappers (design-system primitives)
    common/             # shared building blocks (Card, Logo, OrbitalField, ...)
    layout/             # the shell (sidebar, spine, agenda rail, providers)
    home/ projects/ tasks/ documents/ calendar/ settings/ command/
  hooks/                # TanStack Query hooks per feature
  lib/
    data/               # the data seam and seeds
    insights.ts         # the derived-intelligence layer
    ...                 # accent, format, identity, motion, status helpers
  types/                # domain contracts
  proxy.ts              # auth gate (Next 16's renamed middleware)
```

---

## Roadmap

- Swap the in-memory seeds for a real API (FastAPI). By design this touches only `src/lib/data/`.
- Real authentication in place of the demo cookie gate.
- Wire the write paths (create and edit projects, tasks, and documents).

---

## Notes

This is a personal portfolio project. Data is mock, but the intelligence surfaced from it is always derived, never invented. The goal is a product that feels shipped, down to the details.
