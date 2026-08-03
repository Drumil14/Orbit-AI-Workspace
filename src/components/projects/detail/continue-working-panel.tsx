"use client";

import { ArrowRight, CircleCheck, FileText } from "lucide-react";
import { toast } from "sonner";
import { CardEyebrow } from "@/components/common/card";
import { SpecularCTA } from "@/components/common/specular-cta";
import { accentMark } from "@/lib/accent";
import { cn } from "@/lib/utils";
import type { AccentHue, ContinuePoint } from "@/types";

/**
 * The one clear next action — a thin, full-width strip that forms the visual
 * path from the header into the work. It carries a whisper of the project's
 * atmosphere so it reads as the warm front door back in, and lifts on hover
 * because the whole strip is a single affordance.
 */
export function ContinueWorkingPanel({
  point,
  hue,
}: {
  point: ContinuePoint;
  hue: AccentHue;
}) {
  const Icon = point.kind === "document" ? FileText : CircleCheck;

  return (
    <div
      className="group/panel flex flex-col gap-4 overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-xs transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-border hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:pl-5"
      style={{
        background:
          "linear-gradient(100deg, color-mix(in oklab, var(--ambient) 6%, var(--card)), var(--card) 58%)",
      }}
    >
      <div className="flex min-w-0 items-center gap-4">
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-xl ring-1 ring-black/[0.04] ring-inset transition-transform duration-200 ease-out group-hover/panel:scale-[1.04]",
            accentMark[hue],
          )}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <CardEyebrow>Continue working</CardEyebrow>
          <p className="mt-1 truncate text-[0.95rem] font-semibold tracking-tight text-foreground">
            {point.title}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {point.context} · updated {point.updatedAgo} ago
          </p>
        </div>
      </div>

      <SpecularCTA
        className="self-start sm:self-auto"
        onClick={() => toast(`Resuming “${point.title}”`)}
      >
        Resume
        <ArrowRight className="size-4 transition-transform duration-200 group-hover/panel:translate-x-0.5" />
      </SpecularCTA>
    </div>
  );
}
