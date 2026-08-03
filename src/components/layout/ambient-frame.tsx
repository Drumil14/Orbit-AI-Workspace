"use client";

import { atmosphere } from "@/lib/accent";
import { useAmbientContext } from "./ambient-provider";
import { useWorkspace } from "./workspace-provider";

/**
 * The frame that carries the atmosphere. Setting `--ambient` here lets it
 * interpolate (via the registered @property) whenever the hue changes — the
 * whole app breathes it. A screen can claim the hue (e.g. a project detail);
 * otherwise it follows the active workspace.
 */
export function AmbientFrame({ children }: { children: React.ReactNode }) {
  const { active } = useWorkspace();
  const { override } = useAmbientContext();
  const hue = override ?? active.hue;

  return (
    <div
      className="orbit-atmosphere flex min-h-dvh flex-col"
      style={{ "--ambient": atmosphere[hue] } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
