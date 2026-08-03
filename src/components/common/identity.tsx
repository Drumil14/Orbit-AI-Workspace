"use client";

import { useId } from "react";
import { identityGeometry, identityPalette } from "@/lib/identity";
import { cn } from "@/lib/utils";
import type { AccentHue } from "@/types";

interface IdentityProps {
  /** The stable seed — a name or id. Same seed always renders the same mark. */
  seed: string;
  hue: AccentHue;
  /**
   * Sizing and corner-radius come from `className` (e.g. "size-9 rounded-xl" or
   * "size-full rounded-full"), so one component serves square glyphs and round
   * avatars alike.
   */
  className?: string;
}

/**
 * A generated abstract identity: a hue gradient overlaid with hash-placed shapes
 * and a soft top-left sheen, clipped to whatever radius the caller sets. The SVG
 * itself is the clip (border-radius + overflow), so it drops cleanly into a
 * square well or a round avatar.
 */
export function Identity({ seed, hue, className }: IdentityProps) {
  const uid = useId().replace(/:/g, "");
  const [deep, mid, light] = identityPalette[hue];
  const { gradient, primary, accent } = identityGeometry(seed, hue);
  const gid = `ig-${uid}`;
  const hid = `ih-${uid}`;

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-hidden
      className={cn(
        "shrink-0 overflow-hidden ring-1 ring-black/[0.07] ring-inset dark:ring-white/[0.08]",
        className,
      )}
    >
      <defs>
        <linearGradient
          id={gid}
          gradientUnits="userSpaceOnUse"
          x1={gradient.x1}
          y1={gradient.y1}
          x2={gradient.x2}
          y2={gradient.y2}
        >
          <stop offset="0%" stopColor={deep} />
          <stop offset="100%" stopColor={mid} />
        </linearGradient>
        <radialGradient id={hid} cx="26%" cy="18%" r="85%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="100" height="100" fill={`url(#${gid})`} />
      <circle cx={primary.cx} cy={primary.cy} r={primary.r} fill={light} opacity="0.9" />
      {accent && (
        <circle
          cx={accent.cx}
          cy={accent.cy}
          r={accent.r}
          fill={accent.color}
          opacity={accent.opacity}
        />
      )}
      <rect width="100" height="100" fill={`url(#${hid})`} />
    </svg>
  );
}
