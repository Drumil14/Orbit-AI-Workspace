import type { AccentHue } from "@/types";

/**
 * The generative identity engine.
 *
 * Every workspace, project, and person gets a unique abstract mark instead of a
 * colored circle with a letter. The mark is *derived* from a seed (the entity's
 * name or id) and its hue, so it is stable across renders and recognisable at a
 * glance, the way Linear and Figma give each entity its own generated glyph.
 *
 * Three harmonised stops per hue (deep, mid, light) keep the marks in the same
 * colour language as the rest of the app; the geometry (gradient direction, the
 * placement and size of the shapes) is what makes each one distinct.
 */
export const identityPalette: Record<AccentHue, [string, string, string]> = {
  indigo: ["#4338ca", "#6366f1", "#c7d2fe"],
  emerald: ["#047857", "#10b981", "#a7f3d0"],
  amber: ["#b45309", "#f59e0b", "#fde68a"],
  rose: ["#be123c", "#f43f5e", "#fecdd3"],
  sky: ["#0369a1", "#0ea5e9", "#bae6fd"],
  slate: ["#334155", "#64748b", "#e2e8f0"],
};

/** FNV-1a: a small, stable string hash (same seed always yields the same mark). */
function hashSeed(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — a tiny deterministic PRNG seeded by the hash. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CORNERS: Array<[number, number]> = [
  [0, 0],
  [100, 0],
  [0, 100],
  [100, 100],
  [50, 0],
  [100, 50],
  [50, 100],
  [0, 50],
];

const GRADIENTS = [
  { x1: 0, y1: 0, x2: 100, y2: 100 },
  { x1: 100, y1: 0, x2: 0, y2: 100 },
  { x1: 0, y1: 100, x2: 100, y2: 0 },
  { x1: 50, y1: 0, x2: 50, y2: 100 },
  { x1: 0, y1: 50, x2: 100, y2: 50 },
];

export interface IdentityGeometry {
  gradient: { x1: number; y1: number; x2: number; y2: number };
  /** The dominant light shape, anchored to a corner. */
  primary: { cx: number; cy: number; r: number };
  /** An optional smaller accent shape for depth. */
  accent: { cx: number; cy: number; r: number; color: string; opacity: number } | null;
}

/** Derive the deterministic geometry for a seed + hue. */
export function identityGeometry(seed: string, hue: AccentHue): IdentityGeometry {
  const [deep, mid] = identityPalette[hue];
  const rand = mulberry32(hashSeed(seed) || 1);

  const gradient = GRADIENTS[Math.floor(rand() * GRADIENTS.length)]!;

  // The primary shape hugs a true corner so the mark reads as a bold sweep.
  const [pcx, pcy] = CORNERS[Math.floor(rand() * 4)]!;
  const primary = { cx: pcx, cy: pcy, r: 46 + Math.floor(rand() * 20) };

  const hasAccent = rand() < 0.72;
  const [acx, acy] = CORNERS[Math.floor(rand() * CORNERS.length)]!;
  const deepAccent = rand() < 0.5;
  const accent = hasAccent
    ? {
        cx: acx,
        cy: acy,
        r: 15 + Math.floor(rand() * 16),
        color: deepAccent ? deep : mid,
        opacity: deepAccent ? 0.5 : 0.72,
      }
    : null;

  return { gradient, primary, accent };
}
